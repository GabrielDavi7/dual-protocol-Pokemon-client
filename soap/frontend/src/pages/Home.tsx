import { Link } from 'react-router-dom';
import { ArrowUpRight, Trophy, CodeXml } from 'lucide-react';
import { useState } from 'react';
import {
  DataGuard,
  SectionTitle,
  StatisticsCard,
  MatchCard,
  Flag,
  TeamCard,
} from '../components/ui';
import { GoalsChart } from '../components/Charts';
import type { Dataset } from '../types';
export function GroupTable({ data }: { data: Dataset }) {
  const available = data.groups.filter((g) => g.level === 1);
  const [code, setCode] = useState(available[0]?.code || '');
  const names = new Set(
    data.matches.filter((m) => m.group === code).flatMap((m) => [m.home, m.away]),
  );
  const rows = data.teams
    .filter((t) => names.has(t.name))
    .map((t) => {
      const ms = data.matches.filter(
        (m) => m.group === code && m.finished && (m.home === t.name || m.away === t.name),
      );
      let points = 0,
        gf = 0,
        ga = 0;
      ms.forEach((m) => {
        const a = m.home === t.name ? m.home_score : m.away_score,
          b = m.home === t.name ? m.away_score : m.home_score;
        gf += a;
        ga += b;
        points += a > b ? 3 : a === b ? 1 : 0;
      });
      return { ...t, points, gf, ga, games: ms.length };
    })
    .sort((a, b) => b.points - a.points || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf);
  return (
    <section className="panel">
      <div className="section-title">
        <h2>Grupos</h2>
        <select aria-label="Grupo" value={code} onChange={(e) => setCode(e.target.value)}>
          {available.map((g) => (
            <option key={g.code} value={g.code}>
              Grupo {g.code}
            </option>
          ))}
        </select>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Seleção</th>
              <th>J</th>
              <th>SG</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => (
              <tr key={t.name}>
                <td>
                  <Link to={`/selecoes/${encodeURIComponent(t.name)}`}>
                    <span className="rank">{i + 1}</span>
                    <Flag name={t.name} url={t.flag} />
                    {t.name}
                  </Link>
                </td>
                <td>{t.games}</td>
                <td>{t.gf - t.ga}</td>
                <td>
                  <b>{t.points}</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="footnote">
        Calculado por pontos, saldo e gols. Não aplica todos os critérios oficiais de desempate.
      </p>
    </section>
  );
}
function Content({ data }: { data: Dataset }) {
  const [filter, setFilter] = useState('all');
  const matches = data.matches
    .filter((m) => filter === 'all' || (filter === 'finished' ? m.finished : !m.finished))
    .slice(0, 6);
  const scorers = [...data.players]
    .filter((p) => p.goals !== null)
    .sort((a, b) => (b.goals || 0) - (a.goals || 0))
    .slice(0, 5);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="gold-dot" /> FUTEBOL DE SELEÇÕES · {data.meta.years.join(' / ')}
          </span>
          <h1>
            Cada jogo tem
            <br />
            uma história.
          </h1>
          <p>
            Explore a Copa do Mundo 2026: seleções,<br className="desktop-break" />
            partidas, artilheiros e estatísticas em um só lugar.
          </p>
          <Link className="button button-gold" to="/partidas">
            Explorar partidas <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="pitch">
            <div className="pitch-circle" />
            <div className="pitch-box" />
          </div>
          <span className="hero-number">21</span>
          <span className="hero-art-label">
            PAIXÃO PELO JOGO.
            <br />
            CURIOSIDADE PELOS DADOS.
          </span>
        </div>
        <div className="hero-bottom">
          <Trophy size={15} />
          <span>{data.meta.label}</span>
          <span>Acervo do provedor</span>
        </div>
      </section>
      <div className="stats-grid">
        <StatisticsCard label="Seleções" value={data.summary.teams} />
        <StatisticsCard
          label="Partidas"
          value={data.summary.matches}
          detail={`${data.summary.finished} concluídas`}
        />
        <StatisticsCard
          label="Gols registrados"
          value={data.summary.goals}
          detail="em partidas concluídas"
        />
        <StatisticsCard label="Estádios" value={data.summary.stadiums} />
      </div>
      <div className="content-columns">
        <div>
          <section>
            <SectionTitle title="Dentro de campo" to="/partidas" label="Todas as partidas" />
            <div className="tabs" aria-label="Filtrar partidas">
              {[
                ['all', 'Todas'],
                ['finished', 'Encerradas'],
                ['pending', 'Não concluídas'],
              ].map(([v, l]) => (
                <button
                  key={v}
                  className={filter === v ? 'active' : ''}
                  onClick={() => setFilter(v)}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="matches-grid">
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} teams={data.teams} />
              ))}
            </div>
            {!matches.length && <p className="empty">Nenhuma partida neste filtro.</p>}
          </section>
          <section className="panel goals-panel">
            <SectionTitle title="Quantidade de gols por dia" />
            <GoalsChart matches={data.matches} />
          </section>
          <section>
            <SectionTitle title="Seleções em campo" to="/selecoes" />
            <div className="teams-home">
              {[...data.teams]
                .sort((a, b) => b.goals_for - a.goals_for)
                .slice(0, 3)
                .map((t) => (
                  <TeamCard key={t.name} team={t} />
                ))}
            </div>
          </section>
        </div>
        <aside className="right-rail">
          <section className="panel">
            <SectionTitle title="Artilheiros" to="/jogadores" label="Ranking" />
            <p className="rail-label">QUEM MAIS BALANÇOU A REDE</p>
            {scorers.map((p, i) => (
              <Link className="scorer" to={`/jogadores/${p.id}`} key={p.id}>
                <span className={`scorer-rank ${i === 0 ? 'first' : ''}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <strong>{p.name}</strong>
                  <small>
                    <Flag name={p.team} url={p.flag} />
                    {p.team}
                  </small>
                </div>
                <b>
                  {p.goals}
                  <small>gols</small>
                </b>
              </Link>
            ))}
            <p className="footnote">Ranking informado pelo Football Pool.</p>
          </section>
          <GroupTable data={data} />
        
        </aside>
      </div>
    </>
  );
}
export default function Home() {
  return <DataGuard>{(data) => <Content data={data} />}</DataGuard>;
}
