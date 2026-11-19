from sqlalchemy import Column, Integer, String
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    roll_number = Column(String(30), unique=True, nullable=False, index=True)
    full_name = Column(String(120), nullable=False, index=True)
    email = Column(String(150), unique=True, nullable=False, index=True)
    course = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
