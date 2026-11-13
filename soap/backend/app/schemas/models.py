from typing import Any, Literal
from pydantic import BaseModel, Field, ConfigDict

class SoapRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')
    operation: str = Field(min_length=1, max_length=64)
    params: dict[str, Any] = Field(default_factory=dict, max_length=4)

class SoapExecution(BaseModel):
    operation: str
    ok: bool
    request_xml: str = ''
    response_xml: str = ''
    data: Any = None
    duration_ms: float
    error: str | None = None
    error_kind: str | None = None

Source = Literal['live', 'snapshot']
