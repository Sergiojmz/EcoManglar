from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, create_engine, Session, select
from typing import Optional, List
import os

DATABASE_URL = "sqlite:///./backend.db"
engine = create_engine(DATABASE_URL, echo=False)

class Donation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    referencia: str
    monto: float
    fecha: str
    metodo: Optional[str] = None
    tipo: Optional[str] = "donacion"
    visible: Optional[bool] = True

class Volunteer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    correo: str
    habilidad: Optional[str] = None
    fecha: Optional[str] = None

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    location: Optional[str] = None
    progress: Optional[int] = 0

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        count = session.exec(select(Project)).first()
        if not count:
            projects = [
                Project(id=1, title='Reforestación Bahía Verde', location='Bahía Verde, Magdalena', progress=62),
                Project(id=2, title='Protección de crías de sábalo', location='Estuario Ciénaga', progress=40),
                Project(id=3, title='Senderos educativos', location='Reserva El Manglar', progress=85)
            ]
            session.add_all(projects)
            session.commit()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

def get_session():
    with Session(engine) as session:
        yield session

@app.get('/api/donations', response_model=List[Donation])
def get_donations(session: Session = Depends(get_session)):
    donations = session.exec(select(Donation).where(Donation.visible == True)).all()
    return donations

@app.post('/api/donations', response_model=Donation)
def post_donation(donation: Donation, session: Session = Depends(get_session)):
    try:
        session.add(donation)
        session.commit()
        session.refresh(donation)
        return donation
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/api/volunteers', response_model=List[Volunteer])
def get_volunteers(session: Session = Depends(get_session)):
    volunteers = session.exec(select(Volunteer)).all()
    return volunteers

@app.post('/api/volunteers', response_model=Volunteer)
def post_volunteer(volunteer: Volunteer, session: Session = Depends(get_session)):
    session.add(volunteer)
    session.commit()
    session.refresh(volunteer)
    return volunteer

@app.get('/api/projects', response_model=List[Project])
def get_projects(session: Session = Depends(get_session)):
    projects = session.exec(select(Project)).all()
    return projects

@app.get('/api/stats')
def get_stats(session: Session = Depends(get_session)):
    total_donations = session.exec(select(Donation)).all()
    total = sum([d.monto for d in total_donations]) if total_donations else 0
    total_volunteers = session.exec(select(Volunteer)).count()
    projects_count = session.exec(select(Project)).count()
    return {
        'totalDonations': total,
        'totalVolunteers': total_volunteers,
        'projectsCount': projects_count
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('backend.main:app', host='0.0.0.0', port=3000, reload=True)
