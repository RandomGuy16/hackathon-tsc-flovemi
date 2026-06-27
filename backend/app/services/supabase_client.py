from supabase import create_client, Client
from app.config import settings

def get_supabase_client() -> Client:
    if not settings.supabase_url or not settings.supabase_key:
        raise ValueError("Supabase URL and Key must be configured in environment variables.")
    return create_client(settings.supabase_url, settings.supabase_key)
