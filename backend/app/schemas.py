from pydantic import BaseModel, ConfigDict, EmailStr, Field

class StudentCreate(BaseModel):
    roll_number: str = Field(min_length=1, max_length=30)
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    course: str = Field(min_length=2, max_length=100)
    year: int = Field(ge=1, le=8)

class StudentUpdate(StudentCreate):
    pass

class StudentOut(StudentCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)
