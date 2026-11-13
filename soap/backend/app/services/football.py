import json
from datetime import datetime, timezone
from threading import Lock
from time import monotonic
from concurrent.futures import ThreadPoolExecutor
from app.config.settings import ROOT, settings
from app.services.soap import soap

CALLS = {
    'TeamNames': {}, 'ResultsAllGames': {'iGroupId': 0, 'iLevel': 0},
    'AllPlayerNames': {'bSelected': False}, 'PlayersWithGoalsRanked': {},
    'AllStadiumInfo': {}, 'GroupInfo': {}, 'AllCardsInfo': {}, 'GameIDsGroupedByCity': {},
}

class UpstreamError(Exception):
    pass

def team_statistics(name, matches):
    stats = dict(played=0, wins=0, draws=0, losses=0, goals_for=0, goals_against=0)
    for match in matches:
        if not match['finished'] or name not in [match['home'], match['away']]:
            continue
        gf, ga = (match['home_score'], match['away_score']) if name == match['home'] else (match['away_score'], match['home_score'])
        stats['played'] += 1
        stats['goals_for'] += gf
        stats['goals_against'] += ga
        stats['wins' if gf > ga else 'losses' if gf < ga else 'draws'] += 1
    stats['goal_difference'] = stats['goals_for'] - stats['goals_against']
    stats['performance'] = round((stats['wins'] * 3 + stats['draws']) / (stats['played'] * 3) * 100, 1) if stats['played'] else 0
    return stats

def normalize(raw, source, fetched_at):
    groups = [{'id': g['iId'], 'code': g['sCode'], 'name': g['sDescription'], 'level': g['iLevel']} for g in raw.get('GroupInfo') or []]
    group_names = {g['code']: g['name'] for g in groups}
    cities = {i: c['sCity'] for c in raw.get('GameIDsGroupedByCity') or [] for i in (c.get('iGameIDs') or {}).get('int', [])}
    matches = [{'id': m['iGameNumber'], 'home': m['sTeamName1'], 'away': m['sTeamName2'],
                'home_score': m['iScoreTeam1'], 'away_score': m['iScoreTeam2'],
                'date': m['dtLocalPlayDateTime'], 'utc_date': m['dtUTCPlayDateTime'],
                'finished': m['bFinished'], 'group': m['sGroupCode'],
                'phase': group_names.get(m['sGroupCode'], m['sGroupCode']), 'city': cities.get(m['iGameNumber']),
                'yellow_cards': m['iYellowCards'], 'red_cards': m['iRedCards'],
                'home_penalties': m['iPenaltiesWonTeam1'], 'away_penalties': m['iPenaltiesWonTeam2']}
               for m in raw.get('ResultsAllGames') or []]
    goals = {p['iID']: p['iGoals'] for p in raw.get('PlayersWithGoalsRanked') or []}
    players = [{'id': p['iId'], 'name': p['sName'], 'team': p['sCountryName'], 'flag': p['sCountryFlag'],
                'goals': goals.get(p['iId'])} for p in raw.get('AllPlayerNames') or []]
    flags = {p['team']: p['flag'] for p in players if p['flag']}
    teams = [{'name': name, 'flag': flags.get(name), **team_statistics(name, matches)} for name in raw.get('TeamNames') or []]
    stadiums = [{'name': s['sName'], 'city': s['sCityName'], 'capacity': s['iSeatsCapacity'],
                 'maps_url': s['sGoogleMapsURL'], 'wiki_url': s['sWikipediaURL']} for s in raw.get('AllStadiumInfo') or []]
    dates = sorted(m['date'][:10] for m in matches if m['date'])
    years = sorted(set(d[:4] for d in dates))
    return {'meta': {'source': source, 'fetched_at': fetched_at, 'start': dates[0] if dates else None,
                     'end': dates[-1] if dates else None, 'years': years,
                     'label': 'Football Pool · ' + (' / '.join(years) or 'sem datas'),
                     'notice': 'Dados do Football Pool; não certificados como resultados oficiais. Apenas o conjunto atual, sem histórico completo de Copas.'},
            'matches': matches, 'teams': teams, 'players': players, 'stadiums': stadiums, 'groups': groups,
            'cards': raw.get('AllCardsInfo') or [],
            'summary': {'teams': len(teams), 'matches': len(matches), 'finished': sum(m['finished'] for m in matches),
                        'goals': sum(m['home_score'] + m['away_score'] for m in matches if m['finished']),
                        'players': len(players), 'stadiums': len(stadiums)}}

class FootballService:
    def __init__(self):
        self.lock = Lock()
        self.cached = None
        self.expires = 0

    def dataset(self, source='live'):
        if source == 'snapshot':
            evidence = json.loads((ROOT / 'docs/evidence/probe.json').read_text(encoding='utf-8'))
            raw = {name: evidence[name]['data'] for name in CALLS}
            return normalize(raw, 'snapshot', evidence['ResultsAllGames']['checked_at'])
        with self.lock:
            if self.cached is not None and monotonic() < self.expires:
                return self.cached
            def fetch(item):
                name, params = item
                result = soap.execute(name, params)
                if not result.ok:
                    raise UpstreamError(f'{name}: {result.error}')
                return name, result.data
            with ThreadPoolExecutor(max_workers=4) as pool:
                raw = dict(pool.map(fetch, CALLS.items()))
            self.cached = normalize(raw, 'live', datetime.now(timezone.utc).isoformat())
            self.expires = monotonic() + settings.cache_seconds
            return self.cached

football = FootballService()
