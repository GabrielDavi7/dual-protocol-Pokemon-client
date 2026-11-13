import {
  Search,
  TriangleAlert,
  ArrowUpRight,
  Trophy,
  MapPin,
  Shirt,
  Moon,
  Sun,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import type { Match, Team, Player, Stadium } from '../types';
import { useFootball } from '../hooks/useFootball';

export function Logo() {
  return (
    <Link className="logo" to="/" aria-label="CAMISA 21 — Início">
      <img
        className="logo-image"
        src="/camisa21-header.png"
        alt="CAMISA 21"
        width={2172}
        height={724}
      />
    </Link>
  );
}
export function Flag({ url, name }: { url?: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  return url && !failed ? (
    <img
      className="flag"
      src={url}
      alt={`Bandeira de ${name}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="flag flag-fallback" aria-label={name}>
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}
export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar...',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="search">
      <Search size={17} />
      <input
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="filterbar">{children}</div>;
}
export function LoadingSkeleton() {
  return (
    <div role="status" aria-label="Carregando dados">
      <p className="muted">Consultando Football Pool…</p>
      {[1, 2, 3].map((n) => (
        <div key={n} className="skeleton" />
      ))}
    </div>
  );
}
export function EmptyState({ message = 'Nenhum resultado encontrado.' }: { message?: string }) {
  return (
    <div className="empty">
      <Search />
      <h3>{message}</h3>
      <p>Experimente ajustar sua busca ou os filtros.</p>
    </div>
  );
}
export function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div className="error" role="alert">
      <TriangleAlert />
      <h3>Consulta indisponível</h3>
      <p>{message}</p>
      <button className="button" onClick={retry}>
        Tentar novamente
      </button>
      <p className="muted">
        A captura local pode ser escolhida no seletor de fonte. Nenhuma troca é automática.
      </p>
    </div>
  );
}
export function DataGuard({
  children,
}: {
  children: (data: NonNullable<ReturnType<typeof useFootball>['data']>) => ReactNode;
}) {
  const { data, error, loading, reload } = useFootball();
  return loading ? (
    <LoadingSkeleton />
  ) : error ? (
    <ErrorState message={error} retry={reload} />
  ) : data ? (
    <>{children(data)}</>
  ) : (
    <EmptyState />
  );
}
export function PageTitle({
  eyebrow = 'ACERVO FOOTBALL POOL',
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="page-title">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
export function SectionTitle({
  title,
  to,
  label = 'Ver todos',
}: {
  title: string;
  to?: string;
  label?: string;
}) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {to && (
        <Link to={to}>
          {label}
          <ArrowUpRight size={15} />
        </Link>
      )}
    </div>
  );
}
export function StatisticsCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number | string;
  detail?: string;
}) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{typeof value === 'number' ? value.toLocaleString('pt-BR') : value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}
export function MatchCard({ match: m, teams = [] }: { match: Match; teams?: Team[] }) {
  const flag = (name: string) => teams.find((t) => t.name === name)?.flag;
  return (
    <Link to={`/partidas/${m.id}`} className="match-card">
      <div className="match-meta">
        <span>{m.phase}</span>
        <span>
          {m.date.slice(8, 10)}/{m.date.slice(5, 7)} · {m.date.slice(11, 16)} local
        </span>
      </div>
      <div className="score-row">
        <div className="match-team">
          <Flag name={m.home} url={flag(m.home)} />
          <strong>{m.home}</strong>
        </div>
        <div className="score">
          <strong>{m.finished ? `${m.home_score} : ${m.away_score}` : '— : —'}</strong>
          <small>{m.finished ? 'ENCERRADA' : 'NÃO CONCLUÍDA'}</small>
        </div>
        <div className="match-team">
          <Flag name={m.away} url={flag(m.away)} />
          <strong>{m.away}</strong>
        </div>
      </div>
      <div className="match-footer">
        <span>{m.city || 'Cidade não informada'}</span>
        <span>
          Detalhes <ArrowUpRight size={13} />
        </span>
      </div>
    </Link>
  );
}
export function TeamCard({ team: t }: { team: Team }) {
  return (
    <Link className="entity-card team-card" to={`/selecoes/${encodeURIComponent(t.name)}`}>
      <Flag name={t.name} url={t.flag} />
      <h3>{t.name}</h3>
      <p>{t.played} jogos concluídos</p>
      <div className="team-numbers">
        <span>
          <b>{t.wins}</b> vitórias
        </span>
        <span>
          <b>{t.goals_for}</b> gols
        </span>
        <ArrowUpRight size={18} />
      </div>
    </Link>
  );
}
export function PlayerCard({ player: p }: { player: Player }) {
  return (
    <Link className="entity-card player-card" to={`/jogadores/${p.id}`}>
      <div className="player-avatar">
        <Shirt size={25} />
      </div>
      <div>
        <h3>{p.name}</h3>
        <p>
          <Flag name={p.team} url={p.flag} />
          {p.team}
        </p>
      </div>
      <strong>
        {p.goals ?? '—'}
        <small>gols*</small>
      </strong>
    </Link>
  );
}
export function StadiumCard({ stadium: s }: { stadium: Stadium }) {
  return (
    <Link className="entity-card stadium-card" to={`/estadios/${encodeURIComponent(s.name)}`}>
      <div className="stadium-art" aria-hidden="true">
        <div />
        <MapPin size={22} />
      </div>
      <div className="stadium-text">
        <span className="eyebrow">{s.city}</span>
        <h3>{s.name}</h3>
        <p>
          {s.capacity
            ? s.capacity.toLocaleString('pt-BR') + ' lugares'
            : 'Capacidade não informada'}
          <ArrowUpRight size={17} />
        </p>
      </div>
    </Link>
  );
}
export function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('camisa21-theme') === 'dark');
  function toggle() {
    const value = !dark;
    setDark(value);
    document.documentElement.dataset.theme = value ? 'dark' : 'light';
    localStorage.setItem('camisa21-theme', value ? 'dark' : 'light');
  }
  return (
    <button
      className="icon-button"
      aria-label={dark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      onClick={toggle}
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
export function ScopeNote() {
  const { data, source } = useFootball();
  return (
    <div className={`scope-note ${source === 'snapshot' ? 'snapshot' : ''}`}>
      <Trophy size={15} />
      <span>
        <b>
          {source === 'snapshot'
            ? 'Captura local real · não atualizada'
            : 'Fonte SOAP · consultas com cache de até 5 min'}
        </b>
        {data && (
          <>
            {' '}
            — {data.meta.start} a {data.meta.end}
          </>
        )}
        <small>
          Conjunto do Football Pool. Não representa toda a história das seleções nem certificação de
          resultados oficiais.
        </small>
        {data && (
          <small>
            Capturado em{' '}
            {new Date(data.meta.fetched_at).toLocaleString('pt-BR', {
              timeZone: 'America/Sao_Paulo',
            })}{' '}
            (Brasília).
          </small>
        )}
      </span>
    </div>
  );
}
