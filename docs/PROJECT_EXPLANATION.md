# Project explanation for presentation / viva

## Project title
Student Management System using React, FastAPI and MySQL.

## Problem statement
Educational institutions need a central application to maintain student information. Managing records manually can cause duplicate entries, slow searching and difficulty updating information. This project provides a web-based interface to manage student records.

## Technology roles
- React: builds the user interface in the browser.
- Axios: sends HTTP requests from React to the backend.
- FastAPI: exposes REST endpoints, validates incoming data and handles application logic.
- SQLAlchemy: maps Python objects to relational database records and executes database operations.
- MySQL: permanently stores student data.
- Swagger UI: allows developers to inspect and test API endpoints.

## Request lifecycle: Add a student
1. User fills the Add Student form in React.
2. React calls `studentsApi.create()` in `frontend/src/services/api.js`.
3. Axios sends a POST request to `/api/students` with JSON data.
4. FastAPI receives it in `backend/app/routers.py`.
5. Pydantic schema validates the input.
6. SQLAlchemy creates a Student model object and inserts it into MySQL.
7. FastAPI returns the created student as JSON.
8. React reloads the student list and displays the new record.

## Main API endpoints
- GET `/api/health` - health check
- GET `/api/dashboard` - dashboard totals
- GET `/api/students` - list/search students
- POST `/api/students` - create student
- GET `/api/students/{id}` - get one student
- PUT `/api/students/{id}` - update student
- DELETE `/api/students/{id}` - delete student

## Short explanation to tell the lecturer
"Our application follows a three-layer architecture. The frontend is developed using React. It communicates with the backend through REST APIs using Axios. The backend is developed using FastAPI, which validates requests and applies the application logic. SQLAlchemy is used as the ORM to communicate with the MySQL database. When a user adds or updates a student, React sends JSON data to FastAPI. FastAPI processes the request, stores the record in MySQL and returns a JSON response. React then refreshes the screen to show the updated data. The frontend never connects directly to the database, which keeps database credentials on the server side."
