# The Oscars Gallery - Backend

## Descrição
* Este projeto é uma API para gerenciar e atualizar informações sobre filmes vencedores do Oscar, incluindo dados de IMDb. É construída com Node.js, Express, TypeScript e MongoDB, e busca dados adicionais no OMDb. A API permite salvar, atualizar e deletar filmes vencedores do Oscar de um determinado ano, além de buscar dados detalhados de filmes diretamente do IMDb.

## Estrutura do Projeto
* A estrutura básica do projeto é a seguinte:

The-Oscars-Gallery
├── src
│   ├── api
│   │   └── movies
│   │       ├── movies.api.ts
│   ├── models
│   │   └── movie.model.ts
│   ├── routes
│   │   └── movies.routes.ts
│   ├── services
│   │   └── imdbServices.ts
│   ├── app.ts
│   ├── config
│   │   └── db.config.ts
└── README.md

## Principais Arquivos
* movies.api.ts: Contém as funções principais para processar, atualizar e deletar filmes vencedores de acordo com o ano.
* movie.model.ts: Modelo do MongoDB para armazenar informações de cada filme.
* imdbServices.ts: Serviço para buscar dados do IMDb usando a API do OMDb.
* movies.routes.ts: Define as rotas para interagir com a API do projeto.

# Pré-requisitos
* -> Node.js e npm
* -> MongoDB para o banco de dados
* -> Conta na OMDb API para obter uma chave de API
* -> Conta no GitHub para versionamento do código

# Instalação
* Clone o repositório:

bash
Copiar código
git clone https://github.com/username/The-Oscars-Gallery.git
cd The-Oscars-Gallery
Instale as dependências:

bash
Copiar código
npm install
Crie um arquivo .env na raiz do projeto e configure as seguintes variáveis:

plaintext
Copiar código
OMDB_API_KEY=your_omdb_api_key
OMDB_API_I=your_user_identifier
MONGO_URI=mongodb://localhost:27017/oscar_gallery
Execute o projeto em ambiente de desenvolvimento:

bash
Copiar código
npm run dev


# Rotas Disponíveis
* Filmes do Oscar por Ano -> Salvar filmes vencedores de um ano
    * POST /movies/oscar-winners/save/year/:year
    * Descrição: Salva informações de filmes vencedores de um determinado ano no banco de dados.
    * Exemplo de uso:
        plaintext
        Copiar código
        POST /movies/oscar-winners/save/year/2020

* Atualizar filmes vencedores de um ano
    * PUT /movies/oscar-winners/update/year/:year
    * Descrição: Atualiza informações de filmes vencedores de um determinado ano.
    * Exemplo de uso:
        plaintext
        Copiar código
        PUT /movies/oscar-winners/update/year/2020

* Deletar filmes vencedores de um ano
    * DELETE /movies/oscar-winners/delete/year/:year
    * Descrição: Remove todos os filmes vencedores de um determinado ano do banco de dados.
    * Exemplo de uso:
        plaintext
        Copiar código
        DELETE /movies/oscar-winners/delete/year/2020

* Atualizações do IMDb
    * Atualizar dados do IMDb para filmes de um ano
    * PUT /movies/oscar-winners/update-imdb/year/:year
    * Descrição: Atualiza informações adicionais dos filmes vencedores do Oscar com dados do IMDb.
    * Exemplo de uso:
        plaintext
        Copiar código
        PUT /movies/oscar-winners/update-imdb/year/2020

* Buscar detalhes de um filme pelo IMDb ID
    * GET /movies/imdb/:imdbID
    * Descrição: Retorna detalhes de um filme específico com base no IMDb ID.
    * Exemplo de uso:
        plaintext
        Copiar código
        GET /movies/imdb/tt1234567

* Buscar filmes no nosso banco - Offset Limit e filter [Rota para o frontend]
    * GET /tog?offset=0&limit=10
    * Descrição: Retorna detalhes de um filme específico com base no IMDb ID.
    * Exemplo de uso:
        plaintext
        Copiar código
        GET /movies/imdb/tt1234567


# Como Contribuir
    * Faça um fork do repositório.
    * Crie uma branch para suas alterações: git checkout -b minha-feature.
    * Comite suas alterações: git commit -m 'Minha nova feature'.
    * Faça o push para a branch: git push origin minha-feature.
    * Abra um pull request.

# Notas
    * Certifique-se de que o MongoDB está em execução antes de iniciar o projeto -> npm run dev   
    * Use o Postman ou uma ferramenta similar para testar as rotas de API. -> http://localhost:5000/api/....