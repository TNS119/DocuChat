import requests
import os
from dotenv import load_dotenv

load_dotenv()

MODAL_URL = os.getenv("MODAL_URL")

print(f"Debug: MODAL_URL loaded: {'Yes' if MODAL_URL else 'No'}")


def extract_documents(pdf_bytes: bytes):

    files = {
        "pdf": ("document.pdf", pdf_bytes, "application/pdf")
    }

    response = requests.post(
        MODAL_URL,
        files=files,
        timeout=300
    )

    response.raise_for_status()

    return response.json()