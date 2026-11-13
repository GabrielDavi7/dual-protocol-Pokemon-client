"""An isolated Zeep client and transport per invocation; only WSDL bytes are cached."""
import logging
from time import perf_counter
from typing import Any
import requests
from zeep import Client, Settings
from zeep.cache import InMemoryCache
from zeep.exceptions import Fault, Error
from zeep.helpers import serialize_object
from zeep.transports import Transport
from fastapi.encoders import jsonable_encoder
from app.config.settings import settings
from app.schemas.models import SoapExecution

log = logging.getLogger(__name__)
ALLOWED = {
    'TeamNames': {}, 'Teams': {'sTeamName': str}, 'Players': {'sName': str},
    'TeamPlayers': {'sTeamName': str, 'bSelected': bool},
    'AllPlayerNames': {'bSelected': bool}, 'PlayersWithGoalsRanked': {},
    'ResultsAllGames': {'iGroupId': int, 'iLevel': int},
    'GameScore': {'iGameNumber': int}, 'MatchDates': {}, 'GoalsScored': {},
    'TopScorersList': {}, 'GroupInfo': {}, 'GroupStandings': {'iGroupId': int},
    'StadiumInfo': {'sStadiumName': str}, 'AllStadiumInfo': {}, 'StadiumNames': {},
    'Cards': {'bYellow': bool, 'iGameNumber': int}, 'AllCardsInfo': {}, 'GameIDsGroupedByCity': {},
}
DESCRIPTIONS = {
    'TeamNames': 'Nomes de todas as seleções do conjunto atual.',
    'Teams': 'Busca seleções por nome. Texto vazio pode retornar vazio.',
    'Players': 'Busca jogadores por nome. Texto vazio pode retornar vazio.',
    'TeamPlayers': 'Jogadores de uma seleção; bSelected filtra os convocados.',
    'AllPlayerNames': 'Identificadores, nomes, países e bandeiras dos jogadores.',
    'ResultsAllGames': 'Partidas e placares; use 0 em grupo e nível para todos.',
    'GameScore': 'Placar e informações de uma partida pelo identificador.',
    'MatchDates': 'Datas do conjunto atual; não seleciona outras edições.',
    'GoalsScored': 'Total de gols informado pelo provedor.',
    'GroupInfo': 'Grupos e fases, com datas e identificadores.',
    'GroupStandings': 'Classificação informada pelo provedor para um grupo.',
    'AllStadiumInfo': 'Estádios, cidades, capacidades e links.',
    'StadiumInfo': 'Informações de um estádio pelo nome.',
    'StadiumNames': 'Nomes dos estádios.',
    'TopScorersList': 'Cinco primeiros registros do ranking do provedor.',
    'PlayersWithGoalsRanked': 'Ranking de gols com identificadores dos jogadores.',
    'AllCardsInfo': 'Eventos de cartões com data, seleções, jogador e minuto.',
    'Cards': 'Total de cartões amarelos ou vermelhos; jogo 0 consulta o total.',
    'GameIDsGroupedByCity': 'Associa partidas a cidades, não diretamente a estádios.',
}

class CaptureTransport(Transport):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.request_xml = ''
        self.response_xml = ''

    def post(self, address, message, headers):
        self.request_xml = message.decode('utf-8') if isinstance(message, bytes) else message
        response = super().post(address, message, headers)
        self.response_xml = response.content.decode('utf-8', errors='replace')
        return response

class SoapService:
    def _transport(self):
        return CaptureTransport(cache=InMemoryCache(timeout=3600), timeout=settings.soap_timeout,
                                operation_timeout=settings.soap_timeout, session=requests.Session())

    def _client(self, transport):
        return Client(settings.soap_wsdl, transport=transport,
                      settings=Settings(strict=True, forbid_dtd=True, forbid_entities=True, forbid_external=True))

    @staticmethod
    def validate(operation: str, params: dict):
        if operation not in ALLOWED:
            raise ValueError('Operação não permitida.')
        fields = ALLOWED[operation]
        if set(fields) != set(params):
            raise ValueError('Parâmetros devem corresponder exatamente ao contrato: ' + ', '.join(fields))
        for name, expected in fields.items():
            value = params[name]
            if type(value) is not expected:
                raise ValueError(f'{name}: tipo esperado {expected.__name__}.')
            if expected is str and (len(value) > 100 or not value.strip()):
                raise ValueError(f'{name}: informe entre 1 e 100 caracteres.')
            if expected is int and not 0 <= value <= 100000:
                raise ValueError(f'{name}: inteiro entre 0 e 100000.')

    def catalog(self):
        transport = self._transport()
        try:
            client = self._client(transport)
            return [{'name': name, 'description': DESCRIPTIONS[name],
                     'params': [{'name': key, 'type': typ.__name__} for key, typ in ALLOWED[name].items()],
                     'input': op.input.signature(), 'output': op.output.signature()}
                    for name, op in client.service._binding._operations.items() if name in ALLOWED]
        finally:
            transport.session.close()

    def execute(self, operation: str, params: dict[str, Any]) -> SoapExecution:
        self.validate(operation, params)
        started = perf_counter()
        transport = self._transport()
        data, error, kind = None, None, None
        try:
            client = self._client(transport)
            if operation not in client.service._binding._operations:
                raise ValueError('Operação ausente no WSDL atual.')
            data = jsonable_encoder(serialize_object(getattr(client.service, operation)(**params)))
        except Fault as exc:
            kind, error = 'soap_fault', f'SOAP Fault: {exc.message}'
        except requests.Timeout:
            kind, error = 'timeout', 'O serviço SOAP excedeu o tempo limite. Tente novamente.'
        except requests.RequestException:
            kind, error = 'connection', 'Não foi possível conectar ao serviço SOAP.'
        except (Error, ValueError, TypeError) as exc:
            kind, error = 'contract', 'Resposta incompatível com o contrato SOAP.'
            log.warning('SOAP contract error for %s: %s', operation, type(exc).__name__)
        finally:
            transport.session.close()
        elapsed = round((perf_counter() - started) * 1000, 2)
        log.info('SOAP %s ok=%s duration_ms=%s', operation, error is None, elapsed)
        return SoapExecution(operation=operation, ok=error is None, data=data, error=error, error_kind=kind,
                             request_xml=transport.request_xml, response_xml=transport.response_xml, duration_ms=elapsed)

soap = SoapService()
