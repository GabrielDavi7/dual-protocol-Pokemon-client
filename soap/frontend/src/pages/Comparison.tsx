import { useEffect, useState } from 'react';
import {
  DataGuard,
  PageTitle,
  Flag,
  ErrorState,
  LoadingSkeleton,
  EmptyState,
} from '../components/ui';
import { ComparisonChart } from '../components/Charts';
import { useFootball } from '../hooks/useFootball';
import { api, errorMessage } from '../services/api';
import type { Dataset, Team } from '../types';
function Content({ data }: { data: Dataset }) {
  const [first, setFirst] = useState(data.teams[0]?.name || ''),
    [second, setSecond] = useState(data.teams[1]?.name || ''),
    [teams, setTeams] = useState<Team[] | null>(null),
    [error, setError] = useState(''),
    [retry, setRetry] = useState(0);
  const { source } = useFootball();
  useEffect(() => {
    const controller = new AbortController();
    setTeams(null);
    setError('');
    if (!first || !second || first === second) return;
    api
      .get('/comparison', {
        params: { team1: first, team2: second, source },
        signal: controller.signal,
      })
      .then((r) => setTeams(r.data.teams))
      .catch((e) => {
        if (!controller.signal.aborted) setError(errorMessage(e));
      });
    return () => controller.abort();
  }, [first, second, source, retry]);
  if (data.teams.length < 2) {
    return <EmptyState message="São necessárias duas seleções para comparar." />;
  }
  const metrics = [
    ['played', 'Partidas'],
    ['wins', 'Vitórias'],
    ['draws', 'Empates'],
    ['losses', 'Derrotas'],
    ['goals_for', 'Gols marcados'],
    ['goals_against', 'Gols sofridos'],
    ['goal_difference', 'Saldo de gols'],
    ['performance', 'Aproveitamento (%)'],
  ] as const;
  return (
    <>
      <PageTitle
        title="Estatísticas"
      />
      <div className="comparison-pickers">
        <label>
          Primeira seleção
          <select value={first} onChange={(e) => setFirst(e.target.value)}>
            {data.teams.map((t) => (
              <option key={t.name}>{t.name}</option>
            ))}
          </select>
        </label>
        <span>VS</span>
        <label>
          Segunda seleção
          <select value={second} onChange={(e) => setSecond(e.target.value)}>
            {data.teams.map((t) => (
              <option key={t.name}>{t.name}</option>
            ))}
          </select>
        </label>
      </div>
      {first === second ? (
        <p role="alert" className="error">
          Escolha duas seleções diferentes.
        </p>
      ) : error ? (
        <ErrorState message={error} retry={() => setRetry(retry + 1)} />
      ) : teams ? (
        <div className="panel detail-panel">
          <div className="comparison-head">
            {teams.map((t) => (
              <div key={t.name}>
                <Flag name={t.name} url={t.flag} />
                <h2>{t.name}</h2>
              </div>
            ))}
          </div>
          <ComparisonChart teams={teams} />
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>{teams[0].name}</th>
                  <th>{teams[1].name}</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map(([key, label]) => (
                  <tr key={key}>
                    <td>{label}</td>
                    <td>{teams[0][key]}</td>
                    <td>{teams[1][key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="footnote">
            Período: {data.meta.start} a {data.meta.end}. Apenas jogos concluídos retornados pelo
            serviço. Aproveitamento = (3 × vitórias + empates) / (3 × jogos). Empate no placar
            continua empate mesmo com vencedor nos pênaltis.
          </p>
        </div>
      ) : (
        <LoadingSkeleton />
      )}
    </>
  );
}
export default function Comparison() {
  return <DataGuard>{(data) => <Content key={data.meta.source} data={data} />}</DataGuard>;
}
