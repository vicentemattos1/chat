from groq import Groq

from chat_backend.settings import Settings


def get_groq_client() -> Groq:
    return Groq(api_key=Settings().GROQ_API_KEY)
