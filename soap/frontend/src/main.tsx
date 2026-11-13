import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FootballProvider } from './hooks/useFootball';
import PortalLayout from './layouts/PortalLayout';
import Home from './pages/Home';
import {
  Matches,
  MatchDetail,
  Teams,
  TeamDetail,
  Players,
  PlayerDetail,
  Stadiums,
  StadiumDetail,
  SearchResults,
} from './pages/Explore';
import Comparison from './pages/Comparison';
import Laboratory from './pages/Laboratory';
import About from './pages/About';
import { EmptyState } from './components/ui';
import './styles/index.css';
document.documentElement.dataset.theme = localStorage.getItem('camisa21-theme') || 'light';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <FootballProvider>
        <Routes>
          <Route element={<PortalLayout />}>
            <Route index element={<Home />} />
            <Route path="partidas" element={<Matches />} />
            <Route path="partidas/:id" element={<MatchDetail />} />
            <Route path="selecoes" element={<Teams />} />
            <Route path="selecoes/:name" element={<TeamDetail />} />
            <Route path="jogadores" element={<Players />} />
            <Route path="jogadores/:id" element={<PlayerDetail />} />
            <Route path="estadios" element={<Stadiums />} />
            <Route path="estadios/:name" element={<StadiumDetail />} />
            <Route path="comparacoes" element={<Comparison />} />
            <Route path="laboratorio" element={<Laboratory />} />
            <Route path="sobre" element={<About />} />
            <Route path="busca" element={<SearchResults />} />
            <Route
              path="*"
              element={<EmptyState message="Página não encontrada. Use o menu para explorar." />}
            />
          </Route>
        </Routes>
      </FootballProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
