import { useState } from "react";
import axios from "axios";

// Nosso dicionário de cores para cada tipo de Pokémon!
const coresTipos = {
  normal: "bg-slate-700/80 text-slate-300 border-slate-600/50",
  fire: "bg-red-500/20 text-red-400 border-red-500/30",
  water: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  grass: "bg-green-500/20 text-green-400 border-green-500/30",
  electric: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ice: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  fighting: "bg-orange-700/20 text-orange-500 border-orange-700/30",
  poison: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  ground: "bg-amber-600/20 text-amber-500 border-amber-600/30",
  flying: "bg-indigo-400/20 text-indigo-400 border-indigo-400/30",
  psychic: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  bug: "bg-lime-500/20 text-lime-400 border-lime-500/30",
  rock: "bg-yellow-700/20 text-yellow-600 border-yellow-700/30",
  ghost: "bg-indigo-700/20 text-indigo-400 border-indigo-700/30",
  dragon: "bg-violet-600/20 text-violet-400 border-violet-600/30",
  dark: "bg-stone-500/20 text-stone-400 border-stone-500/30",
  steel: "bg-slate-400/20 text-slate-300 border-slate-400/30",
  fairy: "bg-rose-400/20 text-rose-400 border-rose-400/30",
  default: "bg-slate-600/20 text-slate-400 border-slate-600/30",
};

function App() {
  const [busca, setBusca] = useState("snorlax");
  const [pokemon, setPokemon] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const buscarPokemon = async () => {
    if (!busca) return;

    try {
      setCarregando(true);
      setErro("");
      setPokemon(null);

      const resposta = await axios.get(
        `http://127.0.0.1:8000/api/pokemon/${busca}`,
      );
      setPokemon(resposta.data);
    } catch (error) {
      setErro("Pokémon não encontrado ou servidor Python desligado!");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-12 px-4 font-sans">
      {/* Cabeçalho */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-red-500 mb-2 tracking-wider">
          POKÉDEX <span className="text-white">REST</span>
        </h1>
        <p className="text-slate-400 font-medium mt-2">
          Integração React (Vite) + Python (FastAPI)
        </p>
      </div>

      {/* Barra de Busca */}
      <div className="flex w-full max-w-md gap-2 mb-8">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscarPokemon()}
          placeholder="Digite um Pokémon (ex: pikachu)"
          className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-white font-semibold border border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/50"
        />
        <button
          onClick={buscarPokemon}
          disabled={carregando}
          className="bg-red-600 hover:bg-red-500 disabled:bg-slate-700 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20"
        >
          {carregando ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {/* Mensagem de Erro */}
      {erro && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-xl font-medium w-full max-w-md text-center mb-8">
          {erro}
        </div>
      )}

      {/* O Card do Pokémon */}
      {pokemon && (
        <div className="bg-slate-800 p-6 pt-16 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700 relative mt-8">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <div className="bg-slate-700 p-4 rounded-full border-4 border-slate-800 shadow-xl h-32 w-32 flex items-center justify-center">
              <img
                src={pokemon.imagem}
                alt={pokemon.nome}
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-4xl font-black tracking-wide">
              {pokemon.nome}
            </h2>
            <p className="text-slate-400 font-bold text-lg mt-1">
              Nº {pokemon.id_pokedex}
            </p>
          </div>

          {/* Tipos Coloridos Dinamicamente! */}
          <div className="flex justify-center gap-3 mb-6">
            {pokemon.tipos.map((tipo) => {
              const classesCor = coresTipos[tipo] || coresTipos.default;
              return (
                <span
                  key={tipo}
                  className={`${classesCor} px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest border`}
                >
                  {tipo}
                </span>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900/50 p-4 rounded-2xl text-center border border-slate-700/50">
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">
                Altura
              </p>
              <p className="font-bold text-lg">{pokemon.altura_cm} cm</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-2xl text-center border border-slate-700/50">
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">
                Peso
              </p>
              <p className="font-bold text-lg">{pokemon.peso_kg} kg</p>
            </div>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50 mb-6 text-center">
            <p className="text-slate-500 text-xs font-bold uppercase mb-2">
              Habilidades
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              {pokemon.habilidades.map((hab) => (
                <span
                  key={hab}
                  className="text-slate-300 capitalize font-semibold"
                >
                  {hab.replace("-", " ")}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 tracking-widest text-center">
              Status de Batalha
            </h3>
            <div className="space-y-3">
              {Object.entries(pokemon.status).map(([nome, valor]) => (
                <div key={nome} className="flex items-center text-sm">
                  <span className="uppercase font-bold text-slate-300 w-32 text-[10px]">
                    {nome.replace("-", " ")}
                  </span>
                  <span className="font-black w-10 text-right mr-3">
                    {valor}
                  </span>
                  <div className="flex-1 bg-slate-900 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-red-500 h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${valor > 150 ? 100 : (valor / 150) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-widest text-center">
              Aparece nos jogos
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
              {pokemon.jogos_que_aparece.map((jogo) => (
                <span
                  key={jogo}
                  className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap capitalize border border-slate-600/30"
                >
                  {jogo.replace("-", " ")}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
