# NexTel Connect - Central do Assinante

SPA em React para painel administrativo e portal do assinante usando Supabase/PostgreSQL como base principal, com Realtime, CRUD administrativo, PIX, EmailJS, PWA, logs e relatorios.

## Rodar localmente

```bash
npm install
npm run dev
```

Credencial admin inicial:

```text
login: admin
senha: Admin@2024
```

Clientes usam o `login` e `senha` cadastrados na tabela `clientes`.

## Configuracao do Supabase

1. Crie conta gratuita em https://supabase.com
2. Clique em "New Project" e use o nome `nextel-connect`
3. Aguarde o projeto inicializar
4. Va em `Settings` -> `API` e copie:
   - Project URL -> `VITE_SUPABASE_URL`
   - anon/public key -> `VITE_SUPABASE_ANON_KEY`
5. Cole os valores no arquivo `.env` na raiz do projeto
6. Va em `SQL Editor` -> `New Query`
7. Cole e execute o conteudo de `docs/supabase.sql`
8. Verifique no `Table Editor` se as tabelas foram criadas com os dados
9. Reinicie o app com `npm run dev`

Exemplo de `.env`:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Editar dados diretamente no Supabase

- Acesse https://supabase.com -> seu projeto -> `Table Editor`
- Selecione a tabela desejada (`clientes`, `planos`, `faturas`, `conexoes`, etc.)
- Clique em qualquer celula para editar diretamente
- Alteracoes aparecem no sistema em tempo real pelo Supabase Realtime

## SQL do banco

O arquivo [docs/supabase.sql](docs/supabase.sql) cria:

- `admin`
- `clientes`
- `planos`
- `faturas`
- `conexoes`
- `chamados`
- `comunicados`
- `logs`
- `comprovantes`
- `modelos_contrato`
- `contratos`

Ele tambem insere o admin padrao, os planos iniciais, o modelo padrao de contrato, os 15 clientes, as 90 faturas e as 15 conexoes iniciais. O script tambem adiciona campos de endereco completo e coordenadas na tabela `clientes`.

## Estrutura geral

- `src/config/supabase.js`: client Supabase
- `src/services/supabaseService.js`: leituras, escritas, autenticacao manual e Realtime
- `src/context/AuthContext.jsx`: sessao, carregamento global e Realtime
- `src/components/admin`: dashboard, clientes, faturas, planos e conexoes, mapa, chamados, inadimplencia, comunicados, logs e seguranca
- `src/components/cliente`: inicio, faturas, plano, dados, contratos e suporte
- `public`: manifest, service worker e icones PWA

## Configuracao do EmailJS

1. Crie conta gratuita em https://www.emailjs.com
2. Crie um "Email Service" conectando sua conta Gmail
3. Copie Service ID, Template IDs e Public Key
4. Configure `.env.local` usando `.env.example` como base
5. Reinicie o servidor depois de alterar `.env.local`

Variaveis usadas:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=sua_public_key
VITE_EMAILJS_ADMIN_EMAIL=elyssonvg321@gmail.com
VITE_EMAILJS_ADMIN_NAME=Administrador NexTel

VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_TEMPLATE_ALTERACAO=template_xxxxxxx
VITE_EMAILJS_TEMPLATE_2VIA=template_xxxxxxx
VITE_EMAILJS_TEMPLATE_CHAMADO=template_chamado_admin
VITE_EMAILJS_TEMPLATE_STATUS_CHAMADO=template_chamado_cliente
VITE_EMAILJS_TEMPLATE_COBRANCA=template_xxxxxxx
VITE_EMAILJS_TEMPLATE_COMPROVANTE=template_xxxxxxx
VITE_EMAILJS_TEMPLATE_CONTRATO=template_xxxxxxx
VITE_EMAILJS_TEMPLATE_RESET_SENHA=template_xxxxxxx
```

Template de contrato:

- Template ID: `VITE_EMAILJS_TEMPLATE_CONTRATO`
- Assunto: `Contrato aguardando sua assinatura - NexTel Connect`
- Corpo sugerido:

```text
Ola {{to_name}},
Seu contrato "{{contrato_titulo}}" ({{contrato_id}}) esta aguardando sua assinatura.
Acesse o portal do assinante para visualizar e assinar.
Gerado em: {{data_geracao}}
{{instrucoes}}
```

Template de redefinicao de senha:

- Template ID: `VITE_EMAILJS_TEMPLATE_RESET_SENHA`
- Assunto: `Sua senha foi redefinida - NexTel Connect`
- Corpo sugerido:

```text
Ola {{to_name}},
Sua senha de acesso ao portal foi redefinida pelo administrador.
Nova senha: {{nova_senha}}
Data/Hora: {{data_hora}}
Se nao reconhece esta alteracao, entre em contato imediatamente.
```

## Chat ao vivo (Tawk.to)

1. Crie conta gratuita em https://tawk.to
2. Crie uma propriedade "NexTel Connect"
3. Copie o ID do widget
4. Cole em `src/components/TawkChat.jsx` no lugar de `SEU_TAWK_ID`

Enquanto o ID estiver como placeholder, o script nao e carregado para evitar erro no console.

## PWA

O app inclui:

- `public/manifest.json`
- `public/sw.js`
- `public/icon-192.png`
- `public/icon-512.png`
- banner de instalacao na tela de login

## Seguranca aplicada

- Senhas novas de clientes sao salvas com bcrypt (`bcryptjs`).
- Login aceita temporariamente senha antiga em texto puro para permitir migracao segura.
- Bloqueio local do login apos 5 tentativas incorretas por 15 minutos.
- Sessao expira em 8 horas, ou 30 dias quando "Lembrar de mim" estiver marcado.
- Timeout automatico por inatividade apos 30 minutos.
- Logs incluem user agent e alertam possivel forca bruta no painel admin.
- 2FA opcional para o admin em `Admin -> Seguranca`.

## Migrar senhas existentes para bcrypt

Depois de executar o SQL atualizado no Supabase, faca login como admin e rode no console do navegador:

```js
await window.nextelMigrarTodasSenhas()
```

Execute apenas uma vez. O login continuara funcionando durante a migracao porque o sistema compara bcrypt e texto puro temporariamente.

## SQL de seguranca

Se o banco ja existia antes desta versao, execute novamente `docs/supabase.sql` no SQL Editor do Supabase. O script adiciona, sem apagar dados:

- `logs.ip_address`
- `logs.user_agent`
- `admin.totp_secret`
- `admin.totp_ativo`

O seed foi ajustado para nao sobrescrever senhas ja migradas quando o SQL for executado novamente.

## Backend e HTTPS

As instrucoes de HTTPS com Nginx + Certbot ficam em [DEPLOY.md](DEPLOY.md).

Foi adicionado um exemplo de validacao com `express-validator` em `backend/src/routes/conexoes.js` para quando houver backend Node/Express proprio.

## Observacoes

- `.env`, `.env.local`, `.env.production`, `.env*.local` e `backend/.env` estao no `.gitignore`.
- PIX e gerado 100% no frontend pelo padrao EMV/BACEN.
- Exportacoes Excel usam `write-excel-file`.
