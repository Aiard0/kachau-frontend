# Kachau Store

Frontend de e-commerce construido com Vue 3, TypeScript e TailwindCSS.

## Demonstração ao vivo

- **Produção**: [https://kachau.zernis.space/](https://kachau.zernis.space/)
- **Espelho Vercel**: [https://kachau-frontend.vercel.app/](https://kachau-frontend.vercel.app/)

O deploy na Vercel serve como um espelho secundário. A URL principal de produção é o domínio customizado.

## Repositórios

- **Frontend**: [https://github.com/Aiard0/kachau-frontend](https://github.com/Aiard0/kachau-frontend)
- **Backend**: [https://github.com/Aiard0/kachau-backend](https://github.com/Aiard0/kachau-backend)

---

## Stack

| Tecnologia        | Propósito                                         |
| ----------------- | ------------------------------------------------- |
| **Vue 3**         | Framework de UI com Composition API               |
| **TypeScript**    | Segurança de tipos                                |
| **Vite**          | Ferramenta de build e servidor de desenvolvimento |
| **Pinia**         | Gerenciamento de estado                           |
| **Vue Router**    | Roteamento no cliente                             |
| **TailwindCSS 4** | CSS utilitário                                    |
| **Lucide Vue**    | Biblioteca de ícones                              |
| **Vercel**        | Hospedagem e CDN                                  |

---

## Funcionalidades

- [x] Catálogo de produtos com busca e filtro
- [x] Autenticação de usuários (login/cadastro)
- [x] Carrinho de compras com persistência no localStorage
- [x] Finalização de compra
- [x] Histórico de pedidos com ordenação (mais recente/mais antigo)
- [x] Autenticação baseada em JWT
- [x] Design responsivo (mobile-first)
- [x] Formatação de preços em Real Brasileiro (BRL)
- [x] Galeria de imagens de produtos

---

## Estrutura do Projeto

```
src/
├── api/
│   └── index.ts          # Camada de serviço da API
├── stores/
│   ├── auth.ts           # Store de autenticação (Pinia)
│   └── cart.ts           # Store do carrinho com localStorage
├── views/
│   ├── HomeView.vue      # Listagem de produtos com busca
│   ├── ProductView.vue   # Página de produto individual
│   ├── CartView.vue      # Carrinho de compras
│   ├── OrdersView.vue    # Histórico de pedidos do usuário
│   ├── LoginView.vue     # Página de login
│   └── RegisterView.vue  # Página de cadastro
├── router/
│   └── index.ts          # Configuração do Vue Router
├── utils/
│   └── format.ts         # Utilitários de formatação
├── events.ts             # Event emitter simples para recarregar produtos
├── main.ts               # Ponto de entrada da aplicação
├── App.vue               # Componente raiz
└── style.css             # Estilos globais (import do Tailwind)
```

---

## Começando

### Pré-requisitos

- Node.js 22+ ou 24.12+
- pnpm (recomendado) ou npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Aiard0/kachau-frontend
cd kachau-frontend

# Instale as dependências
pnpm install
```

### Desenvolvimento

```bash
# Inicie o servidor em http://localhost:5173
pnpm dev

# Verificação de tipos
pnpm type-check

# Linting
pnpm lint

# Formatar código
pnpm format
```

### Build

```bash
# Build para produção
pnpm build

# Pré-visualizar build de produção
pnpm preview
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080
```

Para produção na Vercel, configure a variável de ambiente `VITE_API_URL` nas configurações do seu projeto.

| Variável       | Descrição                  | Padrão                  |
| -------------- | -------------------------- | ----------------------- |
| `VITE_API_URL` | URL base da API do backend | `http://localhost:8080` |

---

## Integração com API

Este frontend espera uma API REST rodando na URL configurada. Veja [API_GUIDE.md](./API_GUIDE.md) para a documentação completa da API.

### Endpoints Utilizados

| Método | Caminho                     | Descrição                |
| ------ | --------------------------- | ------------------------ |
| POST   | `/login`                    | Autenticar usuário       |
| POST   | `/register`                 | Cadastrar novo usuário   |
| GET    | `/products`                 | Listar todos os produtos |
| GET    | `/products/{id}`            | Obter um produto         |
| GET    | `/users`                    | Listar todos os usuários |
| GET    | `/orders/buyer/{buyerId}`   | Obter pedidos do usuário |
| POST   | `/checkout/buyer/{buyerId}` | Criar novo pedido        |

---

## Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente:
   - `VITE_API_URL` = URL do seu backend
3. Deploy

O arquivo `vercel.json` não é necessário pois a Vercel detecta automaticamente projetos Vue/Vite.

### Build Manual

```bash
pnpm build
# A saída estará em dist/
```

---

## Scripts

| Comando           | Descrição                                  |
| ----------------- | ------------------------------------------ |
| `pnpm dev`        | Iniciar servidor de desenvolvimento        |
| `pnpm build`      | Build para produção                        |
| `pnpm preview`    | Pré-visualizar build de produção           |
| `pnpm type-check` | Executar verificação de tipos TypeScript   |
| `pnpm lint`       | Executar ESLint e oxlint com auto-correção |
| `pnpm format`     | Formatar código com Prettier               |

---

## Licença

Este é um projeto público, utilizado para um teste, use-o como quiser.
