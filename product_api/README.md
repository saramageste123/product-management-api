# Product Management API

API REST desenvolvida em Java com Spring Boot para gestão de produtos, aplicando boas práticas de arquitetura, validação de dados, tratamento global de exceções e organização em camadas.

O projeto simula um backend real de aplicação corporativa, como os utilizados em sistemas de e-commerce, controle de estoque ou catálogos de produtos, e foi desenvolvido com foco em qualidade de código, manutenibilidade e escalabilidade.

## 🔍 Visão Geral

A aplicação disponibiliza endpoints REST para operações completas de CRUD de produtos, incluindo:

* Criação
* Consulta
* Atualização
* Exclusão
* Paginação
* Ordenação
* Busca por nome
* Suporte a imagem de produto via URL

A API foi construída de forma desacoplada, permitindo fácil integração com aplicações frontend.
Além disso, o projeto já possui estrutura preparada para autenticação e segurança, permitindo evolução futura sem refatorações estruturais.

## 🚀 Funcionalidades

* CRUD completo de produtos
* Paginação e ordenação dinâmicas
* Validação de dados com Bean Validation
* Busca de produtos por nome
* Tratamento global de exceções
* Respostas padronizadas de erro
* Separação clara de responsabilidades por camada

## 🧱 Arquitetura do Projeto

O projeto segue arquitetura em camadas, garantindo separação de responsabilidades e fácil manutenção:

``` 
src/main/java/com/saraprojects/product_api
│
├── config        → Configurações (Spring Security)
├── controller    → REST Controllers
├── dto           → Data Transfer Objects
├── exception     → Tratamento global de exceções
├── model         → Entidades JPA
├── repository    → Repositórios (Spring Data JPA)
├── service       → Regras de negócio
└── ProductApiApplication.java
``` 
Essa organização garante:

* Baixo acoplamento
* Alta coesão
* Facilidade de manutenção
* Facilidade de testes e evolução

## 🛠️ Tecnologias Utilizadas

* Java 21
* Spring Boot
* Spring Web
* Spring Data JPA
* Spring Validation
* Spring Security (configuração inicial)
* Hibernate
* Lombok
* MySQL
* Maven

## 📌 Endpoints
```
POST   /api/products        → Criar produto
GET    /api/products        → Listar todos os produtos
GET    /api/products/paged  → Listar produtos com paginação
GET    /api/products/search → Buscar produtos por nome
GET    /api/products/{id}   → Buscar produto por ID
PUT    /api/products/{id}   → Atualizar produto
DELETE /api/products/{id}   → Excluir produto
```

## ✅ Validação de Dados

A API utiliza Bean Validation para garantir a integridade dos dados recebidos:

* Nome obrigatório
* Preço obrigatório e maior que zero
* Quantidade obrigatória e maior ou igual a zero
* Validação de formato de URL para imagem do produto

Requisições inválidas retornam mensagens claras e estruturadas, facilitando o consumo da API por aplicações frontend.

## ⚠️ Tratamento de Exceções

O projeto utiliza um tratamento global de exceções (GlobalExceptionHandler), garantindo:

* Padronização das respostas de erro
* Mensagens claras para erros de validação
* Uso correto de códigos HTTP

## 🔐 Segurança

A aplicação utiliza Spring Security com configuração inicial ativa.

No estado atual:
* Todos os endpoints estão liberados (`permitAll`)
* CSRF desativado (API stateless)
* Estrutura preparada para autenticação futura

A arquitetura permite evolução para autenticação baseada em JWT sem necessidade de refatorações estruturais.

## 🔒 Configurações Sensíveis

Nenhuma credencial sensível é versionada no repositório.
As configurações são realizadas via variáveis de ambiente:
```
DB_URL
DB_USER
DB_PASSWORD
JWT_SECRET
JWT_EXPIRATION
JWT_REFRESH_EXPIRATION
```

Arquivos sensíveis são ignorados por meio do .gitignore.

## ▶️ Como Executar o Projeto

1. Clone o repositório
2. Configure as variáveis de ambiente
3. Crie um banco MySQL
4. Execute a aplicação:
```
mvn spring-boot:run
```
A API estará disponível em:
```
http://localhost:8080
```

## 📈 Próximos Passos (Evolução)

🔐 Implementar autenticação e autorização com Spring Security e JWT

🧪 Criar testes unitários e de integração

📄 Documentar API com Swagger/OpenAPI

🎨 Desenvolver frontend em Angular para consumo da API (Em desenvolvimento)


# 👩‍💻 Autora

**Sara Mageste**

Desenvolvedora de Software

Java • Spring Boot • APIs REST • Lombok

Projeto desenvolvido para estudo e portfólio profissional.

