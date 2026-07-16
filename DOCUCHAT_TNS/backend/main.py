import os
import tempfile
from fastapi import FastAPI
from fastapi.responses import JSONResponse  # BUG 7 FIX: needed for proper error status codes
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, Form

from services.cloudinary_service import upload_pdf
from Rag.rag_service import Rag_core


from auth.auth_router import router as auth_router

from fastapi import Depends

from auth.dependencies import get_current_user


class ResponseRequest(BaseModel):
    query: str
    status:bool
    session_id: str
    topic_name: str

    
app = FastAPI()
app.include_router(auth_router)

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://192.168.1.5:3000",
    "http://192.168.1.5:3001",
    "https://docu-chat-tns.vercel.app",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return{
        "message": "FastAPI is working...."
    }


@app.post("/process/{topic}")
async def process_file(
    topic: str,
    file: UploadFile = File(...),
    session_id: str = Form(...),
    current_user=Depends(get_current_user)
):
    pdf_path = None
    print("Processing file")
    try:
        # global PDF_PATH_FOR_RAG

        # Read uploaded file
        contents = await file.read()

        cloudinary_result = upload_pdf(
            file_bytes=contents,
            filename=file.filename,
            topic=topic
        )

        # print(cloudinary_result) use it for cloudinary url

        # Create temporary PDF file
        temp_pdf = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        )

        temp_pdf.write(contents)
        temp_pdf.close()

        pdf_path = temp_pdf.name
        # PDF_PATH_FOR_RAG = pdf_path

        # print(topic)
        # print(session_id)
        print(f"[PDF] Processing file: {pdf_path}")

        query_data = {
            "session_id": session_id,
            "query": "Greetings to you!",
            "status": True,
            "pdf_path": pdf_path,
            "cloudinary_url": cloudinary_result["secure_url"],
            "topic_name": topic,

            "user_id": current_user["user_id"],
            "username": current_user["username"]
        }
        
        # print(f"Temporary PDF Path: {pdf_path}")
        # print(f"Temp File Exists: {os.path.isfile(pdf_path)}")

        query_response = Rag_core(query_data)

        # print(query_response)

        return {
            "response_msg": query_response,
            "sender": "bot",
            "cloudinary_uploaded": cloudinary_result["uploaded"],
            "cloudinary_url": cloudinary_result["secure_url"]
        }

    except Exception as e:
        print(f"Error in /process endpoint: {str(e)}")
        import traceback
        traceback.print_exc()

        # BUG 7 FIX: FastAPI does not support Flask-style (dict, status) tuples.
        # Use JSONResponse to properly return 500 status to the client.
        return JSONResponse(
            status_code=500,
            content={
                "error": str(e),
                "response_msg": f"Error processing PDF: {str(e)}",
                "sender": "error"
            }
        )

    finally:
        if pdf_path and os.path.exists(pdf_path):
            try:
                os.remove(pdf_path)
                print(f"[DELETED] Temporary PDF deleted: {pdf_path}")
            except Exception as e:
                print(f"Error deleting temp PDF: {e}")
 
  
@app.post("/response")  
def query_response(data: ResponseRequest, current_user=Depends(get_current_user)):
    print("Responding query")
    try:
        query_data ={
        "query": data.query,
        "status": data.status,
        "session_id": data.session_id,
        "topic_name": data.topic_name,
        "user_id": current_user["user_id"],
        "username": current_user["username"]
        }
        # print(data.session_id)
        query_response = Rag_core(query_data)
        # print(query_response)
        return {
            "response_msg": query_response,
            "sender": "bot"
        }
    except Exception as e:
        print(f"Error in /response endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        # BUG 7 FIX: Same fix — return proper 500 status via JSONResponse
        return JSONResponse(
            status_code=500,
            content={
                "error": str(e),
                "response_msg": f"Error processing query: {str(e)}",
                "sender": "error"
            }
        )
        
    
    

