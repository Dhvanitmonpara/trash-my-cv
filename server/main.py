from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import PydanticOutputParser
from langchain_community.document_loaders import PyPDFLoader
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List, Literal
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import shutil
from uuid import uuid4
import json

load_dotenv()

app = FastAPI()

cors_origins_raw = os.environ.get("CORS_ORIGIN")
if not cors_origins_raw:
    raise RuntimeError("CORS_ORIGIN env var is missing")
origins = [origin.strip() for origin in cors_origins_raw.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

def clean_json_response(text: str) -> str:
    if text.startswith("```json"):
        text = text[len("```json"):].strip()
    if text.endswith("```"):
        text = text[:-3].strip()
    return text

class ResumeReview(BaseModel):
    pros: List[str] = Field(description="Strengths of the resume")
    cons: List[str] = Field(description="Weaknesses or areas to improve")
    score: int = Field(ge=0, le=10, description="Overall score out of 10")
    summary: str = Field(description="Brief summary of the resume")
    recommendations: List[str] = Field(description="Suggestions for improvement")
    job_fit: str = Field(description="Best fit job/industry for this resume")
    verdict: Literal["pass", "needs improvement", "strong candidate"]
    grammar_issues: int
    highlighted_projects: List[str]
    tech_stack_strengths: List[str]

resumeReviewParser = PydanticOutputParser(pydantic_object=ResumeReview)

prompt = PromptTemplate(
    template="""
You are a strict, detailed, and honest resume reviewer.

Review the following resume content and return the output as raw JSON ONLY.
Do NOT include ```json or ``` or any markdown formatting.

Resume Content:
{content}

{format_instructions}
""",
    input_variables=["content"],
    partial_variables={"format_instructions": resumeReviewParser.get_format_instructions()}
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.middleware("http")
async def log_exceptions(request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        import traceback
        print("🔥 EXCEPTION:", traceback.format_exc())
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported for now.")

    file_id = str(uuid4())
    file_ext = os.path.splitext(file.filename)[-1]
    save_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_ext}")
    print("📄 File saved to:", save_path)

    # Save file
    try:
        with open(save_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    try:
        # Load + process PDF
        loader = PyPDFLoader(save_path)
        print("📘 PDF loaded")
        docs = loader.load()
        resume_text = docs[0].page_content if docs else ""
        if not resume_text.strip():
            raise Exception("Empty PDF or unreadable content.")


        print("🚀 Upload started")
        formatted_prompt = prompt.format(content=resume_text)
        print("📢 Prompt ready")
        response = llm.invoke(formatted_prompt)
        print("🧠 LLM responded")
        cleaned = clean_json_response(response.content)

        return JSONResponse(content=json.loads(cleaned))

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze resume: {str(e)}")

    finally:
        # Clean up the file no matter what
        try:
            os.remove(save_path)
        except Exception as e:
            print(f"[WARN] Failed to delete temp file {save_path}: {e}")
