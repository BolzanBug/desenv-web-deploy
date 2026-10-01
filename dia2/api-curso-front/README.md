# api-curso-front

Front-end da API de tarefas, em Next.js (JavaScript).

* Login e cadastro
* Lista de tarefas: criar, concluir (mostra a hora em que foi feita), editar o título clicando nele, apagar
* Filtros: todas, pendentes e feitas

O front chama a API sempre em `/api/...`, no mesmo domínio. Assim não precisa de CORS e
o CloudFront serve front e API com uma única distribuição:

```
navegador ──▶ nginx ─┬─ /api/*  ──▶ api:3000   (o Nginx remove o /api)
                     └─ /*      ──▶ front:3000
```

## Rodar em desenvolvimento

Com a API rodando em `http://localhost:3000` (pelo Docker do `api-curso-db` ou `npm run dev` na API):

```bash
npm install
cp .env.example .env.local   # se a API estiver em outra porta, ajuste API_URL
npm run dev -- -p 3001
```

Abra `http://localhost:3001`. Em desenvolvimento, o próprio Next encaminha `/api/*` para a `API_URL`
(veja `next.config.mjs`).

## Produção (Docker)

O front roda junto com a API, o banco e o Nginx pelo `docker-compose.yml` do repositório
**api-curso-db**. As três pastas ficam lado a lado no servidor:

```
curso/
├── api-curso/
├── api-curso-db/
└── api-curso-front/
```

Passo a passo completo no `DEPLOY-AWS.md` do api-curso-db.

## Estrutura

```
src/
├── app/
│   ├── layout.js            fontes e metadados
│   ├── globals.css          cores, papel quadriculado, margem do caderno
│   ├── page.js              lista de tarefas (rota /)
│   ├── login/page.js
│   └── cadastro/page.js
├── components/
│   ├── AuthForm.js          formulário de login/cadastro
│   └── TaskItem.js          uma linha da lista
└── lib/
    ├── api.js               chamadas à API (token, sessão expirada)
    └── auth.js              token e usuário no localStorage
```
