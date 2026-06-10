# Sozo Church — SaaS

> Plataforma de gestão e comunicação para a Igreja Sozo.

## Stack

| Camada      | Tecnologia                       |
|-------------|----------------------------------|
| Frontend    | React 18 + Vite + TypeScript     |
| Estilo      | Tailwind CSS v3                  |
| Roteamento  | React Router v6                  |
| Auth        | Firebase Auth (Google + email)   |
| Banco       | Firestore (NoSQL)                |
| Storage     | Firebase Storage                 |
| Deploy      | Vercel                           |

## Estrutura de Roles

| Role          | Acesso                                          |
|---------------|-------------------------------------------------|
| `super_admin` | Tudo — você                                     |
| `pastor`      | Painel completo + gestão de usuários            |
| `lider`       | Membros (leitura), escalas, eventos, oração     |
| `membro`      | Perfil, eventos, oração, comunicados            |
| `visitante`   | Somente landing page                            |

## Setup Local

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar o projeto Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um novo projeto: **sozo-church**
3. Ative: **Authentication** → Email/Senha e Google
4. Ative: **Firestore Database** (modo produção)
5. Ative: **Storage**

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha `.env.local` com as credenciais do seu projeto Firebase
(em Project Settings → Your apps → Web app).

### 4. Subir as regras do Firestore

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

### 6. Definir seu role como super_admin

Após o primeiro login:
1. Acesse o Firestore no console Firebase
2. Vá em `users/{seu-uid}`
3. Edite o campo `role` para `super_admin`

A partir daí você pode gerenciar os roles de todos os outros usuários
pelo painel `/admin/usuarios`.

## Deploy Vercel

```bash
npm run build
```

No painel da Vercel, adicione as mesmas variáveis do `.env.local`
em **Settings → Environment Variables**.

## Sprints

| Sprint | Foco                                      | Status        |
|--------|-------------------------------------------|---------------|
| 1      | Landing Page + Auth + Layout do admin     | 🔨 Em progresso |
| 2      | Gestão de Usuários + Roles                | ⏳ A fazer     |
| 3      | Membros, Escalas, Eventos, Ministérios    | ⏳ A fazer     |
| 4      | Oração, Comunicados, Transmissão, Perfil  | ⏳ A fazer     |
# Sozo
