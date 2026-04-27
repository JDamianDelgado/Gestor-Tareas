import os
from typing import Optional

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv(override=True)


def get_supabase_client() -> Optional[Client]:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")

    if not url or not key:
        return None

    try:
        return create_client(url, key)
    except Exception:
        return None


supabase = get_supabase_client()
