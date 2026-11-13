import { useEffect, useState } from 'react';
import { Play, CodeXml, Clock3 } from 'lucide-react';
import { PageTitle, ErrorState, LoadingSkeleton } from '../components/ui';
import { SoapRequestPanel, SoapResponsePanel } from '../components/SoapPanels';
import { api, errorMessage } from '../services/api';
import type { Operation, Execution } from '../types';
export const concepts = [
  ['Web Service', 'Um serviço acessível pela rede que permite a comunicação entre aplicações.'],
  ['SOAP', 'Protocolo de mensagens estruturadas. Neste projeto, usa XML transportado por HTTP.'],
  [
    'XML',
    'Formato de texto que organiza dados em elementos e atributos, com namespaces para evitar ambiguidades.',
  ],
  [
    'WSDL',
    'Contrato que descreve operações, parâmetros, tipos, bindings e endereço do serviço. O Zeep lê esse contrato para construir e interpretar mensagens.',
  ],
  ['SOAP Envelope', 'Elemento raiz que delimita a mensagem SOAP.'],
  [
    'SOAP Header',
    'Área opcional para metadados. Este serviço público não exige credenciais; cabeçalhos HTTP não são exibidos.',
  ],
  ['SOAP Body', 'Contém a operação e seus parâmetros, ou a resposta retornada.'],
  [
    'SOAP Fault',
    'Estrutura padronizada para erros do serviço. Aparece no XML recebido e no estado de erro.',
  ],
  [
    'SOAP e REST',
    'SOAP define um protocolo de mensagens e contrato. REST é um estilo arquitetural baseado em recursos. A API interna usa HTTP/JSON; o serviço externo continua SOAP/XML.',
  ],
];
export default function Laboratory() {
  const [operations, setOperations] = useState<Operation[]>([]),
    [selected, setSelected] = useState('TeamNames'),
    [params, setParams] = useState<Record<string, string | boolean | number>>({}),
    [result, setResult] = useState<Execution | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(true),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    api
      .get<Operation[]>('/soap/operations', { signal: controller.signal })
      .then((r) => setOperations(r.data))
      .catch((e) => {
        if (!controller.signal.aborted) setError(errorMessage(e));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision]);
  const operation = operations.find((o) => o.name === selected);
  function choose(name: string) {
    setSelected(name);
    setResult(null);
    setParams({});
    setError('');
  }
  async function execute() {
    if (!operation) return;
    setBusy(true);
    setError('');
    setResult(null);
    const values: Record<string, string | boolean | number> = {};
    for (const p of operation.params)
      values[p.name] =
        p.type === 'int'
          ? Number(params[p.name] ?? 0)
          : p.type === 'bool'
            ? Boolean(params[p.name] ?? false)
            : String(params[p.name] ?? '');
    try {
      setResult(
        (await api.post<Execution>('/soap/execute', { operation: selected, params: values })).data,
      );
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageTitle
        
        title="SOAP"
        
      />
      <div className="lab-notice">
        <CodeXml size={18} /> Este laboratório sempre consulta o serviço externo, mesmo com a
        captura local selecionada.
      </div>
      {loading ? (
        <LoadingSkeleton />
      ) : !operations.length && error ? (
        <ErrorState message={error} retry={() => setRevision(revision + 1)} />
      ) : (
        <>
          <div className="lab-controls panel">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void execute();
              }}
            >
              <label>
                Operação
                <select value={selected} onChange={(e) => choose(e.target.value)} disabled={busy}>
                  {operations.map((o) => (
                    <option key={o.name}>{o.name}</option>
                  ))}
                </select>
              </label>
              <p>{operation?.description}</p>
              <div className="parameter-fields">
                {operation?.params.map((p) => (
                  <label key={p.name}>
                    {p.name} <small>{p.type}</small>
                    {p.type === 'bool' ? (
                      <select
                        value={String(params[p.name] ?? false)}
                        onChange={(e) =>
                          setParams({ ...params, [p.name]: e.target.value === 'true' })
                        }
                        disabled={busy}
                      >
                        <option value="false">false</option>
                        <option value="true">true</option>
                      </select>
                    ) : (
                      <input
                        required
                        type={p.type === 'int' ? 'number' : 'text'}
                        min={p.type === 'int' ? 0 : undefined}
                        max={p.type === 'int' ? 100000 : undefined}
                        maxLength={100}
                        value={String(params[p.name] ?? (p.type === 'int' ? 0 : ''))}
                        disabled={busy}
                        onChange={(e) => setParams({ ...params, [p.name]: e.target.value })}
                      />
                    )}
                  </label>
                ))}
              </div>
              <button className="button" disabled={busy} type="submit">
                <Play size={16} />
                {busy ? 'Executando SOAP…' : 'Executar requisição'}
              </button>
            </form>
            <div className="contract">
              <span className="eyebrow">CONTRATO WSDL</span>
              <p>
                <b>Entrada</b>
                <code>{operation?.input || 'Sem parâmetros'}</code>
              </p>
              <p>
                <b>Retorno</b>
                <code>{operation?.output}</code>
              </p>
              <a
                href="https://footballpool.dataflex.dev/info.wso?WSDL"
                target="_blank"
                rel="noreferrer"
              >
                Consultar WSDL original ↗
              </a>
            </div>
          </div>
          {error && (
            <div role="alert" className="error">
              {error}
            </div>
          )}
          {result && (
            <div className={`execution-status ${result.ok ? 'success' : 'failure'}`} role="status">
              <b>
                {result.ok
                  ? 'Resposta recebida'
                  : result.error_kind === 'soap_fault'
                    ? 'SOAP Fault'
                    : 'Falha na integração'}
              </b>
              <span>
                <Clock3 size={15} />
                {result.duration_ms.toLocaleString('pt-BR')} ms
              </span>
              {result.error && <p>{result.error}</p>}
            </div>
          )}
          <div className="soap-grid">
            <SoapRequestPanel title="XML enviado" xml value={result?.request_xml || ''} />
            <SoapResponsePanel title="XML recebido" xml value={result?.response_xml || ''} />
            <SoapResponsePanel
              title="JSON processado"
              value={result ? JSON.stringify(result.data, null, 2) : ''}
            />
          </div>
        </>
      )}
      <section className="concepts">
        <h2>Entenda a comunicação</h2>
        <div className="concept-grid">
          {concepts.map(([title, text]) => (
            <details key={title}>
              <summary>{title}</summary>
              <p>{text}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
