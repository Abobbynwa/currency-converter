import os
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-project.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("EXCHANGE_API_KEY")
if not API_KEY:
    raise RuntimeError("EXCHANGE_API_KEY is not set")

API_URL = f"https://v6.exchangerate-api.com/v6/{API_KEY}/latest/"

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/rates/{base_currency}")
def get_rates(base_currency: str):
    try:
        url = f"{API_URL}{base_currency.upper()}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        data = response.json()

        if data.get("result") != "success":
            raise HTTPException(status_code=400, detail="Invalid currency or API error")

        return data

    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Exchange rate API timed out")

    except requests.exceptions.RequestException:
        raise HTTPException(status_code=500, detail="Error fetching exchange rates.")
