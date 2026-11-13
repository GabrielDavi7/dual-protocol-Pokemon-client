import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config.settings import settings
from app.routes.api import router
from app.services.football import UpstreamError

logging.basicConfig(level=logging.INFO, format='%(levelname)s %(name)s %(message)s')
app = FastAPI(title='CAMISA 21', version='1.0.0', description='HTTP/JSON interno; integração externa SOAP/XML via Zeep.')
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins.split(','), allow_methods=['GET', 'POST'], allow_headers=['Content-Type'])
app.include_router(router)

@app.exception_handler(UpstreamError)
def upstream_error(request: Request, exc: UpstreamError):
    return JSONResponse(status_code=503, content={'detail': str(exc)})
