<p align="center">
  <img src="public/images/Logo.jpg" alt="MackEmpreende" width="280" />
</p>

<h3 align="center">Sistema de Gestão Operacional</h3>

<p align="center">
  Plataforma interna da Liga de Empreendedorismo da Universidade Presbiteriana Mackenzie<br/>
  para gestão de agenda, palestrantes e arquivos — construída com foco em <strong>mobile-first</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
</p>

---

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Squads](#squads)
- [Arquitetura](#arquitetura)
- [Stack Tecnológica](#stack-tecnológica)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Rodando Localmente](#rodando-localmente)
- [Deploy](#deploy)
- [Banco de Dados](#banco-de-dados)
- [Autenticação](#autenticação)
- [Convenções de Código](#convenções-de-código)
- [Licença](#licença)

---

## Sobre o Projeto

O **MackEmpreende** é a liga acadêmica de empreendedorismo da Universidade Presbiteriana Mackenzie. A liga organiza aulas, workshops, palestras, episódios de podcast e eventos externos ao longo do semestre, envolvendo dezenas de palestrantes e convidados.

### Problema

Os squads enfrentavam dificuldade em:
- Organizar datas de eventos, aulas e episódios de podcast em um só lugar
- Cadastrar e acompanhar o status de contato com palestrantes e convidados
- Centralizar planilhas e documentos de apoio por squad

### Solução

Sistema web leve, **mobile-first**, com login por squad, que centraliza:
- 📅 **Agenda** — calendário interativo com timeline de eventos
- 👥 **Diretório de Palestrantes** — CRM de convidados com status inteligente
- 📁 **Arquivos** — repositório de documentos por squad

---

## Squads

| Squad | Responsabilidade |
|---|---|
| **PEW** | Projetos, Eventos, Workshops e Aulas |
| **Podcast** | Produção e organização do podcast da liga |
| **Comunica** | Mídias sociais e comunicação externa |
| **Culture** | Cultura interna da liga |

Cada squad possui uma conta de acesso própria no sistema. Todos os dados são compartilhados entre squads, mas cada um gerencia seus próprios eventos e palestrantes.

---

## Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                   Cliente (Browser)                  │
│             Next.js 16 App (Mobile-First)            │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │  /login  │  │ /agenda  │  │  /palestrantes      │ │
│  └──────────┘  └──────────┘  │  /arquivos          │ │
│                               └────────────────────┘ │
└────────────────────┬────────────────────────────────┘
                     │ Server Actions + Supabase Client
┌────────────────────▼────────────────────────────────┐
│                  Supabase (BaaS)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │    Auth     │  │  Postgres   │  │   Storage   │  │
│  │ (por squad) │  │  (dados)    │  │ (arquivos)  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Princípios

- **Mobile-first** — A maioria dos integrantes acessa via celular
- **Server Components por padrão** — Client Components (`'use client'`) apenas quando necessário
- **Server Actions** — Toda mutação de dados passa por server actions com validação Zod
- **Zero CRUD genérico** — Cada operação é semântica e específica ao domínio

---

## Stack Tecnológica

### Core

| Tecnologia | Versão | Papel |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16 | Framework fullstack (App Router) |
| [React](https://react.dev/) | 19 | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Estilização utility-first |

### Backend & Infraestrutura

| Tecnologia | Papel |
|---|---|
| [Supabase](https://supabase.com/) | Banco de dados (Postgres), Auth e Storage |
| [Vercel](https://vercel.com/) | Hospedagem e CI/CD |

### Bibliotecas-Chave

| Pacote | Uso |
|---|---|
| `@supabase/ssr` | Autenticação SSR no Next.js |
| `react-hook-form` | Gerenciamento de formulários |
| `zod` | Validação de schemas |
| `date-fns` | Manipulação de datas |
| `lucide-react` | Iconografia |
| `radix-ui` | Primitivos de acessibilidade |

---

## Funcionalidades

### 📅 Agenda

- **Calendário mensal** com indicadores visuais (dots) por dia
- **Timeline** com cards de eventos em ordem cronológica
- **Criação de eventos** com tipo, squad, palestrante vinculado, vagas e confirmação
- **Metadados expandidos**: palestrantes extras, backups, parceiros
- **Auto-sync**: palestrantes extras são registrados automaticamente no diretório ao criar um evento
- **Responsivo**: visualização otimizada para mobile (dots) e desktop (calendário completo)

### 👥 Diretório de Palestrantes

- **Listagem** com busca por nome/empresa e filtros por squad
- **Status inteligente computado**: o sistema calcula automaticamente o status visual:
  - 🟢 **Confirmado** — palestrante com evento futuro confirmado
  - 🟣 **Já Participou** — palestrante cujo evento já ocorreu (com contagem)
  - 🔵/🟡/⚪ Status manuais para pipeline de contato (Contatado, Aguardando, A Contatar)
- **Cadastro completo**: nome, empresa, cargo, tema, LinkedIn, Instagram, email, telefone
- **Indicadores de status por rede social** (LinkedIn e Instagram)
- **Histórico de eventos** vinculados ao perfil do palestrante

### 📁 Arquivos

- **Upload** com drag-and-drop via `react-dropzone`
- **Validação** de tipo (`.xlsx`, `.csv`, `.pdf`, `.docx`) e tamanho (max 10MB)
- **Organização** por squad com possibilidade de vincular a um evento
- **Download direto** via URL pública do Supabase Storage

### 🔐 Autenticação

- Login por squad (uma conta por squad)
- Middleware de proteção de rotas (proxy pattern)
- Identificação do squad pela sessão do usuário

### 🎨 Design

- **Paleta visual**: vermelho MackEmpreende (`#A32D2D`), brancos e cinzas
- **Navegação mobile**: floating tab bar (ilha flutuante) na parte inferior
- **Navegação desktop**: sidebar com logo e indicador lateral ativo
- **Tipografia**: Inter + Outfit (Google Fonts)

---

## Estrutura do Projeto

```
MackEmpreende/
├── Docs/                           # Documentação técnica
│   └── descricao.md                # Especificação completa do sistema
│
├── public/images/                  # Assets estáticos (logos, banners)
│
├── src/
│   ├── app/
│   │   ├── (auth)/login/           # Página de login (pública)
│   │   ├── (dashboard)/            # Grupo de rotas protegidas
│   │   │   ├── layout.tsx          # Layout com Navbar
│   │   │   ├── agenda/             # Módulo de agenda
│   │   │   ├── palestrantes/       # Módulo de palestrantes
│   │   │   └── arquivos/           # Módulo de arquivos
│   │   ├── actions/                # Server Actions
│   │   │   ├── eventos.ts          # CRUD eventos + auto-sync palestrantes
│   │   │   ├── palestrantes.ts     # CRUD palestrantes + importação bulk
│   │   │   └── arquivos.ts         # Upload e gestão de arquivos
│   │   ├── layout.tsx              # Layout raiz (fonts, providers)
│   │   └── globals.css             # Estilos globais + design tokens
│   │
│   ├── components/
│   │   ├── agenda/                 # CalendarView, EventoForm, EventoItem
│   │   ├── palestrantes/           # PalestranteCard, PalestranteForm
│   │   ├── arquivos/               # Upload e listagem de arquivos
│   │   └── layout/                 # Navbar, PageHeader
│   │
│   ├── lib/
│   │   ├── auth/get-squad.ts       # Mapeamento email → squad
│   │   ├── supabase/               # Clientes Supabase (client + server)
│   │   ├── utils/status.ts         # Lógica de status inteligente (pura)
│   │   └── validations/            # Schemas Zod (eventos, palestrantes, arquivos)
│   │
│   ├── types/database.ts           # Tipos TypeScript do Supabase
│   └── proxy.ts                    # Proxy de autenticação (middleware)
│
├── lib/scripts/
│   └── import_historico.sql        # Script de importação do histórico 2023-2025
│
├── .env.local                      # Variáveis de ambiente (NÃO commitar)
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Configuração do Ambiente

### Pré-requisitos

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** (incluído no Node.js)
- Conta no [Supabase](https://supabase.com/) (plano gratuito)
- Conta no [Vercel](https://vercel.com/) conectada ao GitHub (para deploy)

### Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
# Supabase — encontrar em: Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

> ⚠️ **Nunca commite `.env.local` no repositório.** O arquivo já está no `.gitignore`.

---

## Rodando Localmente

```powershell
# Clonar o repositório
git clone https://github.com/gfugulin/mackempreende.git
cd mackempreende

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa o ESLint |

---

## Deploy

### Vercel (Produção)

1. Faça push para a branch `main`
2. A Vercel detecta automaticamente e inicia o deploy
3. Cada PR gera um **Preview Deploy** para testes

### Configuração na Vercel

1. Importe o repositório GitHub em [vercel.com](https://vercel.com)
2. Em **Environment Variables**, adicione as mesmas variáveis do `.env.local`
3. Clique em **Deploy**

---

## Banco de Dados

O sistema utiliza **Supabase Postgres** com as seguintes entidades:

```
palestrantes ──1:N──► eventos ──1:N──► arquivos
```

### Tabelas Principais

| Tabela | Descrição |
|---|---|
| `palestrantes` | Convidados e palestrantes (nome, empresa, status, contato) |
| `eventos` | Agenda de atividades (título, data, tipo, squad, palestrante vinculado) |
| `arquivos` | Documentos e planilhas (metadados + link para Storage) |

### ENUMs

- **`squad_tipo`**: `PEW`, `Podcast`, `Comunica`, `Culture`
- **`status_palestrante`**: `a_contatar`, `contatado`, `aguardando_resposta`, `confirmado`, `recusado`, `cancelado`
- **`tipo_evento`**: `aula`, `workshop`, `palestra`, `podcast`, `evento_externo`, `reuniao_interna`

### RLS (Row Level Security)

Todas as tabelas possuem RLS habilitado. A política atual permite acesso total para usuários autenticados:

```sql
create policy "acesso_autenticado" on palestrantes
  for all using (auth.role() = 'authenticated');
```

> Consulte [`Docs/descricao.md`](Docs/descricao.md) para o SQL completo de criação do banco.

---

## Autenticação

O sistema utiliza **login por squad**, onde cada squad compartilha uma conta:

| Squad | Email |
|---|---|
| PEW | `pew@mackempreende.com.br` |
| Podcast | `podcast@mackempreende.com.br` |
| Comunica | `comunica@mackempreende.com.br` |
| Culture | `culture@mackempreende.com.br` |

O mapeamento email → squad é feito em `src/lib/auth/get-squad.ts`. O middleware em `src/proxy.ts` protege todas as rotas dashboard, redirecionando para `/login` caso a sessão não exista.

---

## Convenções de Código

### Nomenclatura

| Tipo | Convenção | Exemplo |
|---|---|---|
| Arquivos/Pastas | `kebab-case` | `get-squad.ts` |
| Componentes React | `PascalCase` | `PalestranteCard.tsx` |
| Variáveis e funções | `camelCase` | `computeDisplayStatus` |
| Tipos TypeScript | `PascalCase` | `EventoInput` |
| Constantes | `UPPER_SNAKE_CASE` | `STATUS_CONFIG` |

### Commits (Conventional Commits)

```
feat: adicionar cadastro de palestrante
fix: corrigir filtro de eventos por squad
chore: atualizar dependências
docs: adicionar documentação do módulo de arquivos
style: ajustar espaçamento na navbar mobile
```

### Princípios

- **Server Components** por padrão; `'use client'` somente quando necessário
- **Formulários**: sempre `react-hook-form` + `zod`
- **Mutações**: sempre via Server Actions com validação
- **Erros do Supabase**: tratados explicitamente em cada operação
- **Área de toque mobile**: mínimo de 44×44px em todos os botões

---

## Licença

Projeto privado da **Liga Acadêmica MackEmpreende** — Universidade Presbiteriana Mackenzie.

Uso restrito aos membros e colaboradores da liga.

---

<p align="center">
  Feito com ❤️ pelo time MackEmpreende
</p>
