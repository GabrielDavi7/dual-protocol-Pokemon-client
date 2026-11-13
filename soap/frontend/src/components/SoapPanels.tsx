import { useState } from 'react';
import { Copy, Download } from 'lucide-react';
export function SoapResponsePanel({
  title,
  value,
  xml = false,
}: {
  title: string;
  value: string;
  xml?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([value], { type: xml ? 'application/xml' : 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = title.toLowerCase().replaceAll(' ', '-') + (xml ? '.xml' : '.json');
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <section className="code-panel">
      <div className="code-title">
        <h3>{title}</h3>
        <div>
          <button aria-label={`Copiar ${title}`} onClick={copy} disabled={!value}>
            <Copy size={15} />
            {copied ? 'Copiado' : ''}
          </button>
          <button aria-label={`Baixar ${title}`} onClick={download} disabled={!value}>
            <Download size={15} />
          </button>
        </div>
      </div>
      <pre tabIndex={0}>
        <code>
          {value
            ? xml
              ? value.split(/(<[^>]+>)/g).map((part, i) => (
                  <span key={i} className={part.startsWith('<') ? 'xml-tag' : ''}>
                    {part}
                  </span>
                ))
              : value
            : 'Execute uma operação para visualizar.'}
        </code>
      </pre>
    </section>
  );
}
export const SoapRequestPanel = SoapResponsePanel;
