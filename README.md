# <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" width="35" align="center"> Pokedex Web Services IntegratorPokedex Web Services Integrator

Aplicação desenvolvida como atividade prática da disciplina de **Sistemas Distribuídos / Web Services**. O projeto demonstra a integração de dois ecossistemas tecnológicos em uma única aplicação:

- uma API **REST**, com respostas em JSON;
- um Web Service **SOAP**, com mensagens em XML.

## Objetivo

O projeto funciona como uma Pokédex de batalha. A aplicação recebe o nome de um Pokémon, consulta seus atributos na PokeAPI e envia os valores de Ataque e Defesa para um serviço SOAP, que calcula a soma desses atributos.

## Fluxo da aplicação

1. O nome do Pokémon é recebido pela aplicação.
2. O backend consulta a [PokeAPI](https://pokeapi.co/docs/v2) usando REST.
3. Os valores de Ataque e Defesa são extraídos da resposta JSON.
4. Os valores são enviados para a operação `Add` do serviço SOAP.
5. O resultado da soma é retornado como o Poder de Combate (CP) do Pokémon.

## Tecnologias e serviços

- **Backend:** Python
- **API REST:** [PokeAPI](https://pokeapi.co/docs/v2)
- **Web Service SOAP:** [DNE Online Calculator](http://www.dneonline.com/calculator.asmx?WSDL)
- **Bibliotecas Python:** `requests` e `zeep`
- **Frontend:** React/Vite (planejado)

## Estrutura do projeto

```text
dual-protocol-Pokemon-client/
├── .gitignore
├── README.md
├── backend/
│   ├── app.py
│   └── requirements.txt
└── frontend/
    └── (interface gráfica planejada)
```

## Exemplos de dados

### Resposta REST

Exemplo de dados relevantes retornados pela PokeAPI para o Pokémon <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png" width="45" align="center">

```json
{
  "name": "rayquaza",
  "stats": [
    {
      "base_stat": 150,
      "stat": {
        "name": "attack",
        "url": "https://pokeapi.co/api/v2/stat/2/"
      }
    },
    {
      "base_stat": 90,
      "stat": {
        "name": "defense",
        "url": "https://pokeapi.co/api/v2/stat/3/"
      }
    }
  ]
}
```

### Resposta SOAP

Ao enviar Ataque `150` e Defesa `90` para a operação `Add`, o serviço SOAP retorna o resultado `240`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <AddResponse xmlns="http://tempuri.org/">
      <AddResult>240</AddResult>
    </AddResponse>
  </soap:Body>
</soap:Envelope>
```

## Instalação e execução

### Backend

Na raiz do projeto, crie e ative um ambiente virtual:

#### Windows

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

#### Linux/macOS

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend

Quando a interface React/Vite estiver disponível:

```bash
cd frontend
npm install
npm run dev
```

## Dependências

As dependências do backend estão listadas em [`backend/requirements.txt`](backend/requirements.txt):

- `requests`: consumo da API REST;
- `zeep`: consumo do Web Service SOAP.
