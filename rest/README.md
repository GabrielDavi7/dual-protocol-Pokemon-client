# ⚡ Pokedex BFF: Dual-Protocol Benchmark & Performance Analysis

Uma aplicação full-stack de portfólio acadêmico desenvolvida para demonstrar trade-offs de arquiteturas de sistemas distribuídos, comparando diretamente **REST (JSON)** versus **SOAP (XML)** em termos de payload de rede (Bytes) e custo de processamento de CPU (ms).

---

## 🚀 Funcionalidades Principais

* **Arquitetura BFF (Backend for Frontend):** FastAPI no backend atuando como uma camada de tradução otimizada sobre a PokeAPI original.
* **Cache Inteligente:** Implementação de `@lru_cache` (maxsize=100) no Python para zerar o overhead de requisições repetidas à API externa.
* **Galeria Segmentada por Gerações & Tipos:** Filtros combinados dinâmicos para navegar por todas as gerações clássicas, especiais e Megas.
* **Enriquecimento de Dados:** Gritos oficiais em áudio (`cries`), árvore evolutiva recursiva interativa e rotas/locais dinamicamente coloridos por jogo.
* **Benchmark Analítico em Tempo Real:** Painel comparativo interativo com gráficos de barras dinâmicos medindo o tamanho exato do payload em Bytes e o custo de CPU em milissegundos.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Python 3.10+, FastAPI, Uvicorn, Axios, Requests
* **Frontend:** React, Vite, Tailwind CSS, Axios

---

## ⚙️ Tutorial para Executar o Projeto (Do Zero)

Siga os passos abaixo para configurar e rodar o ambiente completo na sua máquina.

### 1. Clonar e Configurar o Backend (FastAPI)

Abra o seu terminal na pasta onde deseja salvar o projeto e siga os comandos para criar o ambiente virtual (`venv`):

```bash
# Crie a pasta do projeto e acesse-a
mkdir pokedex-bff && cd pokedex-bff

# Crie o ambiente virtual Python
python -m venv venv

# Ative o ambiente virtual
# No Windows (PowerShell):
.\venv\Scripts\Activate
# No Linux / macOS:
source venv/bin/activate

# Instancie as dependências necessárias
pip install fastapi uvicorn requests
```

### 2. Criar e Iniciar o Servidor FastAPI

Crie um arquivo chamado `main.py` na raiz do backend e adicione as rotas da sua API BFF. Em seguida, inicie o servidor:

```bash
uvicorn main:app --reload --port 8000
```
*O servidor backend estará rodando em `http://127.0.0.1:8000`.*

### 3. Configurar e Iniciar o Frontend (React + Vite)

Em uma **nova aba/janela do terminal**, navegue até o diretório do frontend (ou crie a estrutura Vite React):

```bash
# Crie o projeto frontend com Vite (caso ainda não tenha criado)
npm create vite@latest frontend -- --template react
cd frontend

# Instale as dependências (Axios e Tailwind CSS)
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Instancie as bibliotecas e cole o código do App.jsx gerado nos passos anteriores
npm run dev
```
*Acesse a aplicação no navegador através do endereço fornecido pelo Vite (geralmente `http://localhost:5173`).*

---

## 📊 Análise Comparativa: REST vs SOAP

| Critério | REST (JSON) | SOAP (XML) |
| :--- | :--- | :--- |
| **Formato de Dados** | Leve e estruturado por chaves/valores | Verboso, baseado em tags `<Envelope>`, `<Body>` e fechos |
| **Tamanho do Payload** | Compacto (~3.000 a 4.000 Bytes) | Elevado devido ao overhead de serialização (~7.000+ Bytes) |
| **Custo de CPU** | Baixo consumo de ciclos de clock | Alto consumo para parseamento e concatenação de tags |