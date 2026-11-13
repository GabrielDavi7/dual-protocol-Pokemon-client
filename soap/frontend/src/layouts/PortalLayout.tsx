import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  House,
  CalendarDays,
  Shield,
  Users,
  MapPin,
  ChartNoAxesCombined,
  CodeXml,
  Info,
  Menu,
  X,
} from 'lucide-react';
import { Logo, ThemeToggle, SearchBar } from '../components/ui';
import { useFootball } from '../hooks/useFootball';
const links = [
  ['/', 'Início', House],
  ['/partidas', 'Partidas', CalendarDays],
  ['/selecoes', 'Seleções', Shield],
  ['/jogadores', 'Jogadores', Users],
  ['/estadios', 'Estádios', MapPin],
  ['/comparacoes', 'Estatísticas', ChartNoAxesCombined],
  ['/laboratorio', 'Laboratório SOAP', CodeXml],
  ['/sobre', 'Sobre o projeto', Info],
] as const;
export function Header({ open, toggle }: { open: boolean; toggle: () => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="header-inner">
        <Logo />
        <nav className="topnav" aria-label="Navegação principal">
          <NavLink to="/" end>
            Explorar
          </NavLink>
          <NavLink to="/partidas">Partidas</NavLink>
          <NavLink to="/laboratorio">SOAP / XML</NavLink>
        </nav>
        <form
          className="header-search"
          onSubmit={(e) => {
            e.preventDefault();
            navigate('/busca?q=' + encodeURIComponent(query));
          }}
        >
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar no acervo" />
        </form>
        <ThemeToggle />
        <button
          className="icon-button menu-toggle"
          onClick={toggle}
          aria-expanded={open}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
export function Sidebar({ open, close }: { open: boolean; close: () => void }) {
  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <span className="nav-label">EXPLORAR O FUTEBOL</span>
      <nav aria-label="Menu lateral">
        {links.map(([to, label, Icon]) => (
          <NavLink end={to === '/'} key={to} to={to} onClick={close}>
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <small className="sidebar-bottom">
        CAMISA 21
        <br />
        Futebol, dados e histórias.
      </small>
    </aside>
  );
}
export default function PortalLayout() {
  const [open, setOpen] = useState(false);
  const { source, setSource } = useFootball();
  return (
    <>
      <a className="skip-link" href="#main">
        Pular para conteúdo
      </a>
      <Header open={open} toggle={() => setOpen(!open)} />
      <div className="shell">
        <Sidebar open={open} close={() => setOpen(false)} />
        <main id="main">
          <div className="breadcrumb">
            <span>
              Futebol <span>/</span> Acervo de seleções
            </span>
            <label>
              Fonte{' '}
              <select
                aria-label="Fonte dos dados"
                value={source}
                onChange={(e) => setSource(e.target.value as 'live' | 'snapshot')}
              >
                <option value="live">SOAP online</option>
                <option value="snapshot">Captura local real</option>
              </select>
            </label>
          </div>
          <Outlet />
          <footer className="footer">
            <span>
              CAMISA <b>21</b> · Feito para explorar o jogo.
            </span>
            <NavLink to="/sobre">Projeto acadêmico · SOAP / XML / WSDL</NavLink>
          </footer>
        </main>
      </div>
    </>
  );
}
