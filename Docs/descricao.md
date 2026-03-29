# MackEmpreende — Documentação Técnica do Sistema

> Documento interno para o time de desenvolvimento.  
> Versão 1.0 | Liga Acadêmica MackEmpreende

---

## Sumário

1. [Visão geral do projeto](#1-visão-geral-do-projeto)
2. [Stack tecnológica](#2-stack-tecnológica)
3. [Arquitetura do sistema](#3-arquitetura-do-sistema)
4. [Estrutura de banco de dados](#4-estrutura-de-banco-de-dados)
5. [Autenticação e controle de acesso](#5-autenticação-e-controle-de-acesso)
6. [Módulos e funcionalidades](#6-módulos-e-funcionalidades)
7. [Estrutura de pastas do projeto](#7-estrutura-de-pastas-do-projeto)
8. [Configuração do ambiente](#8-configuração-do-ambiente)
9. [Deploy e hospedagem](#9-deploy-e-hospedagem)
10. [Plano de desenvolvimento por fases](#10-plano-de-desenvolvimento-por-fases)
11. [Convenções e boas práticas](#11-convenções-e-boas-práticas)
12. [Decisões técnicas e justificativas](#12-decisões-técnicas-e-justificativas)

---

## 1. Visão geral do projeto

### Contexto

O **MackEmpreende** é a liga acadêmica de empreendedorismo da Universidade Presbiteriana Mackenzie. A liga é dividida em 4 squads:

| Squad | Responsabilidade |
|---|---|
| **Comunica** | Mídias sociais e comunicação externa |
| **Culture** | Cultura interna da liga |
| **Podcast** | Produção e organização do podcast da liga |
| **PEW** | Projetos, Eventos, Workshops e Aulas |

### Problema

Os squads **PEW** e **Podcast** enfrentam dificuldade em organizar:
- Datas de eventos, aulas e episódios de podcast
- Cadastro e acompanhamento de palestrantes e convidados
- Centralização de planilhas e documentos de apoio

### Solução

Sistema web leve, **mobile-first**, com login por squad, que centraliza o cadastro de palestrantes, a gestão de um calendário de eventos e o upload de arquivos estruturados.

### Princípios de design

- **Mobile-first:** a grande maioria dos integrantes acessa via celular
- **Leveza:** sem dependências desnecessárias, carregamento rápido
- **Simplicidade:** fluxos diretos, sem complexidade excessiva
- **Paleta visual:** tons de vermelho (`#A32D2D`, `#E24B4A`) e branco/cinza claro

---

## 2. Stack tecnológica

### Frontend

| Tecnologia | Versão | Motivo |
|---|---|---|
| [Next.js](https://nextjs.org/) | 14+ (App Router) | SSR/SSG, roteamento nativo, deploy fácil no Vercel |
| React | 18+ | Ecossistema, componentes reutilizáveis |
| [Tailwind CSS](https://tailwindcss.com/) | 3+ | Estilização rápida e mobile-first |
| [shadcn/ui](https://ui.shadcn.com/) | latest | Componentes acessíveis e customizáveis |

### Backend / Infraestrutura

| Tecnologia | Uso |
|---|---|
| [Supabase](https://supabase.com/) | Banco de dados (Postgres), autenticação e storage de arquivos |
| Supabase Auth | Sistema de login com roles por squad |
| Supabase Storage | Armazenamento de planilhas e arquivos |
| Supabase Realtime *(opcional v2)* | Atualizações em tempo real no calendário |

### Deploy

| Serviço | Uso |
|---|---|
| [Vercel](https://vercel.com/) | Hospedagem do frontend Next.js (plano gratuito) |
| GitHub | Controle de versão e CI/CD via integração Vercel |

### Bibliotecas auxiliares recomendadas

```
@supabase/supabase-js     — cliente Supabase para Next.js
@supabase/ssr             — helpers de autenticação SSR
date-fns                  — manipulação de datas
react-hook-form           — gerenciamento de formulários
zod                       — validação de schemas
react-dropzone            — upload de arquivos via drag-and-drop
@tanstack/react-query     — cache e fetching de dados
lucide-react              — ícones
```

---

## 3. Arquitetura do sistema

```
┌─────────────────────────────────────────────────────┐
│                    Cliente (browser)                 │
│              Next.js App (mobile-first)              │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │  /login  │  │ /agenda  │  │  /palestrantes      │ │
│  └──────────┘  └──────────┘  │  /arquivos          │ │
│                               └────────────────────┘ │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS / fetch
┌────────────────────▼────────────────────────────────┐
│                  Supabase (BaaS)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │    Auth     │  │  Postgres   │  │   Storage   │  │
│  │  (por squad)│  │  (dados)    │  │  (arquivos) │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                    Vercel (deploy)                    │
│         CI/CD automático via push no GitHub          │
└─────────────────────────────────────────────────────┘
```

### Fluxo de dados principal

1. Usuário acessa o sistema via celular
2. Login com email + senha do squad
3. Supabase Auth valida e retorna sessão com `role` do squad
4. Next.js usa o `role` para proteger rotas e filtrar dados
5. Dados são lidos/escritos diretamente via Supabase JS client
6. Arquivos são enviados para Supabase Storage e o link é salvo no banco

---

## 4. Estrutura de banco de dados

### Diagrama de entidades

```
palestrantes
    │
    │ 1:N
    ▼
eventos ◄──── N:1 ──── squads (referência por enum)
    │
    │ 1:N
    ▼
arquivos
```

### SQL completo — criar no Supabase SQL Editor

```sql
-- Habilitar extensão uuid
create extension if not exists "uuid-ossp";

-- ==========================================
-- ENUM: tipos de squad
-- ==========================================
create type squad_tipo as enum ('PEW', 'Podcast', 'Comunica', 'Culture');

-- ==========================================
-- ENUM: status de contato com palestrante
-- ==========================================
create type status_palestrante as enum (
  'a_contatar',
  'contatado',
  'aguardando_resposta',
  'confirmado',
  'recusado',
  'cancelado'
);

-- ==========================================
-- ENUM: tipo de evento
-- ==========================================
create type tipo_evento as enum (
  'aula',
  'workshop',
  'palestra',
  'podcast',
  'evento_externo',
  'reuniao_interna'
);

-- ==========================================
-- TABELA: palestrantes
-- ==========================================
create table palestrantes (
  id            uuid primary key default uuid_generate_v4(),
  nome          text not null,
  email         text,
  telefone      text,
  empresa       text,
  cargo         text,
  tema          text,                           -- tema principal de atuação
  bio           text,                           -- bio resumida
  linkedin      text,                           -- URL do perfil
  instagram     text,                           -- handle @
  status        status_palestrante not null default 'a_contatar',
  squad_resp    squad_tipo not null,            -- squad responsável pelo contato
  observacoes   text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- ==========================================
-- TABELA: eventos
-- ==========================================
create table eventos (
  id              uuid primary key default uuid_generate_v4(),
  titulo          text not null,
  descricao       text,
  data_inicio     timestamptz not null,
  data_fim        timestamptz,
  local           text,                         -- pode ser "online", nome do local, etc.
  link_online     text,                         -- link do Meet/Zoom se for remoto
  tipo            tipo_evento not null,
  squad           squad_tipo not null,
  palestrante_id  uuid references palestrantes(id) on delete set null,
  vagas           integer,                      -- null = sem limite
  confirmado      boolean not null default false,
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now()
);

-- ==========================================
-- TABELA: arquivos
-- ==========================================
create table arquivos (
  id            uuid primary key default uuid_generate_v4(),
  nome          text not null,                  -- nome de exibição
  nome_arquivo  text not null,                  -- nome real no storage
  url           text not null,                  -- URL pública do Supabase Storage
  tipo_mime     text,                           -- ex: application/vnd.openxmlformats...
  tamanho_bytes bigint,
  squad         squad_tipo not null,
  evento_id     uuid references eventos(id) on delete set null,
  descricao     text,
  criado_em     timestamptz not null default now()
);

-- ==========================================
-- TRIGGER: atualizar atualizado_em automaticamente
-- ==========================================
create or replace function set_atualizado_em()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_palestrantes_atualizado
  before update on palestrantes
  for each row execute function set_atualizado_em();

create trigger trg_eventos_atualizado
  before update on eventos
  for each row execute function set_atualizado_em();

-- ==========================================
-- ÍNDICES para queries frequentes
-- ==========================================
create index idx_eventos_data_inicio on eventos(data_inicio);
create index idx_eventos_squad on eventos(squad);
create index idx_eventos_tipo on eventos(tipo);
create index idx_palestrantes_squad on palestrantes(squad_resp);
create index idx_palestrantes_status on palestrantes(status);
create index idx_arquivos_squad on arquivos(squad);
create index idx_arquivos_evento on arquivos(evento_id);
```

### Row Level Security (RLS)

O Supabase usa RLS para segurança a nível de linha. Como o controle de acesso é por squad (não por usuário individual), a política mais simples é: **usuário autenticado pode ler e escrever tudo**. Se no futuro quiser segmentar por squad, é só adicionar policies mais específicas.

```sql
-- Habilitar RLS em todas as tabelas
alter table palestrantes enable row level security;
alter table eventos enable row level security;
alter table arquivos enable row level security;

-- Policy: qualquer usuário autenticado tem acesso total
create policy "acesso_autenticado" on palestrantes
  for all using (auth.role() = 'authenticated');

create policy "acesso_autenticado" on eventos
  for all using (auth.role() = 'authenticated');

create policy "acesso_autenticado" on arquivos
  for all using (auth.role() = 'authenticated');
```

---

## 5. Autenticação e controle de acesso

### Estratégia

Cada squad tem **uma conta de email** cadastrada no Supabase Auth. Os integrantes do squad compartilham a senha da conta do squad. Não há contas individuais por integrante.

### Contas a criar no Supabase Auth

| Squad | Email sugerido |
|---|---|
| PEW | pew@mackempreende.com.br |
| Podcast | podcast@mackempreende.com.br |
| Comunica | comunica@mackempreende.com.br |
| Culture | culture@mackempreende.com.br |

> Criar manualmente em: **Supabase Dashboard > Authentication > Users > Invite**

### Identificando o squad do usuário logado

Após o login, o email do usuário é usado para identificar o squad:

```typescript
// lib/auth/get-squad.ts
import { createClient } from '@/lib/supabase/client'

export type Squad = 'PEW' | 'Podcast' | 'Comunica' | 'Culture'

const EMAIL_SQUAD_MAP: Record<string, Squad> = {
  'pew@mackempreende.com.br': 'PEW',
  'podcast@mackempreende.com.br': 'Podcast',
  'comunica@mackempreende.com.br': 'Comunica',
  'culture@mackempreende.com.br': 'Culture',
}

export function getSquadFromEmail(email: string): Squad | null {
  return EMAIL_SQUAD_MAP[email] ?? null
}
```

### Proteção de rotas com middleware Next.js

```typescript
// middleware.ts (raiz do projeto)
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* helpers de cookie SSR */ } }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Redirecionar para login se não autenticado
  if (!session && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirecionar para agenda se já logado e tentar acessar /login
  if (session && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/agenda', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

## 6. Módulos e funcionalidades

### 6.1 Módulo de autenticação (`/login`)

**Tela:** formulário simples com campo de email e senha.

**Comportamento:**
- Após login bem-sucedido, redireciona para `/agenda`
- Exibe mensagem de erro clara em caso de credenciais inválidas
- Mantém sessão ativa (não expira ao fechar o app — usar `persistSession: true`)

**Componentes:**
```
/app/login/
  page.tsx          — página pública
  LoginForm.tsx     — componente do formulário
```

---

### 6.2 Módulo de agenda/calendário (`/agenda`)

**Objetivo:** visualizar todos os eventos da liga com filtro por squad e tipo.

**Funcionalidades:**
- Visualização em lista (padrão mobile) e calendário mensal (desktop)
- Filtro por squad: PEW, Podcast, todos
- Filtro por tipo: aula, workshop, palestra, podcast
- Card de evento com: título, data/hora, local, palestrante vinculado, squad
- Botão de criação de novo evento
- Indicador visual de eventos confirmados vs. tentativa

**Queries Supabase:**

```typescript
// Buscar eventos do mês atual
const { data: eventos } = await supabase
  .from('eventos')
  .select(`
    *,
    palestrantes (
      id,
      nome,
      empresa
    )
  `)
  .gte('data_inicio', inicioMes.toISOString())
  .lte('data_inicio', fimMes.toISOString())
  .order('data_inicio', { ascending: true })

// Filtrar por squad
.eq('squad', squadFiltro)  // adicionar ao chain acima se necessário
```

**Formulário de criação de evento:**

Campos obrigatórios: título, data/hora de início, tipo, squad  
Campos opcionais: descrição, local, link online, data fim, palestrante (busca por nome), vagas, confirmado (checkbox)

---

### 6.3 Módulo de palestrantes (`/palestrantes`)

**Objetivo:** banco de dados de convidados e palestrantes com controle de status.

**Funcionalidades:**
- Listagem com busca por nome, empresa ou tema
- Filtro por squad responsável e por status
- Card/linha com: nome, empresa, tema, status (badge colorido), squad responsável
- CRUD completo: cadastrar, visualizar, editar, arquivar
- Tela de detalhe do palestrante com todos os dados e histórico de eventos vinculados

**Badges de status (cores sugeridas):**

| Status | Cor |
|---|---|
| A contatar | cinza |
| Contatado | azul |
| Aguardando resposta | amarelo |
| Confirmado | verde |
| Recusado | vermelho |
| Cancelado | vermelho claro |

**Queries Supabase:**

```typescript
// Buscar palestrantes com filtros
const { data: palestrantes } = await supabase
  .from('palestrantes')
  .select('*')
  .ilike('nome', `%${termoBusca}%`)   // busca case-insensitive
  .eq('squad_resp', squadFiltro)       // se filtro de squad ativo
  .eq('status', statusFiltro)          // se filtro de status ativo
  .order('nome', { ascending: true })

// Buscar eventos de um palestrante específico
const { data: eventos } = await supabase
  .from('eventos')
  .select('id, titulo, data_inicio, tipo')
  .eq('palestrante_id', palestranteId)
  .order('data_inicio', { ascending: false })
```

**Formulário de cadastro:**

```typescript
// Schema Zod para validação
import { z } from 'zod'

export const palestranteSchema = z.object({
  nome:        z.string().min(2, 'Nome obrigatório'),
  email:       z.string().email('Email inválido').optional().or(z.literal('')),
  telefone:    z.string().optional(),
  empresa:     z.string().optional(),
  cargo:       z.string().optional(),
  tema:        z.string().optional(),
  bio:         z.string().max(500).optional(),
  linkedin:    z.string().url('URL inválida').optional().or(z.literal('')),
  instagram:   z.string().optional(),
  status:      z.enum(['a_contatar','contatado','aguardando_resposta','confirmado','recusado','cancelado']),
  squad_resp:  z.enum(['PEW','Podcast','Comunica','Culture']),
  observacoes: z.string().optional(),
})
```

---

### 6.4 Módulo de arquivos (`/arquivos`)

**Objetivo:** centralizar planilhas, documentos e materiais de apoio dos squads.

**Funcionalidades:**
- Upload de arquivos via drag-and-drop ou seleção
- Tipos aceitos: `.xlsx`, `.csv`, `.pdf`, `.docx`
- Tamanho máximo: 10 MB por arquivo
- Listagem com filtro por squad e por evento vinculado
- Associar arquivo a um evento existente (opcional)
- Download direto via link público do Supabase Storage
- Exclusão de arquivos (remove do storage e do banco)

**Estrutura no Supabase Storage:**

```
bucket: mackempreende-arquivos/
  ├── pew/
  │   ├── 2025-01/
  │   │   └── planejamento-semestral.xlsx
  │   └── 2025-02/
  ├── podcast/
  │   └── 2025-01/
  ├── comunica/
  └── culture/
```

**Código de upload:**

```typescript
// actions/upload-arquivo.ts
import { createClient } from '@/lib/supabase/client'

export async function uploadArquivo(file: File, squad: string, eventoId?: string) {
  const supabase = createClient()

  // Gerar path único
  const mes = new Date().toISOString().slice(0, 7)  // "2025-01"
  const nomeUnico = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
  const path = `${squad.toLowerCase()}/${mes}/${nomeUnico}`

  // Upload para o Storage
  const { error: uploadError } = await supabase.storage
    .from('mackempreende-arquivos')
    .upload(path, file, { contentType: file.type })

  if (uploadError) throw uploadError

  // Gerar URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('mackempreende-arquivos')
    .getPublicUrl(path)

  // Salvar metadados no banco
  const { error: dbError } = await supabase
    .from('arquivos')
    .insert({
      nome: file.name,
      nome_arquivo: nomeUnico,
      url: publicUrl,
      tipo_mime: file.type,
      tamanho_bytes: file.size,
      squad: squad,
      evento_id: eventoId ?? null,
    })

  if (dbError) throw dbError

  return publicUrl
}
```

---

## 7. Estrutura de pastas do projeto

```
mackempreende-web/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/              # grupo de rotas protegidas
│   │   ├── layout.tsx            # layout com navbar mobile
│   │   ├── agenda/
│   │   │   ├── page.tsx
│   │   │   ├── novo/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── palestrantes/
│   │   │   ├── page.tsx
│   │   │   ├── novo/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── editar/
│   │   │           └── page.tsx
│   │   └── arquivos/
│   │       └── page.tsx
│   ├── layout.tsx                # layout raiz (providers)
│   └── globals.css
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── agenda/
│   │   ├── EventoCard.tsx
│   │   ├── EventoForm.tsx
│   │   └── CalendarioMes.tsx
│   ├── palestrantes/
│   │   ├── PalestranteCard.tsx
│   │   ├── PalestranteForm.tsx
│   │   └── StatusBadge.tsx
│   ├── arquivos/
│   │   ├── UploadZone.tsx
│   │   └── ArquivoItem.tsx
│   └── layout/
│       ├── Navbar.tsx            # bottom nav mobile
│       └── PageHeader.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # cliente browser
│   │   ├── server.ts             # cliente SSR
│   │   └── middleware.ts         # helper do middleware
│   ├── auth/
│   │   └── get-squad.ts
│   └── utils.ts
│
├── hooks/
│   ├── useEventos.ts
│   ├── usePalestrantes.ts
│   └── useArquivos.ts
│
├── types/
│   └── database.ts               # tipos gerados do Supabase
│
├── actions/                      # Server Actions Next.js
│   ├── eventos.ts
│   ├── palestrantes.ts
│   └── arquivos.ts
│
├── middleware.ts                  # proteção de rotas
├── .env.local                     # variáveis de ambiente (não subir no git)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 8. Configuração do ambiente

### Pré-requisitos

- Node.js 18+
- npm ou pnpm
- Conta gratuita no [Supabase](https://supabase.com)
- Conta no [Vercel](https://vercel.com) conectada ao GitHub

### Variáveis de ambiente

Criar arquivo `.env.local` na raiz:

```bash
# Supabase — encontrar em: Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Nunca subir `.env.local` para o git.** Verificar se está no `.gitignore`.

### Instalação local

```bash
# Clonar o repositório
git clone https://github.com/org/mackempreende-web.git
cd mackempreende-web

# Instalar dependências
npm install

# Iniciar em desenvolvimento
npm run dev

# Acessar em http://localhost:3000
```

### Configurar Supabase Storage

No Supabase Dashboard:
1. Acessar **Storage > New Bucket**
2. Nome: `mackempreende-arquivos`
3. Marcar como **Public** (para URLs de download direto)
4. Em **Policies**, adicionar policy de upload para usuários autenticados:

```sql
create policy "upload autenticado"
on storage.objects for insert
with check (auth.role() = 'authenticated');

create policy "leitura publica"
on storage.objects for select
using (bucket_id = 'mackempreende-arquivos');
```

### Gerar tipos TypeScript do Supabase

```bash
# Instalar CLI do Supabase
npm install -g supabase

# Login
supabase login

# Gerar tipos (substituir <project-id> pelo ID do projeto)
supabase gen types typescript --project-id <project-id> > types/database.ts
```

---

## 9. Deploy e hospedagem

### Vercel (recomendado)

1. Fazer push do projeto para um repositório GitHub
2. Acessar [vercel.com](https://vercel.com) e clicar em **New Project**
3. Importar o repositório do GitHub
4. Em **Environment Variables**, adicionar as mesmas variáveis do `.env.local`
5. Clicar em **Deploy**

A partir daí, **todo push na branch `main` dispara um deploy automático**.

### Preview deploys

A Vercel cria automaticamente um deploy de preview para cada Pull Request. Útil para testar mudanças antes de ir para produção.

### Domínio customizado *(opcional)*

Caso a liga queira um domínio próprio (ex: `sistema.mackempreende.com.br`):
1. Comprar domínio (Registro.br, Hostinger, etc.)
2. Em Vercel: **Project > Settings > Domains > Add Domain**
3. Configurar DNS conforme instruções da Vercel

---

## 10. Plano de desenvolvimento por fases

### Fase 1 — Setup e base (1–2 dias)

- [x] Criar projeto Next.js 14 com App Router e Tailwind
- [x] Configurar projeto no Supabase (banco + storage + auth)
- [x] Executar SQL de criação das tabelas
- [x] Configurar `@supabase/ssr` no Next.js
- [x] Implementar middleware de proteção de rotas
- [x] Criar página de login funcional
- [x] Criar layout base com navbar mobile (Agenda / Palestrantes / Arquivos)
- [x] Primeiro deploy no Vercel e validação

**Entregável:** sistema rodando em produção, login funcional, navegação entre abas.

---

### Fase 2 — Módulo de palestrantes (2–3 dias)

- [x] Listagem de palestrantes com busca e filtros (squad, status)
- [x] Formulário de cadastro com validação Zod + React Hook Form
- [x] Tela de detalhe do palestrante
- [x] Edição de palestrante existente
- [x] Badge de status com cores
- [x] Tratamento de erros e feedback visual (toasts)

**Entregável:** CRUD completo de palestrantes funcionando no mobile.

---

### Fase 3 — Módulo de agenda (2–3 dias)

- [x] Listagem de eventos ordenada por data (vista mobile)
- [x] Filtros por squad e tipo
- [x] Formulário de criação de evento
- [x] Vinculação de palestrante ao evento (campo de busca/select)
- [x] Tela de detalhe do evento
- [x] Edição e exclusão de evento
- [x] Indicador visual de evento confirmado vs. provisório (Adicionado: Calendário Mensal e Metadados Expandidos)

**Entregável:** calendário de eventos operacional com criação e edição.

---

### Fase 4 — Módulo de arquivos (1–2 dias)

- [x] Componente de upload com drag-and-drop (`react-dropzone`)
- [x] Validação de tipo e tamanho de arquivo no frontend
- [x] Upload para Supabase Storage + salvar metadados no banco
- [x] Listagem de arquivos com filtro por squad
- [x] Opção de vincular arquivo a um evento (Integrado na listagem)

---

### Fase 5 — Polimento e Ajustes Finais (Em andamento)

- [/] Refactor: Expansão de metadados da Agenda (Palestrantes extras, Backups, Parceiros)
- [/] UI/UX: Melhorias visuais em formulários e feedbacks
- [ ] Testes de integração e RLS avançado
- [ ] Documentação de uso para os squads convidados
- [ ] Preparação para Go-Live final
- [ ] Download via link direto
- [ ] Exclusão de arquivo (storage + banco)

**Entregável:** upload e gerenciamento de arquivos funcionando.

---

### Fase 5 — Polimento e entrega (1 dia)

- [ ] Aplicar paleta de cores MackEmpreende (vermelho `#A32D2D` / branco)
- [ ] Ajustes de responsividade em todos os módulos
- [ ] Estados de loading e empty states em todas as listagens
- [ ] Testar fluxos completos com cada squad
- [ ] Documentar as senhas dos squads de forma segura
- [ ] README de instruções básicas de uso

**Entregável:** sistema completo, polido e entregue para a liga.

---

### Estimativa de prazo total

| Cenário | Prazo |
|---|---|
| Dev dedicado (full-time) | 7–9 dias |
| Dev part-time (4h/dia) | 12–15 dias |
| Time de 2 devs | 5–7 dias |

---

## 11. Convenções e boas práticas

### Nomenclatura

- **Arquivos e pastas:** `kebab-case` para pastas, `PascalCase` para componentes React
- **Variáveis e funções:** `camelCase`
- **Tipos TypeScript:** `PascalCase`
- **Constantes:** `UPPER_SNAKE_CASE`
- **Branches Git:** `feature/nome-da-feature`, `fix/nome-do-bug`

### Commits (Conventional Commits)

```
feat: adicionar cadastro de palestrante
fix: corrigir filtro de eventos por squad
chore: atualizar dependências
docs: adicionar documentação do módulo de arquivos
style: ajustar espaçamento na navbar mobile
```

### Componentes React

- Preferir **Server Components** por padrão no App Router
- Usar `'use client'` apenas quando necessário (interatividade, hooks de estado)
- Formulários: sempre com React Hook Form + Zod
- Fetching de dados: diretamente no Server Component ou via TanStack Query no client

### Tratamento de erros

```typescript
// Sempre tratar erros do Supabase explicitamente
const { data, error } = await supabase.from('eventos').select('*')

if (error) {
  console.error('Erro ao buscar eventos:', error.message)
  // exibir feedback visual para o usuário
  return
}
```

### Acessibilidade mobile

- Todos os botões com área mínima de toque de **44×44px**
- Inputs com `type` correto (`email`, `tel`, `url`) para teclado adequado no mobile
- Evitar hover states como única forma de interação

---

## 12. Decisões técnicas e justificativas

| Decisão | Alternativas consideradas | Motivo da escolha |
|---|---|---|
| **Supabase** como backend | Firebase, PocketBase, backend próprio | Postgres real, auth + storage integrados, plano free generoso, dashboard excelente |
| **Next.js** (App Router) | Create React App, Vite + React, Vue | Deploy direto no Vercel, SSR nativo, melhor performance mobile |
| **Login por squad** (sem contas individuais) | Uma conta por integrante | Evita overhead de gerenciamento de usuários; a liga é pequena e de confiança |
| **Mobile-first** com Tailwind | UI kit pronto (MUI, Chakra) | Controle total sobre estilização, bundle menor, responsividade mais simples |
| **Sem gestão de tarefas** no MVP | Incluir kanban/checklist | Aumenta complexidade sem garantia de uso; avaliar na v2 |
| **Sem notificações push** no MVP | PWA com push notifications | Requer service workers e back-end de notificações; fora do escopo inicial |
| **Arquivos públicos** no Storage | Arquivos privados com signed URLs | Simplifica o acesso; o conteúdo não é sensível |

---