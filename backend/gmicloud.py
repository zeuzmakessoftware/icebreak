import os
import requests
from dotenv import load_dotenv

load_dotenv("../.env.local")

API_URL = "https://api.gmi-serving.com/v1/chat/completions"
API_KEY = os.getenv("GMICLOUD_API_KEY")

def call_llm(
    system_prompt: str,
    user_message: str,
    model: str = "meta-llama/Llama-3.3-70B-Instruct",
    temperature: float = 0,
    max_tokens: int = 500
) -> dict:
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "temperature": temperature,
        "max_tokens": max_tokens
    }
    response = requests.post(API_URL, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()
