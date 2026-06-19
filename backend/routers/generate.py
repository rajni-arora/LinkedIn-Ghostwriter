from fastapi import APIRouter, HTTPException
from models.schemas import GeneratePostRequest, GeneratePostResponse
from services import openai_service

router = APIRouter()


@router.post("/post", response_model=GeneratePostResponse)
async def generate_post(request: GeneratePostRequest) -> GeneratePostResponse:
    try:
        post = await openai_service.generate_post(
            topic=request.topic,
            tone=request.tone,
            api_key=request.api_key,
        )
        return GeneratePostResponse(post=post)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")
