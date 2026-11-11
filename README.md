# <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" width="35" align="center"> Trabalho Prático: Web Services (REST e SOAP)

Este repositório contém a entrega da atividade prática da disciplina de **Sistemas Distribuídos / Web Services**.

O objetivo do projeto é explorar a diversidade tecnológica de ecossistemas web através da pesquisa e do consumo prático de Web Services reais disponíveis publicamente, separando as implementações em duas aplicações independentes.

---

## 📁 Estrutura do Repositório

Para facilitar a avaliação e isolar os ecossistemas, o projeto foi dividido em dois diretórios principais:

- **[`/rest`](./rest/)**: Aplicação Full-Stack (Python/FastAPI + React) consumindo a PokeAPI.
- **[`/soap`](./soap/)**: Aplicação consumindo um Web Service baseado em WSDL _(a ser definido pela equipe)_.

Cada diretório possui seu próprio `README.md` com instruções detalhadas de instalação, execução e exemplos dos dados trafegados.

---

## 🌐 1. Aplicação REST (Pokédex)

A aplicação localizada na pasta `/rest` funciona como uma Pokédex que consome a [PokeAPI (The RESTful Pokémon API)](https://pokeapi.co/docs/v2).

- **Arquitetura:** Frontend em React (Vite) e Backend em Python (FastAPI).
- **Formato de Dados:** JSON.
- **Exemplo de Retorno:** Ao buscar os dados, a API recebe a estrutura abaixo:

<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png" width="45" align="center"> **Exemplo (Rayquaza):**

```json
{
  "name": "rayquaza",
  "stats": [
    {
      "base_stat": 150,
      "stat": { "name": "attack" }
    }
  ]
}
```

> **Instruções de execução:** Para rodar a aplicação REST, acesse a pasta [`/rest`](./rest/) e siga o passo a passo no README interno.

---

## 📦 2. Aplicação SOAP

A aplicação localizada na pasta `/soap` demonstra o consumo de um serviço legado baseado em contratos estritos (WSDL).

- **Web Service Escolhido:** _(A colega preencherá o link e o nome aqui)_
- **Formato de Dados:** XML (SOAP Envelope).
- **Exemplo de Retorno:** _(A colega colocará o exemplo do XML recebido aqui)_

> **Instruções de execução:** Para rodar a aplicação SOAP, acesse a pasta [`/soap`](./soap/) e siga o passo a passo no README interno.
