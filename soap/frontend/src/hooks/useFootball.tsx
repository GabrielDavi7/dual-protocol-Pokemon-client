import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, errorMessage } from '../services/api';
import type { Dataset, Source } from '../types';
interface Context {
  data: Dataset | null;
  error: string;
  loading: boolean;
  source: Source;
  setSource: (s: Source) => void;
  reload: () => void;
}
const FootballContext = createContext<Context | null>(null);
export function FootballProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Dataset | null>(null),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(true),
    [source, setSource] = useState<Source>('live'),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setData(null);
    api
      .get<Dataset>('/dashboard', { params: { source }, signal: controller.signal })
      .then((r) => setData(r.data))
      .catch((e) => {
        if (!controller.signal.aborted) setError(errorMessage(e));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [source, revision]);
  return (
    <FootballContext.Provider
      value={{ data, error, loading, source, setSource, reload: () => setRevision((v) => v + 1) }}
    >
      {children}
    </FootballContext.Provider>
  );
}
export function useFootball() {
  const value = useContext(FootballContext);
  if (!value) throw new Error('FootballProvider ausente');
  return value;
}
