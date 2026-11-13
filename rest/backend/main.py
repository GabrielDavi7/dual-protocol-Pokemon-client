from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from functools import lru_cache
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@lru_cache(maxsize=100)
def processar_dados_pokemon(nome: str):
    url = f"https://pokeapi.co/api/v2/pokemon/{nome.lower()}"
    resposta = requests.get(url)
    
    if resposta.status_code == 404:
        return None
        
    dados = resposta.json()
    
    url_species = dados['species']['url']
    resposta_species = requests.get(url_species)
    
    formas_disponiveis = []
    cadeia_evolucao = []
    
    if resposta_species.status_code == 200:
        dados_species = resposta_species.json()
        
        for variedade in dados_species['varieties']:
            formas_disponiveis.append(variedade['pokemon']['name'])
            
        url_evolucao = dados_species.get('evolution_chain', {}).get('url')
        if url_evolucao:
            resp_evo = requests.get(url_evolucao)
            if resp_evo.status_code == 200:
                dados_evo = resp_evo.json()
                
                def extrair_evolucoes(cadeia):
                    evos = []
                    nome_evo = cadeia['species']['name']
                    id_evo = cadeia['species']['url'].rstrip('/').split('/')[-1]
                    evos.append({"nome": nome_evo, "id": id_evo})
                    
                    for proxima in cadeia['evolves_to']:
                        evos.extend(extrair_evolucoes(proxima))
                    return evos
                    
                cadeia_evolucao = extrair_evolucoes(dados_evo['chain'])
    else:
        formas_disponiveis = [dados['name']]
        
    status_completos = {}
    for stat in dados['stats']:
        status_completos[stat['stat']['name']] = stat['base_stat']
        
    tipos = [t['type']['name'] for t in dados['types']]
    habilidades = [hab['ability']['name'] for hab in dados['abilities']]
    jogos = [game['version']['name'] for game in dados['game_indices']]
    
    movimentos = [m['move']['name'] for m in dados.get('moves', [])]
    
    locais = []
    url_locais = dados.get('location_area_encounters')
    if url_locais:
        resp_locais = requests.get(url_locais)
        if resp_locais.status_code == 200:
            for loc in resp_locais.json():
                nome_local = loc['location_area']['name']
                jogo_referencia = loc['version_details'][0]['version']['name'] if loc['version_details'] else 'default'
                
                locais.append({
                    "nome": nome_local,
                    "jogo": jogo_referencia
                })
                
    imagem = dados['sprites']['other']['showdown']['front_default']
    if not imagem:
        imagem = dados['sprites']['other']['official-artwork']['front_default']
    if not imagem:
        imagem = dados['sprites']['front_default']
        
    link_audio = dados.get('cries', {}).get('latest')
        
    return {
        "id_pokedex": dados['id'],
        "nome": dados['name'].capitalize(),
        "altura_cm": dados['height'] * 10,
        "peso_kg": dados['weight'] / 10,
        "imagem": imagem,
        "tipos": tipos,
        "habilidades": habilidades,
        "status": status_completos,
        "jogos_que_aparece": jogos,
        "formas_alternativas": formas_disponiveis,
        "movimentos": movimentos,
        "localizacoes": locais,
        "audio": link_audio,
        "cadeia_evolucao": cadeia_evolucao
    }

@app.get("/api/pokemon/{nome}")
def buscar_pokemon(nome: str):
    dados = processar_dados_pokemon(nome)
    if not dados:
        raise HTTPException(status_code=404, detail="Pokémon não encontrado")
    return dados