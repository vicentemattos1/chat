from starlette.concurrency import run_in_threadpool

from chat_backend.ai.groq_client import get_groq_client

_DEFAULT_MODEL = 'llama-3.3-70b-versatile'


def _sync_groq_completion(message: str, model: str = _DEFAULT_MODEL) -> str:
    client = get_groq_client()
    completion = client.chat.completions.create(
        messages=[{'role': 'user', 'content': message}],
        model=model,
        stream=False,
    )
    return completion.choices[0].message.content


async def get_ai_reply(message: str, model: str = _DEFAULT_MODEL) -> str:
    return await run_in_threadpool(_sync_groq_completion, message, model)
