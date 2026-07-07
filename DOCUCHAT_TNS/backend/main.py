import os
import tempfile
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, Form

from services.cloudinary_service import upload_pdf
from Rag.rag_service import Rag_core



class ResponseRequest(BaseModel):
    query: str
    status:str
    session_id: str
    topic_name: str

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
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
async def process_pdf(
    topic: str,
    pdf: UploadFile = File(...),
    session_id: str = Form(...)
):
    pdf_path = None

    try:
        # global PDF_PATH_FOR_RAG

        # Read uploaded PDF
        contents = await pdf.read()

        cloudinary_result = upload_pdf(
            file_bytes=contents,
            filename=pdf.filename,
            topic=topic
        )

        print(cloudinary_result)

        # Create temporary PDF file
        temp_pdf = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        )

        temp_pdf.write(contents)
        temp_pdf.close()

        pdf_path = temp_pdf.name
        # PDF_PATH_FOR_RAG = pdf_path

        print(topic)
        print(session_id)
        print(f"📄 Processing PDF: {pdf_path}")

        query_data = {
            "session_id": session_id,
            "query": "Greetings to you!",
            "status": True,
            "pdf_path": pdf_path,
            "cloudinary_url": cloudinary_result["secure_url"],
            "topic_name": topic,
        }
        
        print(f"Temporary PDF Path: {pdf_path}")
        print(f"Temp File Exists: {os.path.isfile(pdf_path)}")

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

        return {
            "error": str(e),
            "response_msg": f"Error processing PDF: {str(e)}",
            "sender": "error"
        }, 500

    finally:
        if pdf_path and os.path.exists(pdf_path):
            try:
                os.remove(pdf_path)
                print(f"🗑️ Temporary PDF deleted: {pdf_path}")
            except Exception as e:
                print(f"Error deleting temp PDF: {e}")
 
  
@app.post("/response")  
def query_response(data: ResponseRequest):
    try:
        query_data ={
        "query": data.query,
        "status": data.status,
        "session_id": data.session_id,
        "topic_name": data.topic_name
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
        return {
            "error": str(e),
            "response_msg": f"Error processing query: {str(e)}",
            "sender": "error"
        }, 500
        
    
    

