# Deploy NexTel Connect

## Configurar HTTPS no backend

Use HTTPS em producao sempre que existir backend, API propria ou proxy para automacoes.

### 1. Instalar Nginx e Certbot no VPS

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

### 2. Criar configuracao do Nginx

```bash
sudo nano /etc/nginx/sites-available/nextel-backend
```

```nginx
server {
    listen 80;
    server_name api.seudominio.com.br;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Ativar e gerar certificado SSL gratuito

```bash
sudo ln -s /etc/nginx/sites-available/nextel-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d api.seudominio.com.br
```

O certificado sera renovado automaticamente pelo Certbot.

### 4. Atualizar variaveis do React

```env
VITE_BACKEND_URL=https://api.seudominio.com.br
```

Se nao tiver dominio, use HTTP apenas em ambiente de testes. Nunca transmita credenciais reais sem HTTPS em producao.

## Deploy do frontend

```bash
npm install
npm run build
```

Publique a pasta `dist/` em Vercel, Netlify, Cloudflare Pages ou Nginx estatico.
