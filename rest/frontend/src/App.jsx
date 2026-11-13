import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const coresTipos = {
  normal:
    "bg-stone-500/20 text-stone-400 border-stone-500/30 hover:border-stone-500",
  fire: "bg-red-500/20 text-red-400 border-red-500/30 hover:border-red-500",
  water:
    "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:border-blue-500",
  grass:
    "bg-green-500/20 text-green-400 border-green-500/30 hover:border-green-500",
  electric:
    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:border-yellow-500",
  ice: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:border-cyan-500",
  fighting:
    "bg-orange-700/20 text-orange-500 border-orange-700/30 hover:border-orange-500",
  poison:
    "bg-purple-500/20 text-purple-400 border-purple-500/30 hover:border-purple-500",
  ground:
    "bg-amber-600/20 text-amber-500 border-amber-600/30 hover:border-amber-500",
  flying:
    "bg-indigo-400/20 text-indigo-400 border-indigo-400/30 hover:border-indigo-400",
  psychic:
    "bg-pink-500/20 text-pink-400 border-pink-500/30 hover:border-pink-500",
  bug: "bg-lime-500/20 text-lime-400 border-lime-500/30 hover:border-lime-500",
  rock: "bg-yellow-700/20 text-yellow-600 border-yellow-700/30 hover:border-yellow-600",
  ghost:
    "bg-indigo-700/20 text-indigo-400 border-indigo-700/30 hover:border-indigo-500",
  dragon:
    "bg-violet-600/20 text-violet-400 border-violet-600/30 hover:border-violet-500",
  dark: "bg-slate-700/80 text-slate-300 border-slate-600/50 hover:border-slate-400",
  steel:
    "bg-slate-400/20 text-slate-300 border-slate-400/30 hover:border-slate-300",
  fairy:
    "bg-rose-400/20 text-rose-400 border-rose-400/30 hover:border-rose-400",
  default: "bg-slate-600/20 text-slate-400 border-slate-600/30",
};

const emojisTipos = {
  normal: "⚪",
  fire: "🔥",
  water: "💧",
  grass: "🌿",
  electric: "⚡",
  ice: "❄️",
  fighting: "🥊",
  poison: "☠️",
  ground: "⛰️",
  flying: "🌪️",
  psychic: "🔮",
  bug: "🐛",
  rock: "🪨",
  ghost: "👻",
  dragon: "🐉",
  dark: "🌙",
  steel: "⚙️",
  fairy: "✨",
  default: "❓",
};

const coresJogos = {
  red: "bg-red-600 text-white border-red-800",
  blue: "bg-blue-600 text-white border-blue-800",
  yellow: "bg-yellow-400 text-yellow-900 border-yellow-600",
  gold: "bg-yellow-500 text-yellow-900 border-yellow-700",
  silver: "bg-slate-300 text-slate-800 border-slate-500",
  crystal: "bg-cyan-200 text-cyan-900 border-cyan-400",
  ruby: "bg-red-700 text-white border-red-900",
  sapphire: "bg-blue-700 text-white border-blue-900",
  emerald: "bg-emerald-500 text-white border-emerald-700",
  firered: "bg-orange-600 text-white border-orange-800",
  leafgreen: "bg-lime-500 text-white border-lime-700",
  diamond: "bg-sky-400 text-sky-900 border-sky-600",
  pearl: "bg-pink-300 text-pink-900 border-pink-500",
  platinum: "bg-slate-400 text-slate-900 border-slate-600",
  heartgold: "bg-amber-500 text-amber-900 border-amber-700",
  soulsilver: "bg-gray-300 text-gray-900 border-gray-500",
  black: "bg-zinc-900 text-zinc-100 border-zinc-700",
  white: "bg-zinc-100 text-zinc-900 border-zinc-300",
  "black-2": "bg-zinc-800 text-zinc-100 border-zinc-900",
  "white-2": "bg-zinc-200 text-zinc-900 border-zinc-400",
  x: "bg-blue-500 text-white border-blue-700",
  y: "bg-red-500 text-white border-red-700",
  "omega-ruby": "bg-red-800 text-white border-red-950",
  "alpha-sapphire": "bg-blue-800 text-white border-blue-950",
  sun: "bg-orange-400 text-orange-900 border-orange-600",
  moon: "bg-indigo-600 text-white border-indigo-800",
  "ultra-sun": "bg-orange-500 text-white border-orange-700",
  "ultra-moon": "bg-indigo-700 text-white border-indigo-900",
  sword: "bg-cyan-600 text-white border-cyan-800",
  shield: "bg-rose-600 text-white border-rose-800",
  scarlet: "bg-red-600 text-white border-red-800",
  violet: "bg-violet-700 text-white border-violet-900",
  default: "bg-slate-700 text-slate-300 border-slate-600",
};

const geracoes = [
  { nome: "🔴 1ª (Kanto 1-151)", min: 1, max: 151 },
  { nome: "🟡 2ª (Johto 152-251)", min: 152, max: 251 },
  { nome: "🟢 3ª (Hoenn 252-386)", min: 252, max: 386 },
  { nome: "🔵 4ª (Sinnoh 387-493)", min: 387, max: 493 },
  { nome: "⚪ 5ª (Unova 494-649)", min: 494, max: 649 },
  { nome: "🟣 6ª (Kalos 650-721)", min: 650, max: 721 },
  { nome: "🌴 7ª (Alola 722-809)", min: 722, max: 809 },
  { nome: "⚔️ 8ª (Galar 810-905)", min: 810, max: 905 },
  { nome: "🎒 9ª (Paldea 906+)", min: 906, max: 1025 },
  { nome: "🧬 Megas/Especiais", min: 10000, max: 20000 },
  { nome: "🌍 Todas (Pesado)", min: 1, max: 100000 },
];

const listaTipos = Object.keys(coresTipos).filter((t) => t !== "default");

const gerarSoapXML = (poke) => {
  if (!poke) return "";
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetPokemonResponse xmlns="http://pokedex.interface.soap/">
      <Pokemon>
        <Id>${poke.id_pokedex}</Id>
        <Name>${poke.nome}</Name>
        <Height>${poke.altura_cm}</Height>
        <Weight>${poke.peso_kg}</Weight>
        
        <Audio>${poke.audio || "Not Found"}</Audio>

        <Types>
          ${poke.tipos.map((t) => `<Type>${t}</Type>`).join("\n          ")}
        </Types>
        
        <Abilities>
          ${poke.habilidades.map((a) => `<Ability>${a}</Ability>`).join("\n          ")}
        </Abilities>
        
        <Stats>
          ${Object.entries(poke.status)
            .map(
              ([k, v]) => `<${k.replace("-", "")}>${v}</${k.replace("-", "")}>`,
            )
            .join("\n          ")}
        </Stats>
            
        <Evolutions>
          ${
            poke.cadeia_evolucao && poke.cadeia_evolucao.length > 0
              ? poke.cadeia_evolucao
                  .map((e) => `<Evolution id="${e.id}">${e.nome}</Evolution>`)
                  .join("\n          ")
              : "<Evolution>None</Evolution>"
          }
        </Evolutions>
        
        <Games>
          ${poke.jogos_que_aparece && poke.jogos_que_aparece.length > 0 ? poke.jogos_que_aparece.map((g) => `<Game>${typeof g === "string" ? g : g.nome}</Game>`).join("\n          ") : "<Game>None</Game>"}
        </Games>

        <Locations>
          ${
            poke.localizacoes && poke.localizacoes.length > 0
              ? poke.localizacoes
                  .map((l) => {
                    const locName =
                      typeof l === "string" ? l : l.nome || "Unknown";
                    const locGame =
                      typeof l === "string" ? "Any" : l.jogo || "Any";
                    return `<Location game="${locGame}">${locName}</Location>`;
                  })
                  .join("\n          ")
              : "<Location>Unknown</Location>"
          }
        </Locations>

        <Moves>
          ${
            poke.movimentos && poke.movimentos.length > 0
              ? poke.movimentos
                  .map((m) => `<Move>${m}</Move>`)
                  .join("\n          ")
              : "<Move>None</Move>"
          }
        </Moves>
      </Pokemon>
    </GetPokemonResponse>
  </soap:Body>
</soap:Envelope>`;
};

function App() {
  const [telaAtiva, setTelaAtiva] = useState("inicio");
  const [formatoCodigo, setFormatoCodigo] = useState("json");
  const [busca, setBusca] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);
  const [listaCompleta, setListaCompleta] = useState([]);
  const [listaExibida, setListaExibida] = useState([]);
  const [pokemonAleatorio, setPokemonAleatorio] = useState(null);

  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [geracaoFiltro, setGeracaoFiltro] = useState(0);
  const [carregandoGaleria, setCarregandoGaleria] = useState(true);

  const [benchmark, setBenchmark] = useState({
    json: "0.0000",
    soap: "0.0000",
  });

  const sortearPokemon = useCallback(() => {
    const pokemonsDisponiveis = listaCompleta.filter((p) => {
      const id = Number(p.id);
      return Number.isInteger(id) && id >= 1 && id <= 1025;
    });
    const opcoes =
      pokemonsDisponiveis.length > 1
        ? pokemonsDisponiveis.filter((p) => p.id !== pokemonAleatorio?.id)
        : pokemonsDisponiveis;
    if (opcoes.length > 0) {
      setPokemonAleatorio(
        opcoes[Math.floor(Math.random() * opcoes.length)],
      );
    }
  }, [listaCompleta, pokemonAleatorio]);

  useEffect(() => {
    if (telaAtiva === "inicio" && !pokemonAleatorio && listaCompleta.length) {
      sortearPokemon();
    }
  }, [listaCompleta, pokemonAleatorio, sortearPokemon, telaAtiva]);

  useEffect(() => {
    if (pokemon) {
      const iteracoes = 100;

      const t0 = performance.now();
      for (let i = 0; i < iteracoes; i++) {
        JSON.stringify(pokemon);
      }
      const t1 = performance.now();

      const t2 = performance.now();
      for (let i = 0; i < iteracoes; i++) {
        gerarSoapXML(pokemon);
      }
      const t3 = performance.now();

      const tempoJson = ((t1 - t0) / iteracoes).toFixed(4);
      const tempoSoap = ((t3 - t2) / iteracoes).toFixed(4);

      setBenchmark({
        json: tempoJson,
        soap: tempoSoap,
      });
    }
  }, [pokemon]);

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=10000")
      .then((res) => {
        const dadosFormatados = res.data.results.map((p) => ({
          nome: p.name,
          id: p.url.split("/")[6],
        }));
        setListaCompleta(dadosFormatados);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (listaCompleta.length === 0) return;

    setCarregandoGaleria(true);

    const aplicarFiltroGeracao = (lista) => {
      const gen = geracoes[geracaoFiltro];
      return lista.filter(
        (p) => parseInt(p.id) >= gen.min && parseInt(p.id) <= gen.max,
      );
    };

    if (tipoFiltro === "todos") {
      setListaExibida(aplicarFiltroGeracao(listaCompleta));
      setCarregandoGaleria(false);
    } else if (tipoFiltro === "mega") {
      const filtrados = listaCompleta.filter((p) => p.nome.includes("-mega"));
      setListaExibida(filtrados);
      setCarregandoGaleria(false);
    } else {
      axios.get(`https://pokeapi.co/api/v2/type/${tipoFiltro}`).then((res) => {
        const filtrados = res.data.pokemon.map((p) => ({
          nome: p.pokemon.name,
          id: p.pokemon.url.split("/")[6],
        }));
        filtrados.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        setListaExibida(aplicarFiltroGeracao(filtrados));
        setCarregandoGaleria(false);
      });
    }
  }, [tipoFiltro, geracaoFiltro, listaCompleta]);

  const lidarComDigitacao = (e) => {
    const valorDigitado = e.target.value.toLowerCase();
    setBusca(valorDigitado);

    if (valorDigitado.length > 0) {
      const filtrados = listaCompleta
        .filter((p) => p.nome.startsWith(valorDigitado))
        .slice(0, 6);
      setSugestoes(filtrados);
      setMostrarPopup(true);
    } else {
      setMostrarPopup(false);
    }
  };

  const buscarPokemon = async (nomeParaBuscar) => {
    const alvo = nomeParaBuscar || busca;
    if (!alvo) return;

    try {
      setMostrarPopup(false);
      setCarregando(true);
      setErro("");
      setPokemon(null);

      const resposta = await axios.get(
        `http://127.0.0.1:8000/api/pokemon/${alvo}`,
      );
      setPokemon(resposta.data);
      setBusca(alvo);
      setTelaAtiva("busca");
    } catch (error) {
      setErro("Pokémon não encontrado nos registros.");
    } finally {
      setCarregando(false);
    }
  };

  const abrirTelaInicial = () => {
    setTelaAtiva("inicio");
    setPokemon(null);
    setBusca("");
    setErro("");
    setMostrarPopup(false);
    sortearPokemon();
  };

  const telaOcupada = pokemon || erro || carregando;

  const jsonBytes = pokemon ? new Blob([JSON.stringify(pokemon)]).size : 0;
  const soapBytes = pokemon ? new Blob([gerarSoapXML(pokemon)]).size : 0;
  const maxBytes = Math.max(jsonBytes, soapBytes, 1);
  const maxTime = Math.max(
    parseFloat(benchmark.json),
    parseFloat(benchmark.soap),
    Number.EPSILON,
  );

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-sans overflow-hidden">
      <header className="w-full bg-red-600 border-b-[8px] border-red-800 px-6 py-4 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50">
        <div
          onClick={abrirTelaInicial}
          className="flex items-center gap-6 cursor-pointer hover:opacity-80 transition-all hover:scale-105"
          title="Reiniciar e voltar para o início"
        >
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 rounded-full bg-blue-500 border-4 border-slate-100 shadow-[0_0_15px_rgba(59,130,246,0.8)] relative">
              <div className="absolute top-1 left-1 w-3 h-3 bg-white/60 rounded-full"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-red-800 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 border border-green-700 shadow-sm"></div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wider drop-shadow-md hidden sm:block">
              POKÉDEX
            </h1>
          </div>
        </div>

        <nav className="flex gap-2 bg-red-800/50 p-1.5 rounded-xl border border-red-700/50 shadow-inner overflow-x-auto">
          <button
            onClick={abrirTelaInicial}
            className={`px-4 py-2 rounded-lg font-bold transition-all text-sm whitespace-nowrap ${telaAtiva === "busca" || telaAtiva === "inicio" ? "bg-slate-900 text-blue-400 shadow-md" : "text-red-100 hover:bg-red-500/50"}`}
          >
            🔍 Consulta
          </button>
          <button
            onClick={() => setTelaAtiva("galeria")}
            className={`px-4 py-2 rounded-lg font-bold transition-all text-sm whitespace-nowrap ${telaAtiva === "galeria" ? "bg-slate-900 text-blue-400 shadow-md" : "text-red-100 hover:bg-red-500/50"}`}
          >
            📚 Galeria Total
          </button>
          <button
            onClick={() => setTelaAtiva("json")}
            disabled={!pokemon}
            className={`px-4 py-2 rounded-lg font-bold transition-all text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${telaAtiva === "json" ? "bg-slate-900 text-blue-400 shadow-md" : "text-red-100 hover:bg-red-500/50"}`}
          >
            💻 Ver API
          </button>
        </nav>
      </header>

      <main
        className="flex-1 overflow-y-auto bg-slate-950 relative scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-700"
        style={{
          backgroundImage:
            "linear-gradient(rgba(2, 6, 23, 0.48), rgba(2, 6, 23, 0.48)), url(/pokemon.jpg)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {telaAtiva === "inicio" && (
          <section className="relative flex min-h-full w-full items-center justify-center overflow-hidden p-6 sm:p-10">
            <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-slate-800/90 via-slate-950/85 to-slate-900/90 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
              <div className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="mb-7 text-center">
                <h2 className="text-3xl font-black text-white sm:text-4xl">
                  Encontre seu Pokémon
                </h2>
                <p className="mt-2 font-medium text-slate-300">
                  Pesquise pelo nome para descobrir seus dados e habilidades.
                </p>
              </div>
              {pokemonAleatorio && (
                <div className="relative mx-auto mb-7 flex aspect-square w-full max-w-[380px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.12] via-white/[0.04] to-cyan-300/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_18px_40px_rgba(0,0,0,0.35)]">
                  <div className="pointer-events-none absolute left-1/2 top-[42%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-3xl sm:h-72 sm:w-72"></div>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonAleatorio.id}.png`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonAleatorio.id}.png`;
                    }}
                    alt={pokemonAleatorio.nome}
                    className="relative z-10 h-[72%] w-[72%] object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.5)]"
                  />
                  <div className="relative z-10 -mt-2 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-200/80 sm:text-xs">
                      Pokémon surpresa
                    </p>
                    <p className="mt-1 text-2xl font-black capitalize text-white sm:text-3xl">
                      {pokemonAleatorio.nome.replaceAll("-", " ")}
                    </p>
                    <p className="mt-1 font-mono text-sm font-bold text-slate-300">
                      Nº {String(pokemonAleatorio.id).padStart(4, "0")}
                    </p>
                  </div>
                </div>
              )}
              <div className="relative">
                <div className="flex shadow-2xl">
                  <input
                    type="text"
                    value={busca}
                    onChange={lidarComDigitacao}
                    onKeyDown={(e) => e.key === "Enter" && buscarPokemon()}
                    placeholder="Ex: charizard, gengar, lucario..."
                    className="min-w-0 flex-1 rounded-l-2xl border-2 border-r-0 border-slate-600 bg-slate-800 px-4 py-4 text-base font-semibold text-white transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none sm:px-6 sm:text-lg"
                  />
                  <button
                    onClick={() => buscarPokemon()}
                    disabled={carregando}
                    className="rounded-r-2xl border-2 border-blue-600 bg-blue-600 px-5 font-black tracking-wider text-white transition-all hover:bg-blue-500 disabled:border-slate-700 disabled:bg-slate-700 sm:px-8"
                  >
                    {carregando ? "⏳" : "BUSCAR"}
                  </button>
                </div>
                {mostrarPopup && sugestoes.length > 0 && (
                  <ul className="absolute top-full left-0 z-50 mt-2 w-[calc(100%-7rem)] overflow-hidden rounded-xl border-2 border-slate-600 bg-slate-800 shadow-2xl sm:w-[calc(100%-8rem)]">
                    {sugestoes.map((sugestao) => (
                      <li
                        key={sugestao.nome}
                        onClick={() => buscarPokemon(sugestao.nome)}
                        className="flex cursor-pointer items-center gap-3 border-b border-slate-700/50 px-6 py-3 font-bold capitalize text-slate-300 transition-colors last:border-0 hover:bg-blue-600 hover:text-white"
                      >
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${sugestao.id}.png`}
                          alt=""
                          className="h-8 w-8"
                        />
                        {sugestao.nome.replace("-", " ")}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {erro && (
                <div className="mt-5 rounded-r-xl border-l-4 border-red-500 bg-red-900/60 px-5 py-3 font-medium text-red-200">
                  {erro}
                </div>
              )}
            </div>
          </section>
        )}

        {telaAtiva === "busca" && (
          <div className="flex flex-col items-center p-8 min-h-full">
            <div
              className={`w-full max-w-2xl transition-all duration-700 ease-in-out z-20 ${telaOcupada ? "mt-0" : "mt-[25vh]"}`}
            >
              {!telaOcupada && (
                <div className="text-center mb-8 opacity-80">
                  <h2 className="text-4xl font-black text-slate-300">
                    Encontre seu Pokémon
                  </h2>
                  <p className="text-slate-500 mt-2 font-medium">
                    Pesquise pelo nome e visualize análises de batalha em tempo
                    real.
                  </p>
                </div>
              )}

              <div className="relative">
                <div className="flex shadow-2xl">
                  <input
                    type="text"
                    value={busca}
                    onChange={lidarComDigitacao}
                    onKeyDown={(e) => e.key === "Enter" && buscarPokemon()}
                    placeholder="Ex: charizard, gengar, lucario..."
                    className="flex-1 px-6 py-4 bg-slate-800 text-white text-lg font-semibold rounded-l-2xl border-2 border-r-0 border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    onClick={() => buscarPokemon()}
                    disabled={carregando}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 px-8 py-4 rounded-r-2xl font-black tracking-wider transition-all border-2 border-blue-600 disabled:border-slate-700"
                  >
                    {carregando ? "⏳" : "BUSCAR"}
                  </button>
                </div>

                {mostrarPopup && sugestoes.length > 0 && (
                  <ul className="absolute top-full left-0 w-[calc(100%-8rem)] bg-slate-800 border-2 border-slate-600 rounded-xl mt-2 overflow-hidden shadow-2xl z-50">
                    {sugestoes.map((sugestao) => (
                      <li
                        key={sugestao.nome}
                        onClick={() => buscarPokemon(sugestao.nome)}
                        className="px-6 py-3 cursor-pointer hover:bg-blue-600 hover:text-white text-slate-300 capitalize font-bold transition-colors border-b border-slate-700/50 last:border-0 flex items-center gap-3"
                      >
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${sugestao.id}.png`}
                          alt="icon"
                          className="w-8 h-8"
                        />
                        {sugestao.nome.replace("-", " ")}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {erro && (
              <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 px-6 py-4 rounded-r-xl font-medium w-full max-w-2xl mt-8">
                {erro}
              </div>
            )}

            {pokemon && (
              <div className="bg-slate-800 p-8 pt-24 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-xl border-4 border-slate-700 relative mt-20 mb-12">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2">
                  <div className="bg-slate-200 p-4 rounded-full border-8 border-slate-700 shadow-inner h-40 w-40 flex items-center justify-center relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)",
                      }}
                    ></div>
                    <img
                      src={pokemon.imagem}
                      alt={pokemon.nome}
                      className="w-32 h-32 object-contain drop-shadow-xl hover:scale-110 transition-transform relative z-10"
                    />
                  </div>
                </div>

                <div className="text-center mb-4 flex flex-col items-center">
                  <div className="flex items-center gap-4 justify-center">
                    <h2 className="text-5xl font-black tracking-wide capitalize">
                      {pokemon.nome.replace("-", " ")}
                    </h2>
                    {pokemon.audio && (
                      <button
                        onClick={() => {
                          const som = new Audio(pokemon.audio);
                          som.volume = 0.2;
                          som.play();
                        }}
                        className="bg-slate-700 hover:bg-blue-500 text-white p-3 rounded-full transition-all shadow-lg hover:scale-110 border-2 border-slate-600 hover:border-blue-400 flex items-center justify-center"
                        title="Ouvir Grito Original"
                      >
                        🔊
                      </button>
                    )}
                  </div>
                  <p className="text-slate-400 font-bold text-xl mt-2">
                    Nº {String(pokemon.id_pokedex).padStart(4, "0")}
                  </p>
                </div>

                {pokemon.formas_alternativas &&
                  pokemon.formas_alternativas.length > 1 && (
                    <div className="mb-6 flex flex-col items-center">
                      <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                        Formas Encontradas
                      </p>
                      <select
                        value={pokemon.nome.toLowerCase()}
                        onChange={(e) => buscarPokemon(e.target.value)}
                        className="bg-slate-900 border-2 border-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 capitalize cursor-pointer text-sm shadow-inner text-center w-64"
                      >
                        {pokemon.formas_alternativas.map((forma) => (
                          <option key={forma} value={forma}>
                            {forma.replace("-", " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                <div className="flex justify-center flex-wrap gap-3 mb-8">
                  {pokemon.tipos.map((tipo) => {
                    const classesCor = coresTipos[tipo] || coresTipos.default;
                    const emoji = emojisTipos[tipo] || emojisTipos.default;
                    return (
                      <span
                        key={tipo}
                        className={`${classesCor} px-5 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest border-2 flex items-center gap-2`}
                      >
                        <span>{emoji}</span> {tipo}
                      </span>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-900/80 p-5 rounded-3xl text-center border-2 border-slate-700/50">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                      Altura
                    </p>
                    <p className="font-bold text-2xl text-slate-200">
                      {pokemon.altura_cm} cm
                    </p>
                  </div>
                  <div className="bg-slate-900/80 p-5 rounded-3xl text-center border-2 border-slate-700/50">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                      Peso
                    </p>
                    <p className="font-bold text-2xl text-slate-200">
                      {pokemon.peso_kg} kg
                    </p>
                  </div>
                </div>

                <div className="mb-4 bg-slate-900/50 p-6 rounded-3xl border-2 border-slate-700/50">
                  <h3 className="text-slate-500 text-xs font-bold uppercase mb-5 tracking-widest text-center">
                    Status de Batalha
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(pokemon.status).map(([nome, valor]) => (
                      <div key={nome} className="flex items-center text-sm">
                        <span className="uppercase font-bold text-slate-300 w-36 text-xs">
                          {nome.replace("-", " ")}
                        </span>
                        <span className="font-black w-10 text-right mr-4 text-lg">
                          {valor}
                        </span>
                        <div className="flex-1 bg-slate-950 h-3 rounded-full overflow-hidden shadow-inner border border-slate-800">
                          <div
                            className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${valor > 150 ? 100 : (valor / 150) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-6">
                  {pokemon.cadeia_evolucao &&
                    pokemon.cadeia_evolucao.length > 1 && (
                      <div className="bg-slate-900/50 p-6 rounded-3xl border-2 border-slate-700/50">
                        <h3 className="text-slate-500 text-xs font-bold uppercase mb-6 tracking-widest text-center">
                          🧬 Linha Evolutiva
                        </h3>
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                          {pokemon.cadeia_evolucao.map((evo, index) => {
                            const isAtual =
                              pokemon.nome.toLowerCase() ===
                              evo.nome.toLowerCase();
                            return (
                              <div
                                key={evo.nome}
                                className="flex items-center gap-2 sm:gap-4"
                              >
                                <div
                                  onClick={() => buscarPokemon(evo.nome)}
                                  className={`flex flex-col items-center p-3 rounded-2xl cursor-pointer transition-all border-2 ${isAtual ? "bg-blue-900/40 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-110 z-10" : "bg-slate-800 border-slate-600 hover:border-blue-400 hover:bg-slate-700"}`}
                                  title={`Ver dados de ${evo.nome}`}
                                >
                                  <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                                    alt={evo.nome}
                                    className="w-16 h-16 drop-shadow-md"
                                  />
                                  <span
                                    className={`text-[10px] font-bold capitalize mt-2 ${isAtual ? "text-blue-300" : "text-slate-400"}`}
                                  >
                                    {evo.nome.replace("-", " ")}
                                  </span>
                                </div>
                                {index < pokemon.cadeia_evolucao.length - 1 && (
                                  <span className="text-slate-600 font-black text-xl">
                                    ➔
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  <div className="bg-slate-900/50 p-6 rounded-3xl border-2 border-slate-700/50">
                    <h3 className="text-slate-500 text-xs font-bold uppercase mb-4 tracking-widest text-center">
                      🎮 Aparece nos Jogos
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
                      {pokemon.jogos_que_aparece &&
                      pokemon.jogos_que_aparece.length > 0 ? (
                        pokemon.jogos_que_aparece.map((jogo, idx) => {
                          const nomeJogo =
                            typeof jogo === "string" ? jogo : "Desconhecido";
                          const corJogo =
                            coresJogos[nomeJogo] || coresJogos.default;
                          return (
                            <span
                              key={`jogo-${idx}`}
                              className={`${corJogo} px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap capitalize border-2 shadow-lg`}
                            >
                              {String(nomeJogo).replace(/-/g, " ")}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-slate-500 text-sm italic w-full text-center">
                          Nenhum jogo registrado
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-6 rounded-3xl border-2 border-slate-700/50">
                    <h3 className="text-slate-500 text-xs font-bold uppercase mb-4 tracking-widest text-center">
                      📍 Onde Encontrar (Rotas/Locais)
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
                      {pokemon.localizacoes &&
                      pokemon.localizacoes.length > 0 ? (
                        pokemon.localizacoes.map((local, idx) => {
                          const nomeLocal =
                            local?.nome ||
                            (typeof local === "string"
                              ? local
                              : "desconhecido");
                          const jogoReferencia = local?.jogo || "default";
                          const corJogo =
                            coresJogos[jogoReferencia] || coresJogos.default;
                          return (
                            <span
                              key={`local-${idx}`}
                              className={`${corJogo} px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap capitalize border-2 opacity-90 shadow-md`}
                            >
                              {String(nomeLocal).replace(/-/g, " ")}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-slate-500 text-sm italic w-full text-center">
                          Localização selvagem desconhecida
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-6 rounded-3xl border-2 border-slate-700/50">
                    <h3 className="text-slate-500 text-xs font-bold uppercase mb-4 tracking-widest text-center">
                      ⚔️ Golpes Disponíveis (Moves)
                    </h3>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 justify-center">
                      {pokemon.movimentos && pokemon.movimentos.length > 0 ? (
                        pokemon.movimentos.map((move) => (
                          <span
                            key={move}
                            className="bg-red-900/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold capitalize border border-red-800/30"
                          >
                            {move.replace("-", " ")}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-sm italic w-full text-center">
                          Nenhum golpe registrado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {telaAtiva === "galeria" && (
          <div className="p-8 max-w-7xl mx-auto min-h-full flex flex-col">
            <div className="bg-slate-800 p-6 rounded-2xl border-2 border-slate-700 mb-8 shadow-xl flex flex-col gap-4 md:flex-row justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-white">
                  Todos os Pokémon
                </h2>
                <p className="text-slate-400 font-bold mt-1">
                  Exibindo: {listaExibida.length} registros
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-xl border border-slate-700/50 shadow-inner">
                  <span className="font-bold text-slate-400 text-sm uppercase tracking-widest hidden sm:inline px-2">
                    Geração:
                  </span>
                  <select
                    value={geracaoFiltro}
                    onChange={(e) => setGeracaoFiltro(Number(e.target.value))}
                    className="bg-slate-800 border-2 border-slate-600 text-white font-bold px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer shadow-inner text-sm"
                  >
                    {geracoes.map((gen, idx) => (
                      <option key={idx} value={idx}>
                        {gen.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-xl border border-slate-700/50 shadow-inner">
                  <span className="font-bold text-slate-400 text-sm uppercase tracking-widest hidden sm:inline px-2">
                    Elemento:
                  </span>
                  <select
                    value={tipoFiltro}
                    onChange={(e) => setTipoFiltro(e.target.value)}
                    className="bg-slate-800 border-2 border-slate-600 text-white font-bold px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 capitalize cursor-pointer shadow-inner text-sm"
                  >
                    <option value="todos">🌍 Qualquer Tipo</option>
                    {listaTipos.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {emojisTipos[tipo]} {tipo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {carregandoGaleria ? (
              <div className="flex-1 flex justify-center items-center">
                <p className="text-2xl font-bold text-slate-500 animate-pulse">
                  Carregando Pokédex Global...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 pb-12">
                {listaExibida.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => buscarPokemon(p.nome)}
                    className="bg-slate-800/80 rounded-xl p-4 flex flex-col items-center justify-center border-2 border-slate-700/50 hover:border-blue-500 hover:bg-slate-700 cursor-pointer transition-all hover:-translate-y-1 shadow-lg group"
                  >
                    <div className="h-16 flex items-center justify-center">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${p.id}.gif`}
                        onError={(e) =>
                          (e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`)
                        }
                        alt={p.nome}
                        loading="lazy"
                        className="max-h-16 drop-shadow-md group-hover:scale-125 transition-transform"
                      />
                    </div>
                    <p className="mt-3 text-[11px] font-bold text-slate-300 capitalize group-hover:text-white truncate w-full text-center">
                      {p.nome.replace("-", " ")}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold">
                      #{String(p.id).padStart(3, "0")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {telaAtiva === "json" && pokemon && (
          <div className="p-8 flex flex-col items-center">
            <div className="flex justify-between items-end mb-0 w-full max-w-4xl">
              <div className="flex gap-2">
                <button
                  onClick={() => setFormatoCodigo("json")}
                  className={`px-8 py-3 rounded-t-2xl font-bold transition-all ${formatoCodigo === "json" ? "bg-[#0a0a0a] text-green-400 border-t-2 border-green-500" : "bg-slate-800 text-slate-500 hover:bg-slate-700"}`}
                >
                  REST (JSON)
                </button>
                <button
                  onClick={() => setFormatoCodigo("soap")}
                  className={`px-8 py-3 rounded-t-2xl font-bold transition-all ${formatoCodigo === "soap" ? "bg-[#0a0a0a] text-blue-400 border-t-2 border-blue-500" : "bg-slate-800 text-slate-500 hover:bg-slate-700"}`}
                >
                  XML
                </button>
              </div>

              <div className="flex gap-2">
                <div className="bg-slate-800/80 px-4 py-2 rounded-t-xl border border-b-0 border-slate-700 text-xs font-mono flex flex-col items-end">
                  <span className="text-slate-500 text-[9px] uppercase tracking-wider mb-0.5">
                    Tempo Processamento
                  </span>
                  <span
                    className={`font-black text-sm flex items-center gap-2 ${formatoCodigo === "json" ? "text-green-400" : "text-blue-400"}`}
                  >
                    ⏱️{" "}
                    {formatoCodigo === "json" ? benchmark.json : benchmark.soap}{" "}
                    ms
                  </span>
                </div>

                <div className="bg-slate-800/80 px-4 py-2 rounded-t-xl border border-b-0 border-slate-700 text-xs font-mono flex flex-col items-end">
                  <span className="text-slate-500 text-[9px] uppercase tracking-wider mb-0.5">
                    Tamanho do Payload
                  </span>
                  <span
                    className={`font-black text-sm flex items-center gap-2 ${formatoCodigo === "json" ? "text-green-400" : "text-blue-400"}`}
                  >
                    📦 {formatoCodigo === "json" ? jsonBytes : soapBytes} Bytes
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-4xl bg-[#0a0a0a] rounded-b-none border-x border-t border-slate-700 shadow-2xl overflow-hidden">
              <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-xs font-mono text-slate-400">
                    {formatoCodigo === "json"
                      ? `~/backend/rest/api/pokemon/${pokemon.nome.toLowerCase()}.json`
                      : `~/backend/rest/ws/pokemon/${pokemon.nome.toLowerCase()}.xml`}
                  </span>
                </div>
                {formatoCodigo === "soap" && (
                  <span className="text-[10px] font-bold text-red-400 bg-red-900/30 px-2 py-1 rounded">
                    ⚠️ OVERHEAD DE SERIALIZAÇÃO IDENTIFICADO
                  </span>
                )}
              </div>
              <div className="p-6 h-[48vh] overflow-y-auto scrollbar-thin scrollbar-track-[#0a0a0a] scrollbar-thumb-slate-700">
                {formatoCodigo === "json" ? (
                  <pre className="text-green-400 font-mono text-sm leading-relaxed">
                    {JSON.stringify(pokemon, null, 2)}
                  </pre>
                ) : (
                  <pre className="text-blue-400 font-mono text-sm leading-relaxed">
                    {gerarSoapXML(pokemon)}
                  </pre>
                )}
              </div>
            </div>

            <div className="w-full max-w-4xl bg-slate-800/90 rounded-b-2xl border border-slate-700 p-6 shadow-2xl mb-12">
              <h3 className="text-slate-300 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                📊 Gráfico Comparativo de tipagem de arquivos
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400 font-bold">
                      Volume de Dados (Payload Bytes):
                    </span>
                    <span className="text-slate-300">
                      REST:{" "}
                      <strong className="text-green-400">{jsonBytes} B</strong>{" "}
                      vs SOAP:{" "}
                      <strong className="text-blue-400">{soapBytes} B</strong>
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-slate-950 h-9 rounded-lg overflow-hidden p-1 border border-slate-700/60 shadow-inner">
                      <div
                        className="bg-emerald-500 h-full rounded transition-all duration-700 flex items-center px-3 text-xs font-black text-slate-950 truncate"
                        style={{
                          width: `${Math.max((jsonBytes / maxBytes) * 100, 15)}%`,
                        }}
                      >
                        REST (JSON): {jsonBytes} B
                      </div>
                    </div>
                    <div className="w-full bg-slate-950 h-9 rounded-lg overflow-hidden p-1 border border-slate-700/60 shadow-inner">
                      <div
                        className="bg-indigo-600 h-full rounded transition-all duration-700 flex items-center px-3 text-xs font-black text-white truncate"
                        style={{
                          width: `${Math.max((soapBytes / maxBytes) * 100, 15)}%`,
                        }}
                      >
                        XML: {soapBytes} B
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400 font-bold">
                      Custo de CPU (Execução Única):
                    </span>
                    <span className="text-slate-300">
                      REST:{" "}
                      <strong className="text-green-400">
                        {benchmark.json} ms
                      </strong>{" "}
                      vs SOAP:{" "}
                      <strong className="text-blue-400">
                        {benchmark.soap} ms
                      </strong>
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-slate-950 h-9 rounded-lg overflow-hidden p-1 border border-slate-700/60 shadow-inner">
                      <div
                        className="bg-emerald-500 h-full rounded transition-all duration-700 flex items-center px-3 text-xs font-black text-slate-950 truncate"
                        style={{
                          width: `${Math.max((parseFloat(benchmark.json) / maxTime) * 100, 15)}%`,
                        }}
                      >
                        REST (JSON): {benchmark.json}ms
                      </div>
                    </div>
                    <div className="w-full bg-slate-950 h-9 rounded-lg overflow-hidden p-1 border border-slate-700/60 shadow-inner">
                      <div
                        className="bg-indigo-600 h-full rounded transition-all duration-700 flex items-center px-3 text-xs font-black text-white truncate"
                        style={{
                          width: `${Math.max((parseFloat(benchmark.soap) / maxTime) * 100, 15)}%`,
                        }}
                      >
                        XML: {benchmark.soap}ms
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
