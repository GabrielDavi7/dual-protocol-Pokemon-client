import requests
from fastapi import APIRouter, HTTPException, Query
from zeep.exceptions import Error
from app.schemas.models import SoapRequest, SoapExecution, Source
from app.services.soap import soap
from app.services.football import football

router = APIRouter(prefix='/api')

@router.get('/health')
def health():
    return {'status': 'ok', 'service': 'CAMISA 21', 'upstream_checked': False}

@router.get('/dashboard')
def dashboard(source: Source = 'live'):
    return football.dataset(source)

@router.get('/teams')
def teams(source: Source = 'live', q: str = Query('', max_length=100)):
    return [t for t in football.dataset(source)['teams'] if q.casefold() in t['name'].casefold()]

@router.get('/teams/{name}')
def team(name: str, source: Source = 'live'):
    data = football.dataset(source)
    item = next((t for t in data['teams'] if t['name'] == name), None)
    if item is None:
        raise HTTPException(404, 'Seleção não encontrada.')
    return {'team': item, 'matches': [m for m in data['matches'] if name in [m['home'], m['away']]],
            'players': [p for p in data['players'] if p['team'] == name], 'meta': data['meta']}

@router.get('/matches')
def matches(source: Source = 'live'):
    return football.dataset(source)['matches']

@router.get('/matches/{match_id}')
def match(match_id: int, source: Source = 'live'):
    data = football.dataset(source)
    item = next((m for m in data['matches'] if m['id'] == match_id), None)
    if item is None:
        raise HTTPException(404, 'Partida não encontrada.')
    cards = [c for c in data['cards'] if c['dDate'] == item['date'][:10] and c['sTeam1Name'] == item['home'] and c['sTeam2Name'] == item['away']]
    return {'match': item, 'cards': cards, 'meta': data['meta']}

@router.get('/players')
def players(source: Source = 'live', q: str = Query('', max_length=100), team: str = ''):
    return [p for p in football.dataset(source)['players'] if q.casefold() in p['name'].casefold() and (not team or p['team'] == team)]

@router.get('/stadiums')
def stadiums(source: Source = 'live'):
    return football.dataset(source)['stadiums']

@router.get('/comparison')
def comparison(team1: str, team2: str, source: Source = 'live'):
    if team1 == team2:
        raise HTTPException(422, 'Escolha seleções diferentes.')
    data = football.dataset(source)
    found = [next((t for t in data['teams'] if t['name'] == name), None) for name in [team1, team2]]
    if None in found:
        raise HTTPException(404, 'Seleção não encontrada.')
    return {'teams': found, 'meta': data['meta']}

@router.get('/groups/{group_id}/standings')
def standings(group_id: int):
    if group_id not in [g['id'] for g in football.dataset()['groups']]:
        raise HTTPException(404, 'Grupo não encontrado.')
    result = soap.execute('GroupStandings', {'iGroupId': group_id})
    if not result.ok:
        raise HTTPException(502, result.error)
    return result.data or []

@router.get('/soap/operations')
def operations():
    try:
        return soap.catalog()
    except (requests.RequestException, Error):
        raise HTTPException(503, 'WSDL indisponível. Tente novamente.')

@router.post('/soap/execute', response_model=SoapExecution)
def execute(body: SoapRequest):
    try:
        return soap.execute(body.operation, body.params)
    except ValueError as exc:
        raise HTTPException(422, str(exc))
