import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, ExternalLink } from 'lucide-react';
import {
  DataGuard,
  PageTitle,
  SearchBar,
  FilterBar,
  MatchCard,
  TeamCard,
  PlayerCard,
  StadiumCard,
  EmptyState,
  StatisticsCard,
  Flag,
  SectionTitle,
} from '../components/ui';
import type { Dataset, Match } from '../types';

function MatchList({ data }: { data: Dataset }) {
  const [query, setQuery] = useState(''),
    [group, setGroup] = useState(''),
    [date, setDate] = useState(''),
    [status, setStatus] = useState('');
  const filtered = data.matches.filter(
    (m) =>
      (m.home + ' ' + m.away).toLowerCase().includes(query.toLowerCase()) &&
      (!group || m.group === group) &&
      (!date || m.date.startsWith(date)) &&
      (!status || m.finished === (status === 'finished')),
  );
  return (
    <>
      <PageTitle
        title="Partidas"
        description="Cada placar, um capítulo. Explore o conjunto retornado pelo Football Pool."
      />
      <FilterBar>
        <SearchBar value={query} onChange={setQuery} placeholder="Buscar seleção na partida" />
        <select aria-label="Fase ou grupo" value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="">Todas as fases</option>
          {data.groups.map((g) => (
            <option key={g.id} value={g.code}>
              {g.name}
            </option>
          ))}
        </select>
        <input
          aria-label="Data da partida"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select aria-label="Situação" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todas as situações</option>
          <option value="finished">Encerradas</option>
          <option value="pending">Não concluídas</option>
        </select>
        <button
          className="text-button"
          onClick={() => {
            setQuery('');
            setGroup('');
            setDate('');
            setStatus('');
          }}
        >
          Limpar
        </button>
      </FilterBar>
      <p className="result-count">{filtered.length} partidas · horários locais do evento</p>
      <div className="matches-grid large">
        {filtered.map((m) => (
          <MatchCard key={m.id} match={m} teams={data.teams} />
        ))}
      </div>
      {!filtered.length && <EmptyState />}
    </>
  );
}
export function Matches() {
  return <DataGuard>{(data) => <MatchList data={data} />}</DataGuard>;
}
function Detail({ data, id }: { data: Dataset; id: string }) {
  const [tab, setTab] = useState('Resumo');
  const m = data.matches.find((m) => String(m.id) === id);
  if (!m) return <EmptyState message="Partida não encontrada." />;
  const cards = data.cards.filter(
    (c) => c.dDate === m.date.slice(0, 10) && c.sTeam1Name === m.home && c.sTeam2Name === m.away,
  );
  return (
    <>
      <Link className="back-link" to="/partidas">
        <ArrowLeft size={16} /> Todas as partidas
      </Link>
      <PageTitle title={m.phase} description={`${data.meta.label} · Partida ${m.id}`} />
      <div className="match-detail panel">
        <div className="match-detail-meta">
          {m.date.slice(0, 10)} · {m.date.slice(11, 16)} local ·{' '}
          {m.finished ? 'Encerrada' : 'Não concluída'}
        </div>
        <div className="score-row">
          {[m.home, 'score', m.away].map((name) =>
            name === 'score' ? (
              <div key={name} className="score">
                <strong>{m.finished ? `${m.home_score} : ${m.away_score}` : '— : —'}</strong>
                {!!(m.home_penalties || m.away_penalties) && (
                  <small>
                    Pênaltis: {m.home_penalties} : {m.away_penalties}
                  </small>
                )}
              </div>
            ) : (
              <Link className="match-team" key={name} to={`/selecoes/${encodeURIComponent(name)}`}>
                <Flag name={name} url={data.teams.find((t) => t.name === name)?.flag} />
                <h2>{name}</h2>
              </Link>
            ),
          )}
        </div>
        <p className="muted">
          <MapPin size={16} />
          {m.city || 'Cidade não informada'} · Estádio não vinculado pelo serviço
        </p>
      </div>
      <div className="tabs" role="tablist" aria-label="Detalhes da partida">
        {['Resumo', 'Estatísticas', 'Informações'].map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? 'active' : ''}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="panel detail-panel" role="tabpanel">
        {tab === 'Resumo' ? (
          <>
            <h2>Registro da partida</h2>
            <p>
              Placar conforme o provedor. Eventos de gols e escalações desta partida não são
              fornecidos pelas operações utilizadas.
            </p>
            <h3>Cartões registrados</h3>
            {cards.length ? (
              <div className="events">
                {cards.map((c, i) => (
                  <div key={i}>
                    <b>{c.iMinute}′</b>
                    <span className={c.iRed ? 'card-red' : 'card-yellow'} />
                    <span>{c.sPlayerName}</span>
                    <small>
                      {c.iYellow} amarelo(s) · {c.iRed} vermelho(s)
                    </small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">Nenhum evento de cartão retornado para esta partida.</p>
            )}
            <p className="footnote">
              Eventos relacionados por data local e nomes das duas seleções; a resposta de cartões
              não contém ID da partida.
            </p>
          </>
        ) : tab === 'Estatísticas' ? (
          <>
            <h2>Números disponíveis</h2>
            <div className="stats-grid">
              <StatisticsCard
                label="Gols totais"
                value={m.finished ? m.home_score + m.away_score : '—'}
              />
              <StatisticsCard label="Cartões amarelos" value={m.yellow_cards} />
              <StatisticsCard label="Cartões vermelhos" value={m.red_cards} />
            </div>
            <p className="muted">Posse de bola, finalizações e passes não disponíveis.</p>
          </>
        ) : (
          <>
            <h2>Informações</h2>
            <dl>
              <dt>Fonte</dt>
              <dd>ResultsAllGames · Football Pool</dd>
              <dt>Data UTC</dt>
              <dd>{m.utc_date}</dd>
              <dt>Fase / grupo</dt>
              <dd>
                {m.phase} / {m.group}
              </dd>
              <dt>Cidade</dt>
              <dd>{m.city || 'Não informada'}</dd>
            </dl>
            <h3>Seleções relacionadas</h3>
            <p>
              Consulte os cadastros de jogadores nas páginas das seleções. O cadastro não confirma
              participação nesta partida.
            </p>
            <div className="inline-links">
              {[m.home, m.away].map((name) => (
                <Link key={name} to={`/selecoes/${encodeURIComponent(name)}`}>
                  {name}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
export function MatchDetail() {
  const { id = '' } = useParams();
  return <DataGuard>{(data) => <Detail data={data} id={id} />}</DataGuard>;
}
export function Teams() {
  const [query, setQuery] = useState('');
  return (
    <DataGuard>
      {(data) => {
        const rows = data.teams.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
        return (
          <>
            <PageTitle
              title="Seleções"
              description="Cores, camisas e números. Conheça as equipes do conjunto atual."
            />
            <FilterBar>
              <SearchBar value={query} onChange={setQuery} placeholder="Buscar seleção" />
            </FilterBar>
            <p className="result-count">{rows.length} seleções</p>
            <div className="entity-grid">
              {rows.map((t) => (
                <TeamCard key={t.name} team={t} />
              ))}
            </div>
            {!rows.length && <EmptyState />}
          </>
        );
      }}
    </DataGuard>
  );
}
export function TeamDetail() {
  const { name } = useParams();
  return (
    <DataGuard>
      {(data) => {
        const t = data.teams.find((t) => t.name === name);
        if (!t) return <EmptyState message="Seleção não encontrada." />;
        return (
          <>
            <Link className="back-link" to="/selecoes">
              <ArrowLeft size={16} /> Seleções
            </Link>
            <div className="entity-heading">
              <Flag name={t.name} url={t.flag} />
              <PageTitle
                title={t.name}
                description="Estatísticas restritas ao conjunto disponível; empate inclui decisão posterior por pênaltis."
              />
            </div>
            <div className="stats-grid">
              <StatisticsCard label="Jogos" value={t.played} />
              <StatisticsCard label="Vitórias" value={t.wins} />
              <StatisticsCard label="Empates" value={t.draws} />
              <StatisticsCard label="Derrotas" value={t.losses} />
              <StatisticsCard label="Gols marcados" value={t.goals_for} />
              <StatisticsCard label="Gols sofridos" value={t.goals_against} />
              <StatisticsCard label="Saldo de gols" value={t.goal_difference} />
              <StatisticsCard label="Aproveitamento" value={`${t.performance}%`} />
            </div>
            <SectionTitle title="Partidas da seleção" />
            <div className="matches-grid large">
              {data.matches
                .filter((m) => m.home === name || m.away === name)
                .map((m) => (
                  <MatchCard key={m.id} match={m} teams={data.teams} />
                ))}
            </div>
            <SectionTitle
              title="Jogadores cadastrados"
              to={`/jogadores?team=${encodeURIComponent(t.name)}`}
              label="Ver jogadores"
            />
            <p className="muted">Cadastro do provedor; não representa escalação de uma partida.</p>
          </>
        );
      }}
    </DataGuard>
  );
}
export function Players() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(''),
    [team, setTeam] = useState(params.get('team') || ''),
    [ranking, setRanking] = useState(false),
    [limit, setLimit] = useState(60);
  return (
    <DataGuard>
      {(data) => {
        const rows = data.players
          .filter(
            (p) =>
              p.name.toLowerCase().includes(query.toLowerCase()) &&
              (!team || p.team === team) &&
              (!ranking || p.goals !== null),
          )
          .sort((a, b) =>
            ranking ? (b.goals || 0) - (a.goals || 0) : a.name.localeCompare(b.name),
          );
        return (
          <>
            <PageTitle
              title="Jogadores"
              description="Os nomes por trás do jogo. Explore o cadastro e o ranking de gols."
            />
            <FilterBar>
              <SearchBar
                value={query}
                onChange={(v) => {
                  setQuery(v);
                  setLimit(60);
                }}
                placeholder="Buscar jogador"
              />
              <select
                aria-label="Seleção dos jogadores"
                value={team}
                onChange={(e) => {
                  setTeam(e.target.value);
                  setLimit(60);
                }}
              >
                <option value="">Todas as seleções</option>
                {data.teams.map((t) => (
                  <option key={t.name}>{t.name}</option>
                ))}
              </select>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={ranking}
                  onChange={(e) => {
                    setRanking(e.target.checked);
                    setLimit(60);
                  }}
                />{' '}
                Somente artilheiros
              </label>
            </FilterBar>
            <p className="result-count">
              {rows.length} jogadores · * “—” significa ausência no ranking, não zero gols.
            </p>
            <div className="players-grid">
              {rows.slice(0, limit).map((p) => (
                <PlayerCard key={p.id} player={p} />
              ))}
            </div>
            {!rows.length && <EmptyState />}
            {rows.length > limit && (
              <button className="button load-more" onClick={() => setLimit(limit + 60)}>
                Mostrar mais 60 jogadores
              </button>
            )}
          </>
        );
      }}
    </DataGuard>
  );
}
export function PlayerDetail() {
  const { id } = useParams();
  return (
    <DataGuard>
      {(data) => {
        const p = data.players.find((p) => String(p.id) === id);
        if (!p) return <EmptyState message="Jogador não encontrado." />;
        return (
          <>
            <Link className="back-link" to="/jogadores">
              <ArrowLeft size={16} /> Jogadores
            </Link>
            <PageTitle title={p.name} description="Cadastro do Football Pool" />
            <div className="panel detail-panel">
              <Flag name={p.team} url={p.flag} />
              <h2>{p.team}</h2>
              <StatisticsCard
                label="Gols no ranking do provedor"
                value={p.goals ?? 'Não informado'}
              />
              <p>
                Idade, clube, posição e participações individuais nas partidas não são fornecidos
                pelas operações utilizadas.
              </p>
              <Link className="button" to={`/selecoes/${encodeURIComponent(p.team)}`}>
                Explorar seleção
              </Link>
            </div>
          </>
        );
      }}
    </DataGuard>
  );
}
export function Stadiums() {
  const [query, setQuery] = useState('');
  return (
    <DataGuard>
      {(data) => {
        const rows = data.stadiums.filter((s) =>
          (s.name + ' ' + s.city).toLowerCase().includes(query.toLowerCase()),
        );
        return (
          <>
            <PageTitle
              title="Estádios"
              description="Os palcos do futebol. Explore cidades, capacidades e informações."
            />
            <FilterBar>
              <SearchBar value={query} onChange={setQuery} placeholder="Buscar estádio ou cidade" />
            </FilterBar>
            <p className="result-count">{rows.length} estádios</p>
            <div className="entity-grid">
              {rows.map((s) => (
                <StadiumCard key={s.name} stadium={s} />
              ))}
            </div>
            {!rows.length && <EmptyState />}
          </>
        );
      }}
    </DataGuard>
  );
}
function safeUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : undefined;
}
export function StadiumDetail() {
  const { name } = useParams();
  return (
    <DataGuard>
      {(data) => {
        const s = data.stadiums.find((s) => s.name === name);
        if (!s) return <EmptyState message="Estádio não encontrado." />;
        const matches = data.matches.filter((m) => m.city === s.city);
        return (
          <>
            <Link className="back-link" to="/estadios">
              <ArrowLeft size={16} /> Estádios
            </Link>
            <PageTitle title={s.name} description={s.city} />
            <div className="panel detail-panel">
              <StatisticsCard label="Capacidade informada" value={s.capacity || 'Não informada'} />
              <div className="inline-links">
                {safeUrl(s.maps_url) && (
                  <a href={s.maps_url} target="_blank" rel="noreferrer">
                    Ver no mapa <ExternalLink size={16} />
                  </a>
                )}
                {safeUrl(s.wiki_url) && (
                  <a href={s.wiki_url} target="_blank" rel="noreferrer">
                    Wikipedia <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
            <SectionTitle title={`Partidas na cidade de ${s.city}`} />
            <p className="muted">
              Associação por cidade fornecida pelo serviço. O estádio exato de cada partida não é
              confirmado.
            </p>
            <div className="matches-grid large">
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} teams={data.teams} />
              ))}
            </div>
            {!matches.length && <EmptyState message="Nenhuma partida associada à cidade." />}
          </>
        );
      }}
    </DataGuard>
  );
}
export function SearchResults() {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim().toLowerCase();
  return (
    <DataGuard>
      {(data) => {
        const teams = data.teams.filter((t) => q && t.name.toLowerCase().includes(q)),
          players = data.players.filter((p) => q && p.name.toLowerCase().includes(q)),
          stadiums = data.stadiums.filter(
            (s) => q && (s.name + ' ' + s.city).toLowerCase().includes(q),
          );
        const matches: Match[] = data.matches.filter(
          (m) => q && (m.home + ' ' + m.away).toLowerCase().includes(q),
        );
        return (
          <>
            <PageTitle
              title={`Busca: ${params.get('q') || 'sem termo'}`}
              description="Seleções, jogadores, partidas e estádios do acervo."
            />
            {!!teams.length && (
              <>
                <SectionTitle title="Seleções" />
                <div className="entity-grid">
                  {teams.map((t) => (
                    <TeamCard key={t.name} team={t} />
                  ))}
                </div>
              </>
            )}
            {!!matches.length && (
              <>
                <SectionTitle title="Partidas" />
                <div className="matches-grid">
                  {matches.slice(0, 12).map((m) => (
                    <MatchCard key={m.id} match={m} teams={data.teams} />
                  ))}
                </div>
              </>
            )}
            {!!players.length && (
              <>
                <SectionTitle title={`Jogadores (${players.length})`} />
                <div className="players-grid">
                  {players.slice(0, 30).map((p) => (
                    <PlayerCard key={p.id} player={p} />
                  ))}
                </div>
                <p className="footnote">Até 30 jogadores. Use a página Jogadores para refinar.</p>
              </>
            )}
            {!!stadiums.length && (
              <>
                <SectionTitle title="Estádios" />
                <div className="entity-grid">
                  {stadiums.map((s) => (
                    <StadiumCard key={s.name} stadium={s} />
                  ))}
                </div>
              </>
            )}
            {!teams.length && !matches.length && !players.length && !stadiums.length && (
              <EmptyState />
            )}
          </>
        );
      }}
    </DataGuard>
  );
}
