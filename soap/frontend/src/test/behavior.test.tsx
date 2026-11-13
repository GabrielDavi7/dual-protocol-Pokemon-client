import { afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FootballProvider } from '../hooks/useFootball';
import { DataGuard, ThemeToggle } from '../components/ui';
import Laboratory from '../pages/Laboratory';
import { api } from '../services/api';
import { SoapResponsePanel } from '../components/SoapPanels';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});
describe('falhas e estados do portal', () => {
  it('mostra erro sem inventar dados e permite repetir', async () => {
    const get = vi.spyOn(api, 'get').mockRejectedValue(new Error('offline'));
    render(
      <FootballProvider>
        <DataGuard>{() => <p>Dados disponíveis</p>}</DataGuard>
      </FootballProvider>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.queryByText('Dados disponíveis')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Tentar novamente'));
    await waitFor(() => expect(get).toHaveBeenCalledTimes(2));
  });
  it('persiste tema escuro', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByLabelText('Ativar tema escuro'));
    expect(localStorage.getItem('camisa21-theme')).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
  it('laboratório exibe SOAP Fault e preserva XML recebido', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: [
        { name: 'TeamNames', description: 'Seleções', params: [], input: '', output: 'string[]' },
      ],
    });
    vi.spyOn(api, 'post').mockResolvedValue({
      data: {
        operation: 'TeamNames',
        ok: false,
        request_xml: '<Envelope/>',
        response_xml: '<Fault>Erro de teste</Fault>',
        data: null,
        duration_ms: 45,
        error: 'SOAP Fault: Erro de teste',
        error_kind: 'soap_fault',
      },
    });
    render(
      <MemoryRouter>
        <Laboratory />
      </MemoryRouter>,
    );
    fireEvent.click(await screen.findByText('Executar requisição'));
    expect(await screen.findByText('SOAP Fault')).toBeInTheDocument();
    expect(screen.getByText('Erro de teste')).toBeInTheDocument();
    expect(screen.getByText('45 ms')).toBeInTheDocument();
  });
  it('XML é exibido como texto e nunca executado como HTML', () => {
    render(<SoapResponsePanel title="XML" xml value={'<script>alert(1)</script>'} />);
    expect(document.querySelector('script')).toBeNull();
    expect(screen.getByText('<script>')).toBeInTheDocument();
  });
});
