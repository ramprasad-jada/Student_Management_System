from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from .database import get_db
from .models import Student
from .schemas import StudentCreate, StudentOut, StudentUpdate

router = APIRouter(prefix="/api", tags=["Students"])

@router.get("/health")
def health():
    return {"status": "ok", "service": "student-management-api"}

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    return {"total_students": db.query(Student).count()}

@router.get("/students", response_model=list[StudentOut])
def list_students(
    search: str = Query(default="", max_length=100),
    db: Session = Depends(get_db)
):
    query = db.query(Student)
    if search:
        term = f"%{search}%"
        query = query.filter(or_(
            Student.full_name.like(term),
            Student.email.like(term),
            Student.roll_number.like(term),
            Student.course.like(term)
        ))
    return query.order_by(Student.id.desc()).all()

@router.post("/students", response_model=StudentOut, status_code=201)
def create_student(payload: StudentCreate, db: Session = Depends(get_db)):
    student = Student(**payload.model_dump())
    db.add(student)
    try:
        db.commit()
        db.refresh(student)
        return student
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Roll number or email already exists")

@router.get("/students/{student_id}", response_model=StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/students/{student_id}", response_model=StudentOut)
def update_student(student_id: int, payload: StudentUpdate, db: Session = Depends(get_db)):
    student = db.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in payload.model_dump().items():
        setattr(student, key, value)
    try:
        db.commit()
        db.refresh(student)
        return student
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Roll number or email already exists")

@router.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}
