from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.downloader import download_file_from_url
from utils.extract_pdf import extract_text_from_pdf
from utils.extract_docx import extract_text_from_docx
from parser.clean_text import clean_text
import os

app = FastAPI(title="CareerLens Resume Parser", version="1.0")


class FileURL(BaseModel):
    file_url: str


@app.get("/")
def root():
    return {"message": "Resume Parsing Service is running!"}

# Main Text Extraction Endpoint
@app.post("/extract-text")
def extract_text(payload: FileURL):
    file_url = payload.file_url
    print(f"file_url siril ${file_url}")
    try:
        local_path = download_file_from_url(file_url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to download file: {str(e)}")

    ext = os.path.splitext(local_path)[1].lower()

    try:
        if ext == ".pdf":
            raw_text, page_count = extract_text_from_pdf(local_path)
            file_type = "pdf"
        elif ext == ".docx":
            raw_text = extract_text_from_docx(local_path)
            page_count = None
            file_type = "docx"
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

    cleaned = clean_text(raw_text)

    if os.path.exists(local_path):
        os.remove(local_path)

    return {
        "success": True,
        "file_type": file_type,
        "page_count": page_count,
        "text": cleaned,
    }
