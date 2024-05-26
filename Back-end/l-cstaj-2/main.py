from fastapi import FastAPI
import uvicorn
from api.routes import router  # Assuming 'router' is your APIRouter instance
import api.models
from database import engine
from fastapi.middleware.cors import CORSMiddleware

# Define the origins that are allowed to access your API
origins = [
    ""
    "http://localhost"
    "http://localhost:3000"  # Your React frontend URL
]

app = FastAPI()

app.add_middleware(
CORSMiddleware,
allow_origins=["*"], # Allows all origins
allow_credentials=True,
allow_methods=["*"], # Allows all methods
allow_headers=["*"], # Allows all headers
)

# Create database tables if they don't exist
api.models.Base.metadata.create_all(bind=engine)

# Include your API routes
app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)