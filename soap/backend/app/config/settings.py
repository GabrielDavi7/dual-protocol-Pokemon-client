from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT = Path(__file__).resolve().parents[3]

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ROOT / '.env', extra='ignore')
    soap_wsdl: str = 'https://footballpool.dataflex.dev/info.wso?WSDL'
    soap_timeout: float = 20
    cache_seconds: int = 300
    cors_origins: str = 'http://localhost:5173,http://127.0.0.1:5173'

settings = Settings()
