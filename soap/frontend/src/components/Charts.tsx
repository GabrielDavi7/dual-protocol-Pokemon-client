import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { Match, Team } from '../types';
export function GoalsChart({ matches }: { matches: Match[] }) {
  const daily = new Map<string, number>();
  matches
    .filter((m) => m.finished)
    .forEach((m) => {
      const date = m.date.slice(5, 10);
      daily.set(date, (daily.get(date) || 0) + m.home_score + m.away_score);
    });
  const data = [...daily]
    .sort()
    .map(([date, goals]) => ({ date: date.slice(3) + '/' + date.slice(0, 2), goals }));
  return (
    <div
      className="chart"
      role="img"
      aria-label="Gols por data, somados a partir de partidas concluídas"
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} stroke="var(--line)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--muted)' }}
            interval={5}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            width={25}
            tick={{ fontSize: 10, fill: 'var(--muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--card)',
              borderColor: 'var(--line)',
              color: 'var(--text)',
            }}
          />
          <Bar dataKey="goals" name="Gols" fill="#8E1B2F" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export function ComparisonChart({ teams }: { teams: Team[] }) {
  const metrics = [
    ['played', 'Jogos'],
    ['wins', 'Vitórias'],
    ['draws', 'Empates'],
    ['losses', 'Derrotas'],
    ['goals_for', 'Gols pró'],
    ['goals_against', 'Gols contra'],
  ] as const;
  const data = metrics.map(([key, label]) => ({ label, a: teams[0][key], b: teams[1][key] }));
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} stroke="var(--line)" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--muted)' }} />
          <YAxis tick={{ fill: 'var(--muted)' }} />
          <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--line)' }} />
          <Legend />
          <Bar dataKey="a" name={teams[0].name} fill="#8E1B2F" radius={[4, 4, 0, 0]} />
          <Bar dataKey="b" name={teams[1].name} fill="#F5B335" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
