import os

import cloudinary
import cloudinary.uploader

from dotenv import load_dotenv

load_dotenv()


CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")


print(f"Debug: CLOUDINARY_CLOUD_NAME loaded: {'Yes' if CLOUDINARY_CLOUD_NAME else 'No'}")
print(f"Debug: CLOUDINARY_API_KEY loaded: {'Yes' if CLOUDINARY_API_KEY else 'No'}")
print(f"Debug: CLOUDINARY_API_SECRET loaded: {'Yes' if CLOUDINARY_API_SECRET else 'No'}")


cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

print("success")

MAX_CLOUDINARY_SIZE = 10 * 1024 * 1024



def upload_pdf(file_bytes, filename, topic):

    if len(file_bytes) > MAX_CLOUDINARY_SIZE:
        return {
            "uploaded": False,
            "secure_url": None
        }

    result = cloudinary.uploader.upload(
        file=file_bytes,
        resource_type="raw",
        folder=f"pdf_chatbot/{topic}",
        filename=filename
    )

    return {
        "uploaded": True,
        "secure_url": result["secure_url"]
    }