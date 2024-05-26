from fastapi import FastAPI
import uvicorn
from api.routes import router
import api.models
from database import engine
app = FastAPI()

api.models.Base.metadata.create_all(bind=engine)

app.include_router(router)

 



if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8000)