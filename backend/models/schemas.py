from typing import Literal
from pydantic import BaseModel


class GeneratePostRequest(BaseModel):
    topic: str
    tone: Literal["professional", "casual", "conversational", "viral-hook"]
    api_key: str


class GeneratePostResponse(BaseModel):
    post: str
