# Student Management System

A ready-to-run full-stack starter application using React + Vite, FastAPI, SQLAlchemy and MySQL.

## Features
- Student dashboard with total student count
- Add, view, edit and delete students
- Search students by name, email, course or roll number
- REST API with automatic Swagger documentation
- MySQL database integration
- CORS configured for local React development

## Architecture
React UI -> Axios HTTP request -> FastAPI REST API -> SQLAlchemy ORM -> MySQL

React does not connect directly to MySQL. The browser sends HTTP requests to FastAPI. FastAPI validates the request, runs database operations through SQLAlchemy, and returns JSON. React displays the returned JSON.

## Requirements
- Python 3.11+
- Node.js 20+
- MySQL 8+
- VS Code (recommended)

## 1. Create the MySQL database
Open MySQL Workbench and run:

```sql
CREATE DATABASE student_management;
```

## 2. Configure backend
Open a terminal in `backend`:

Windows PowerShell:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` and set your MySQL username and password. Example:
```env
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/student_management
FRONTEND_ORIGIN=http://localhost:5173
```

If your MySQL root account has no password, leave the password section empty:
`mysql+pymysql://root:@localhost:3306/student_management`

Start the API:
```powershell
uvicorn app.main:app --reload
```

Open:
- API: http://127.0.0.1:8000
- Swagger: http://127.0.0.1:8000/docs

The app creates the students table automatically on first startup.

## 3. Configure frontend
Open a second terminal in `frontend`:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Open the Vite URL shown in the terminal (normally http://localhost:5173).

## 4. Test the integration
1. Keep the FastAPI terminal running.
2. Keep the React terminal running.
3. Add a student in the React page.
4. Confirm the student appears in the list.
5. Refresh the page; the record should remain because it is stored in MySQL.
6. Open `/docs` and try `GET /api/students`.

## How frontend and backend are connected
1. `frontend/.env` stores `VITE_API_URL=http://127.0.0.1:8000`.
2. `frontend/src/services/api.js` creates an Axios client using that base URL.
3. `studentsService.js` sends GET, POST, PUT and DELETE requests to `/api/students`.
4. `backend/app/main.py` registers the student router and allows the local React origin through CORS.
5. `backend/app/routers/students.py` receives requests and calls SQLAlchemy.
6. `backend/app/models/student.py` defines the MySQL table structure.
7. FastAPI returns JSON; React updates the screen.

## Deployment overview
You need a managed MySQL provider, a backend host that supports Python/FastAPI, and a frontend host for static React files.

### Backend
- Push the project to GitHub.
- Create a Python web service on a host such as Render.
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Add environment variables: `DATABASE_URL` (managed MySQL connection string), `FRONTEND_ORIGIN` (your deployed frontend URL).
- Use a managed MySQL service separately; do not assume a local MySQL server is accessible from the cloud host.

### Frontend
- Import the same GitHub repository into Vercel.
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variable `VITE_API_URL` with the deployed backend URL, e.g. `https://your-api.example.com`.
- Redeploy after setting environment variables.

### Important deployment notes
- Update backend CORS to allow the exact deployed frontend origin.
- Never commit `.env` files or database passwords.
- Use HTTPS and a strong database password.
- This starter uses `Base.metadata.create_all` for easy local setup. For production upgrades, use Alembic migrations, managed secrets, backups, logging, and automated tests.

## Suggested viva explanation
"This project uses a three-layer architecture. React is the presentation layer. It sends REST API requests using Axios. FastAPI is the application layer; it validates input, applies business logic and communicates with MySQL through SQLAlchemy. MySQL is the data layer where student records are stored. The backend returns JSON responses, and React renders those responses. We keep database credentials on the backend, so the frontend never accesses MySQL directly."
