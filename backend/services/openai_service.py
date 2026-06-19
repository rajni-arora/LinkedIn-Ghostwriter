from openai import AsyncOpenAI, APIError

_SYSTEM_PROMPT = """You are an expert LinkedIn ghostwriter. Write a high-performing LinkedIn post.

Rules:
- Hook the reader in the first line — do NOT start the post with "I"
- Use short paragraphs (1-3 lines max)
- End with a call to action or a thought-provoking question
- Match the requested tone exactly: {tone}
- Do NOT use generic LinkedIn filler phrases such as "Excited to share", "Humbled", \
"I am thrilled", "I'm happy to announce", "Game changer", etc.
- Do NOT include hashtags in the post body
- Output only the post text, nothing else"""


async def generate_post(topic: str, tone: str, api_key: str) -> str:
    client = AsyncOpenAI(api_key=api_key)
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            temperature=0.8,
            max_tokens=600,
            messages=[
                {
                    "role": "system",
                    "content": _SYSTEM_PROMPT.format(tone=tone),
                },
                {
                    "role": "user",
                    "content": f"Write a LinkedIn post about: {topic}",
                },
            ],
        )
        return response.choices[0].message.content or ""
    except APIError as e:
        raise RuntimeError(f"OpenAI error: {e.message}") from e
