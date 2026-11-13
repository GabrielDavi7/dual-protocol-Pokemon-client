export type Source = 'live' | 'snapshot';
export interface Meta {
  source: Source;
  fetched_at: string;
  start: string | null;
  end: string | null;
  years: string[];
  label: string;
  notice: string;
}
export interface Match {
  id: number;
  home: string;
  away: string;
  home_score: number;
  away_score: number;
  date: string;
  utc_date: string;
  finished: boolean;
  group: string;
  phase: string;
  city: string | null;
  yellow_cards: number;
  red_cards: number;
  home_penalties: number;
  away_penalties: number;
}
export interface Team {
  name: string;
  flag: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  performance: number;
}
export interface Player {
  id: number;
  name: string;
  team: string;
  flag: string | null;
  goals: number | null;
}
export interface Stadium {
  name: string;
  city: string;
  capacity: number;
  maps_url: string;
  wiki_url: string;
}
export interface Group {
  id: number;
  code: string;
  name: string;
  level: number;
}
export interface Card {
  dDate: string;
  iMinute: number;
  sTeam1Name: string;
  sTeam2Name: string;
  sPlayerName: string;
  iYellow: number;
  iRed: number;
}
export interface Dataset {
  meta: Meta;
  matches: Match[];
  teams: Team[];
  players: Player[];
  stadiums: Stadium[];
  groups: Group[];
  cards: Card[];
  summary: {
    teams: number;
    matches: number;
    finished: number;
    goals: number;
    players: number;
    stadiums: number;
  };
}
export interface Operation {
  name: string;
  description: string;
  params: { name: string; type: string }[];
  input: string;
  output: string;
}
export interface Execution {
  operation: string;
  ok: boolean;
  request_xml: string;
  response_xml: string;
  data: unknown;
  duration_ms: number;
  error: string | null;
  error_kind: string | null;
}
