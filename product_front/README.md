# Product Management Frontend

Aplicação frontend desenvolvida em **Angular** para consumo da **Product Management API**.

Este projeto simula a interface de um sistema real de gestão de produtos, como os utilizados em painéis administrativos de e-commerce, controle de estoque ou catálogos internos.

O foco do frontend está em:
* Organização de código
* Boas práticas do Angular moderno
* Comunicação eficiente com API REST
* Experiência do usuário (UX)
* Escalabilidade e manutenção


## 🔍 Visão Geral

A aplicação permite gerenciar produtos através de uma interface web, consumindo dados do backend via HTTP.

Funcionalidades disponíveis atualmente:
* Listagem de produtos
* Busca por nome
* Paginação
* Ordenação
* Consumo de imagens via URL
* Estados de loading e erro
* Arquitetura modular e organizada por features

O frontend foi desenvolvido de forma desacoplada do backend, permitindo fácil evolução e manutenção.


## 🚀 Funcionalidades

* Listagem de produtos
* Busca de produtos por nome
* Paginação dinâmica
* Ordenação
* Consumo de API REST
* Tratamento de estados de loading
* Tratamento de erros de requisição
* Estrutura preparada para autenticação futura


## 🧱 Arquitetura do Projeto

O projeto segue uma organização baseada em **features**, prática recomendada para aplicações Angular escaláveis:

```
src/app
│
├── core
│ ├── services → Serviços globais (API, interceptors futuramente)
│ └── models → Interfaces e modelos
│
├── features
│ └── products
│ ├── components → Componentes de produtos
│ ├── pages → Páginas (listagem, formulários)
│ ├── service → Comunicação com API de produtos
│ └── models → Modelos específicos
│
├── shared
│ ├── components → Componentes reutilizáveis
│ └── styles → Estilos compartilhados
│
└── app.component.ts

```


Essa abordagem garante:
* Separação clara de responsabilidades
* Facilidade de evolução
* Código mais legível e testável


## 🔗 Integração com o Backend

Este frontend consome a **Product Management API**, desenvolvida em Java com Spring Boot.

Endpoints utilizados incluem:
* Listagem de produtos
* Busca por nome
* Paginação e ordenação

Backend:
```
http://localhost:8080/api/products
```

## 🛠️ Tecnologias Utilizadas

- Angular 21
- TypeScript
- RxJS
- Angular HttpClient
- Angular Router
- HTML5
- CSS3
- Node.js
- Angular CLI


## ▶️ Como Executar o Projeto

### Pré-requisitos
* Node.js (versão compatível com Angular 21)
* Angular CLI

### Passos

1. Clone o repositório
2. Acesse a pasta do frontend:
```bash
cd product_front
```
3. Instale as dependências:
```
npm install
```

4. Execute o projeto:
```
ng serve
```

A aplicação estará disponível em:
```
http://localhost:4200
```
⚠️ Certifique-se de que o backend esteja em execução para o correto funcionamento da aplicação.

## 📈 Próximos Passos (Evolução)

🔐 Implementar autenticação e autorização no frontend

📝 Criar formulários de criação e edição de produtos

🧪 Implementar testes unitários

🎨 Melhorar UX/UI e responsividade

📦 Implementar interceptors para tratamento global de erros e tokens

## 👩‍💻 Autora

**Sara Mageste**

Desenvolvedora de Software

Java • Spring Boot • Angular • APIs REST

Projeto desenvolvido para estudo e portfólio profissional.