import os
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    supabase_url: str = Field("", validation_alias="NEXT_PUBLIC_SUPABASE_URL")
    supabase_key: str = Field("", validation_alias="NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
    latinfo_api_key: str = Field("", validation_alias="LATINFO_API_KEY")
    latinfo_base_url: str = Field("https://api.latinfo.dev", validation_alias="LATINFO_BASE_URL")
    cors_origins: str = Field("*", validation_alias="CORS_ORIGINS")

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
