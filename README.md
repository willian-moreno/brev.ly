# Brev.ly

O objetivo é criar uma aplicação que permita o cadastro, listagem e remoção de links encurtados, geração de relatório dos acessos de cada link e também o redirecionamento correto do link encurtado para o link original.

## Descrição e requisitos funcionais do Back-end

Nesse projeto back-end, será desenvolvido uma API para gerenciar o encurtamento de URL’s.

### Funcionalidades e Regras do Back-end

- Deve ser possível criar um link
  - Não deve ser possível criar um link com URL encurtada mal formatada
  - Não deve ser possível criar um link com URL encurtada já existente
- Deve ser possível deletar um link
- Deve ser possível obter a URL original por meio de uma URL encurtada
- Deve ser possível listar todas as URL’s cadastradas
- Deve ser possível incrementar a quantidade de acessos de um link
- Deve ser possível exportar os links criados em um CSV
  - Deve ser possível acessar o CSV por meio de uma CDN (Amazon S3, Cloudflare R2, etc)
  - Deve ser gerado um nome aleatório e único para o arquivo
  - Deve ser possível realizar a listagem de forma performática
  - O CSV deve ter campos como, URL original, URL encurtada, contagem de acessos e data de criação

### Requisitos Não Funcionais do Back-end

É obrigatório o uso de:

- TypeScript
- Fastify
- Drizzle
- Postgres

## Descrição e requisitos funcionais do Front-end

Nesse projeto front-end será desenvolvido uma aplicação React que, em conjunto com a API, permite o gerenciamento de URL’s encurtadas.

### Funcionalidades e Regras do Front-end

Assim como na API, temos as seguintes funcionalidades e regras:

- Deve ser possível criar um link
  - Não deve ser possível criar um link com encurtamento mal formatado
  - Não deve ser possível criar um link com encurtamento já existente
- Deve ser possível deletar um link
- Deve ser possível obter a URL original por meio do encurtamento
- Deve ser possível listar todas as URL’s cadastradas
- Deve ser possível incrementar a quantidade de acessos de um link
- Deve ser possível baixar um CSV com o relatório dos links criados

Além disso, também temos algumas regras importantes específicas para o front-end:

- É obrigatória a criação de uma aplicação React no formato SPA utilizando o Vite como bundler
- Siga o mais fielmente possível o layout do Figma
- Trabalhe com elementos que tragam uma boa experiência ao usuário (empty state, ícones de carregamento, bloqueio de ações a depender do estado da aplicação)
- Foco na responsividade: essa aplicação deve ter um bom uso tanto em desktops quanto em celulares

### Requisitos Não Funcionais do Front-end

É obrigatório o uso de:

- Typescript
- React
- Vite sem framework

É flexível o uso de:

- TailwindCSS
- React Query
- React Hook Form
- Zod

### Páginas

Essa aplicação possui 3 páginas:

- A página raiz (/) que exibe o formulário de cadastro e a listagem dos links cadastrados
- A página de redirecionamento (/:url-encurtada) que busca o valor dinâmico da URL e faz a pesquisa na API por aquela URL encurtada
- A página de recurso não encontrado (qualquer página que não seguir o padrão acima) que é exibida caso o usuário digite o endereço errado ou a url encurtada informada não exista
