from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI(title="Pokedex API")

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # O "*" permite que qualquer porta (como a do React) acesse a API
    allow_credentials=True, # permite que cookies sejam enviados ao servidor pelo react
    allow_methods=["*"], # Permite os métodos HTTP (GET, POST, etc)
    allow_headers=["*"], # Permite o envio de cabeçalhos
)

# Endpoint

@app.get("/api/pokemon/{nome}")
def buscar_pokemon(nome: str):
    url = f"https://pokeapi.co/api/v2/pokemon/{nome.lower()}"
    resposta = requests.get(url)
    
    # Se o Pokémon não existir (erro 404), avisamos o frontend
    if resposta.status_code == 404:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Pokémon não encontrado")
        
    dados = resposta.json()
    
    # 1. Pegando TODOS os status (HP, Ataque, Defesa, Velocidade, etc)
    status_completos = {}
    for stat in dados['stats']:
        nome_stat = stat['stat']['name']
        valor_stat = stat['base_stat']
        status_completos[nome_stat] = valor_stat
        
    # 2. Pegando os Tipos (ex: ['normal'] ou ['fire', 'flying'])
    tipos = []
    for t in dados['types']:
        tipos.append(t['type']['name'])
        
    # 3. Pegando as Habilidades
    habilidades = []
    for hab in dados['abilities']:
        habilidades.append(hab['ability']['name'])
        
    # 4. Pegando TODOS os jogos em que ele aparece
    jogos = []
    for game in dados['game_indices']:
        jogos.append(game['version']['name'])
        
    # 5. Pegando a imagem animada (se não achar, pega a oficial estática)
    imagem = dados['sprites']['other']['showdown']['front_default']
    if not imagem:
        imagem = dados['sprites']['other']['official-artwork']['front_default']
        
    # 6. Montando o super pacote de dados limpo para o React
    return {
        "id_pokedex": dados['id'],
        "nome": dados['name'].capitalize(),
        "altura_cm": dados['height'] * 10, # A PokeAPI manda em decímetros, convertemos para cm
        "peso_kg": dados['weight'] / 10,   # A PokeAPI manda em hectogramas, convertemos para kg
        "imagem": imagem,
        "tipos": tipos,
        "habilidades": habilidades,
        "status": status_completos,
        "jogos_que_aparece": jogos
    }