import { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Users, GraduationCap, Pencil, Trash2, RefreshCw, X } from 'lucide-react'
import { studentsApi } from './services/api'

const emptyForm = { roll_number: '', full_name: '', email: '', course: 'Computer Science', year: 1 }

export default function App() {
  const [students, setStudents] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function loadData(term = search) {
    setLoading(true); setError('')
    try {
      const [listRes, dashboardRes] = await Promise.all([
        studentsApi.list(term), studentsApi.dashboard()
      ])
      setStudents(listRes.data)
      setTotal(dashboardRes.data.total_students)
    } catch {
      setError('Could not connect to the backend. Check that FastAPI is running and the database settings are correct.')
    } finally { setLoading(false) }
  }

  useEffect(() => { loadData('') }, [])
  useEffect(() => {
    const timer = setTimeout(() => loadData(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const courseCount = useMemo(() => new Set(students.map(s => s.course)).size, [students])

  function openAdd() {
    setForm(emptyForm); setEditingId(null); setShowForm(true); setNotice('')
  }
  function openEdit(student) {
    setForm({ roll_number: student.roll_number, full_name: student.full_name, email: student.email, course: student.course, year: student.year })
    setEditingId(student.id); setShowForm(true); setNotice('')
  }
  async function submitForm(e) {
    e.preventDefault(); setError(''); setNotice('')
    try {
      if (editingId) await studentsApi.update(editingId, form)
      else await studentsApi.create(form)
      setShowForm(false); setNotice(editingId ? 'Student updated successfully.' : 'Student added successfully.')
      await loadData(search)
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to save student. Check the API and database.')
    }
  }
  async function deleteStudent(student) {
    if (!window.confirm(`Delete ${student.full_name}?`)) return
    try {
      await studentsApi.remove(student.id)
      setNotice('Student deleted successfully.')
      await loadData(search)
    } catch { setError('Unable to delete student.') }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-icon"><GraduationCap size={23}/></div><span>Campus<span className="brand-light">Desk</span></span></div>
        <div className="nav-label">WORKSPACE</div>
        <div className="nav-item active"><Users size={18}/> Students</div>
        <div className="sidebar-bottom"><div className="avatar">AD</div><div><b>Administrator</b><small>Management portal</small></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div><span className="eyebrow">CAMPUS MANAGEMENT</span><h1>Student Directory</h1><p>Manage student records from one place.</p></div><button className="btn btn-primary" onClick={openAdd}><Plus size={17}/> Add student</button></header>

        {error && <div className="alert error">{error}</div>}
        {notice && <div className="alert success">{notice}</div>}

        <section className="stats-grid">
          <div className="stat-card"><div className="stat-icon blue"><Users size={20}/></div><span>Total students</span><strong>{total}</strong><small>Records in database</small></div>
          <div className="stat-card"><div className="stat-icon purple"><GraduationCap size={20}/></div><span>Courses in view</span><strong>{courseCount}</strong><small>Distinct courses in current results</small></div>
          <div className="stat-card"><div className="stat-icon green"><Users size={20}/></div><span>Displayed records</span><strong>{students.length}</strong><small>Matching your search</small></div>
        </section>

        <section className="panel">
          <div className="panel-heading"><div><h2>All students</h2><p>Search and manage student information.</p></div><button className="icon-button" title="Refresh" onClick={() => loadData()}><RefreshCw size={17}/></button></div>
          <div className="toolbar"><div className="search-box"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, roll number or course..."/></div><span className="result-count">{students.length} result(s)</span></div>

          <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>ROLL NUMBER</th><th>COURSE</th><th>YEAR</th><th className="right">ACTIONS</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="5" className="empty">Loading student records...</td></tr> :
               students.length === 0 ? <tr><td colSpan="5" className="empty">No students found. Add your first student.</td></tr> :
               students.map(s => <tr key={s.id}><td><div className="student-cell"><div className="student-avatar">{s.full_name.split(' ').map(x => x[0]).slice(0,2).join('').toUpperCase()}</div><div><b>{s.full_name}</b><small>{s.email}</small></div></div></td><td><span className="roll">{s.roll_number}</span></td><td>{s.course}</td><td><span className="year-pill">Year {s.year}</span></td><td className="right"><button className="row-action" title="Edit" onClick={() => openEdit(s)}><Pencil size={16}/></button><button className="row-action danger" title="Delete" onClick={() => deleteStudent(s)}><Trash2 size={16}/></button></td></tr>)}
            </tbody></table></div>
        </section>
        <footer>CampusDesk · Student Management System <span>React + FastAPI + MySQL</span></footer>
      </main>

      {showForm && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowForm(false)}><div className="modal">
        <div className="modal-head"><div><h2>{editingId ? 'Edit student' : 'Add new student'}</h2><p>Enter the student details below.</p></div><button className="icon-button" onClick={() => setShowForm(false)}><X size={19}/></button></div>
        <form onSubmit={submitForm} className="student-form">
          <label>Full name<input required minLength="2" value={form.full_name} onChange={e => setForm({...form, full_name:e.target.value})} placeholder="e.g. Rahul Kumar"/></label>
          <label>Email address<input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="student@example.com"/></label>
          <label>Roll number<input required value={form.roll_number} onChange={e => setForm({...form, roll_number:e.target.value})} placeholder="e.g. 22CS001"/></label>
          <label>Course<select value={form.course} onChange={e => setForm({...form, course:e.target.value})}><option>Computer Science</option><option>Information Technology</option><option>Electronics</option><option>Mechanical Engineering</option><option>Business Administration</option></select></label>
          <label>Year<select value={form.year} onChange={e => setForm({...form, year:Number(e.target.value)})}><option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option><option value="4">Year 4</option></select></label>
          <div className="modal-actions"><button type="button" className="btn btn-muted" onClick={() => setShowForm(false)}>Cancel</button><button className="btn btn-primary" type="submit">{editingId ? 'Save changes' : 'Add student'}</button></div>
        </form>
      </div></div>}
    </div>
  )
}
