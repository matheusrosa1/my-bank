<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# My Bank API

API para gerenciamento de contas bancárias, transações e autenticação de usuários.

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Como Usar](#como-usar)
- [Autenticação de Usuário](#autenticação-de-usuário)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Contato](#contato)

## Visão Geral

A API My Bank permite a criação, gerenciamento de contas bancárias e transações, além da autenticação de usuários.

## Tecnologias Utilizadas

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Docker
- AWS S3 (para armazenamento de imagens)
- Jest (para testes)

## Instalação

Para instalar e executar o projeto localmente, siga os passos abaixo:

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/my-bank.git
   cd my-bank
   
2. Instale as dependências:
   ```bash
    npm install

3. Configurar banco de dados
   
Para subir um banco de dados PostgreSQL via Docker, execute o seguinte comando:

    docker run --name meu-postgres -e POSTGRES_PASSWORD=minhaSenha -p 5432:5432 -d postgres


### Pontos importantes para funcionamento do projeto
adicionar um arquivo .env.development.local com o seguinte corpo:

    DB_DATABASE=postgres
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=meu-postgres
    DB_PASSWORD=postgres

Para que o upload das imagens funcione é necessário incluir o arquivo .env.aws na raiz do projeto. Para ter acesso a esse recurso contate-me.

4. Rodando o servidor

```bash
# Iniciar servidor
$ npm run start:dev

```

## Autenticação do Usuário

Para autenticar um usuário, primeiro é necesśario cadastrar um user utilizando o endpoint POST `/users`. Com os seguintes campos:
```bash
{
  "username": "john123",
  "email": "john@example.com",
  "password": "password123",
  "cpf": "123.456.789-00"
}
```


E após o cadastro autenticar o usuário no endpoint POST `auth` (utilizando o `email` e o `password` cadastrado) e o mesmo irá retonar um token que deverá ser utilizado nas demais requisições, no seguinte formado:

Bearer `token`

## Testando a aplicação

Para elaboração de testes do projeto foram realizados teste unitários utilizando o Jest.

```bash
# Rodando os testes
$ npm run test
```


## License

Este projeto está licenciado sob a [MIT licensed](LICENSE).
