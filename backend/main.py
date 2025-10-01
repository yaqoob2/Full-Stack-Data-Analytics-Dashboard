import pandas as pd
from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from . import models, database, schemas
from sqlalchemy import func
from .models import Job, User
from datetime import date, datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from backend.models import User

app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (or restrict to ["http://localhost:3000", "http://localhost:3001"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create database tables (users, jobs)
models.Base.metadata.create_all(bind=database.engine)

# ✅ Dependency for database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------- HEALTH CHECK -----------
@app.get("/hello")
def read_hello():
    return {"message": "Hello, ConnectHub is now connected to a database!"}

# ----------- USERS -----------
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(name=user.name, email=user.email, password=user.password,  role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=list[schemas.User])
def read_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

# ----------- JOBS -----------
@app.post("/jobs/", response_model=schemas.JobOut)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    db_job = models.Job(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@app.get("/jobs/", response_model=list[schemas.JobOut])
def get_jobs(db: Session = Depends(get_db)):
    return db.query(models.Job).all()

# ----------- ANALYTICS -----------

# Jobs per category
@app.get("/analytics/jobs-per-category")
def jobs_per_category(db: Session = Depends(get_db)):
    jobs = db.query(models.Job).all()
    if not jobs:
        return {"message": "No jobs found"}
    df = pd.DataFrame([{"category": job.category} for job in jobs])
    result = df["category"].value_counts().to_dict()
    return {"jobs_per_category": result}

# Jobs by user
@app.get("/analytics/jobs-by-user")
def jobs_by_user(db: Session = Depends(get_db)):
    results = db.query(User.name, func.count(Job.id).label("job_count")) \
                .join(Job, isouter=True) \
                .group_by(User.name).all()
    return {"jobs_by_user": {name: count for name, count in results}}

# Jobs by day
@app.get("/analytics/jobs-by-day")
def jobs_by_day(db: Session = Depends(get_db)):
    results = db.query(func.date(models.Job.created_at), func.count(models.Job.id)) \
                .group_by(func.date(models.Job.created_at)) \
                .all()
    return {"jobs_by_day": {str(date): count for date, count in results}}

# Jobs percentage by category
@app.get("/analytics/jobs-percentage-by-category")
def jobs_percentage_by_category(db: Session = Depends(get_db)):
    total = db.query(func.count(models.Job.id)).scalar()
    results = db.query(models.Job.category, func.count(models.Job.id)) \
                .group_by(models.Job.category) \
                .all()
    percentages = {cat: round((count / total) * 100, 2) for cat, count in results if cat}
    return {"jobs_percentage_by_category": percentages}

# Jobs per day (final version, kept clean)
@app.get("/analytics/jobs-per-day")
def jobs_per_day(db: Session = Depends(get_db)):
    results = (
        db.query(func.date(models.Job.created_at), func.count(models.Job.id))
        .group_by(func.date(models.Job.created_at))
        .all()
    )
    return {"jobs_per_day": {str(date): count for date, count in results}}

# Jobs per user
@app.get("/analytics/jobs-per-user")
def jobs_per_user(db: Session = Depends(get_db)):
    results = (
        db.query(models.User.name, func.count(models.Job.id))
        .join(models.Job, models.User.id == models.Job.user_id, isouter=True)
        .group_by(models.User.id)
        .all()
    )
    return {"jobs_per_user": {name: count for name, count in results}}

# Overview analytics
@app.get("/analytics/overview")
def get_overview(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_jobs = db.query(Job).count()

    today = datetime.utcnow().date()
    jobs_today = db.query(Job).filter(Job.created_at >= today).count()

    week_start = today - timedelta(days=today.weekday())  # Monday
    jobs_this_week = db.query(Job).filter(Job.created_at >= week_start).count()

    return {
        "total_users": total_users,
        "total_jobs": total_jobs,
        "jobs_today": jobs_today,
        "jobs_this_week": jobs_this_week,
    }

# Jobs by category
@app.get("/analytics/jobs/by_category")
def jobs_by_category(db: Session = Depends(get_db)):
    results = db.query(Job.category, func.count(Job.id)).group_by(Job.category).all()
    return [{"category": r[0], "count": r[1]} for r in results]

# Jobs by employer
@app.get("/analytics/jobs/by_employer")
def jobs_by_employer(db: Session = Depends(get_db)):
    results = db.query(Job.user_id, func.count(Job.id)).group_by(Job.user_id).all()
    return [{"user_id": r[0], "count": r[1]} for r in results]

# User registrations per day
@app.get("/analytics/users/registrations")
def user_registrations(db: Session = Depends(get_db)):
    results = (
        db.query(func.date(User.created_at), func.count(User.id))
        .group_by(func.date(User.created_at))
        .all()
    )
    return [{"date": str(r[0]), "count": r[1]} for r in results]

# Jobs by date range
@app.get("/analytics/jobs/by_date")
def jobs_by_date(
    from_date: datetime = Query(...),
    to_date: datetime = Query(...),
    db: Session = Depends(get_db)
):
    results = (
        db.query(func.date(Job.created_at), func.count(Job.id))
        .filter(Job.created_at >= from_date, Job.created_at <= to_date)
        .group_by(func.date(Job.created_at))
        .all()
    )
    return [{"date": str(r[0]), "count": r[1]} for r in results]

# ----------- EXTRA FILTERS -----------

@app.get("/jobs/by-user/{user_id}")
def get_jobs_by_user(user_id: int, db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.user_id == user_id).all()
    return jobs

@app.get("/jobs/by-category/{category}")
def get_jobs_by_category(category: str, db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.category == category).all()
    return jobs

@app.get("/jobs/by-dates/")
def get_jobs_by_dates(
    from_date: date = Query(...),
    to_date: date = Query(...),
    db: Session = Depends(get_db)
):
    jobs = db.query(Job).filter(
        func.date(Job.created_at) >= from_date,
        func.date(Job.created_at) <= to_date
    ).all()
    return jobs
@app.get("/analytics/active-users")
def active_users(db: Session = Depends(get_db)):
    results = (
        db.query(User.role, func.count(User.id).label("count"))
        .group_by(User.role)
        .all()
    )
    return [{"role": r[0], "count": r[1]} for r in results]
