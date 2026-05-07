"""Конфигурация приложения через переменные окружения."""
import os
from functools import lru_cache

try:
    from dotenv import load_dotenv

    load_dotenv()
except Exception:
    pass


class Settings:
    """Глобальные настройки приложения, читаются из ENV."""

    # База данных
    database_url: str = os.getenv(
        "DATABASE_URL",
        "sqlite+aiosqlite:///./finance.db",
    )

    # JWT
    secret_key: str = os.getenv("SECRET_KEY", "supersecretkey")
    refresh_secret_key: str = os.getenv("REFRESH_SECRET_KEY", "superrefreshsecretkey")
    algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    refresh_token_expire_days: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    # CORS
    cors_origins: list[str] = [
        o.strip() for o in os.getenv("CORS_ORIGINS", "*").split(",") if o.strip()
    ] or ["*"]

    # S3 / MinIO
    s3_endpoint_url: str = os.getenv("S3_ENDPOINT_URL", "http://localhost:9000")
    s3_public_url: str = os.getenv("S3_PUBLIC_URL", os.getenv("S3_ENDPOINT_URL", "http://localhost:9000"))
    s3_access_key: str = os.getenv("S3_ACCESS_KEY", "minioadmin")
    s3_secret_key: str = os.getenv("S3_SECRET_KEY", "minioadmin")
    s3_bucket_name: str = os.getenv("S3_BUCKET_NAME", "avatars")
    s3_region: str = os.getenv("S3_REGION", "us-east-1")

    # Стартовые данные
    default_admin_username: str = os.getenv("DEFAULT_ADMIN_USERNAME", "admin")
    default_admin_password: str = os.getenv("DEFAULT_ADMIN_PASSWORD", "admin")

    # Окружение
    environment: str = os.getenv("ENVIRONMENT", "development")

    @property
    def is_testing(self) -> bool:
        return self.environment == "test"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
