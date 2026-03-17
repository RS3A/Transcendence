from contextlib import asynccontextmanager
import os
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from db.noSQL import mongo, connect, close


class ProfileUpsertRequest(BaseModel):
    profile_id: str = Field(min_length=1)
    stacks: list[str] = Field(default_factory=list)


def normalize_stacks(stacks: list[str]) -> list[str]:
    unique: list[str] = []
    for stack in stacks:
        cleaned = stack.strip()
        if cleaned and cleaned not in unique:
            unique.append(cleaned)
    return unique

@asynccontextmanager
async def lifespan(app: FastAPI):
    await   connect()
    yield
    await   close()

app = FastAPI(
    title="Profile Service",
    description="Microserviço Python para gerenciar perfis no MongoDB",
    lifespan=lifespan
)

cors_origins = os.getenv("CORS_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins or ["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"service": "profile-api", "status": "running"}

@app.get("/profile/{profile_id}")
async def get_profile(profile_id: str):
    try:
        profile = await mongo.db.profiles.find_one(
            {"profile_id": profile_id},
            {"stacks": 1, "_id": 0})

        if not profile:
            raise HTTPException(status_code=404, detail="Perfil não encontrado")
        return profile

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar perfil: {str(e)}")


@app.post("/profile")
async def upsert_profile(payload: ProfileUpsertRequest):
    try:
        profile_doc: dict[str, Any] = {
            "profile_id": payload.profile_id,
            "stacks": normalize_stacks(payload.stacks),
        }

        await mongo.db.profiles.update_one(
            {"profile_id": payload.profile_id},
            {"$set": profile_doc},
            upsert=True,
        )

        saved_profile = await mongo.db.profiles.find_one(
            {"profile_id": payload.profile_id},
            {"_id": 0},
        )
        return {"message": "Perfil salvo com sucesso", "profile": saved_profile}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar perfil: {str(e)}")

@app.get("/health")
async def health_check():
    try:
        await mongo.db.command("ping")
        return {"status": "healthy", "mongodb": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"MongoDB indisponível: {str(e)}")
