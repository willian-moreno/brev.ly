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

### Variáveis ambiente do Back-end

Todo projeto tem diversas configurações de variáveis que devem ser diferentes de acordo com o ambiente que ele é executado. Para isso, importante sabermos, de forma fácil e intuitiva, quais variáveis são essas. Então é obrigatório que esse projeto tenha um arquivo `.env.example` com as chaves necessárias:

```env
PORT=
DATABASE_URL=

CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_ACCESS_KEY_ID=""
CLOUDFLARE_SECRET_ACCESS_KEY=""
CLOUDFLARE_BUCKET=""
CLOUDFLARE_PUBLIC_URL=""
```

### Scripts

Crie um script com a exata chave `db:migrate` responsável por executar as migrations do banco de dados.

### Docker

Para esse projeto back-end você deve construir um `Dockerfile`, seguindo as boas práticas, que deve ser responsável por gerar a imagem da aplicação.

### Boas Práticas do Back-end

Habilitar o CORS na aplicação.

### Requisitos Não Funcionais do Back-end

É obrigatório o uso de:

- TypeScript
- Fastify
- Drizzle
- Postgres

---

## Descrição e requisitos funcionais do Front-end

Nesse projeto front-end será desenvolvido uma aplicação React que, em conjunto com a API, permite o gerenciamento de URL’s encurtadas.

### Funcionalidades e Regras

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

- É obrigatória a criação de uma aplicação React no formato SPA utilizando o Vite como `bundler`;
- Siga o mais fielmente possível o layout do Figma;
- Trabalhe com elementos que tragam uma boa experiência ao usuário (`empty state`, ícones de carregamento, bloqueio de ações a depender do estado da aplicação);
- Foco na responsividade: essa aplicação deve ter um bom uso tanto em desktops quanto em celulares.

### Páginas

Essa aplicação possui 3 páginas:

- A página raiz (`/`) que exibe o formulário de cadastro e a listagem dos links cadastrados;
- A página de redirecionamento (`/:url-encurtada`) que busca o valor dinâmico da URL e faz a pesquisa na API por aquela URL encurtada;
- A página de recurso não encontrado (qualquer página que não seguir o padrão acima) que é exibida caso o usuário digite o endereço errado ou a URL encurtada informada não exista.

### Variáveis ambiente do Front-end

Todo projeto tem diversas configurações de variáveis que devem ser diferentes de acordo com o ambiente que ele é executado. Para isso, importante sabermos, de forma fácil e intuitiva, quais variáveis são essas. Então é obrigatório que esse projeto tenha um arquivo `.env.example` com as chaves necessárias:

```env
VITE_FRONTEND_URL=
VITE_BACKEND_URL=
```

### Boas Práticas do Front-end

- Comece o projeto pela aba `Style Guide` no Figma. Dessa forma, você prepara todo o seu tema, fontes e componentes e quando for criar as páginas vai ser bem mais tranquilo;
- Trabalhe com o desenvolvimento `mobile first`, principalmente se estiver utilizando ferramentas que se favorecem disso como Tailwind;
- Assim como a experiência do usuário é importante (UX), a sua experiência no desenvolvimento (DX) também é muito importante. Por isso, apesar de ser possível criar essa aplicação sem nenhuma biblioteca, recomendamos utilizar algumas bibliotecas que vão facilitar tanto o desenvolvimento inicial quanto a manutenção do código.

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
