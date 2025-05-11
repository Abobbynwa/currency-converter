from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "0884ec52ce9afe33e4253086"
API_URL = f"https://v6.exchangerate-api.com/v6/{API_KEY}/latest/"

@app.get("/rates/{base_currency}")
def get_rates(base_currency: str):
    try:
        url = f"{API_URL}{base_currency.upper()}"
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=500, detail="Error fetching exchange rates.")
