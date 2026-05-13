# 🔗 Rajiv Dev | High Performance Link Shortener

Um encurtador de links de alta performance projetado com foco em **Edge Computing**, minimalismo e escalabilidade. Este projeto demonstra a integração de tecnologias de ponta em uma arquitetura Full Stack moderna, garantindo redirecionamentos instantâneos e uma experiência de usuário fluida e segura.

## 🚀 Tech Stack

### Core

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Linguagem:** TypeScript (Strict Mode)
- **Autenticação:** [Clerk](https://clerk.com/)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)

### Database & Infra

- **ORM:** [Prisma](https://www.prisma.io/)
- **Banco de Dados:** [Turso](https://turso.tech/) (SQLite na Borda via LibSQL)
- **Webhooks:** [Svix](https://www.svix.com/)
- **Deployment:** [Vercel](https://vercel.com/)

## 🛠️ Diferenciais Técnicos

- **Global Database Latency:** Arquitetura baseada em Turso para manter os dados geograficamente distribuídos, reduzindo drasticamente o tempo de resposta (TTFB) durante os redirecionamentos.
- **Webhook Synchronization:** Sincronização automática de perfis entre Clerk e o banco de dados via Webhooks seguros, utilizando validação de assinatura criptográfica para integridade dos dados.
- **Minimalist Design System:** Interface focada em usabilidade e estética moderna, utilizando a tipografia _Plus Jakarta Sans_, cantos retos e componentes otimizados para performance.
- **Automated Data Workflow:** Pipeline customizado para automação de migrations e geração dinâmica de tipagens Prisma, garantindo consistência entre o esquema de dados e o código.

## 🏗️ Estrutura do Sistema

1.  **Dashboard Operacional:** Interface autenticada para gerenciamento de links com validação rigorosa de dados via Zod.
2.  **Redirect Engine:** Rota dinâmica de baixa latência (`app/[slug]/route.ts`) responsável pelo roteamento inteligente e contabilização de analytics.
3.  **Sync Engine:** Infraestrutura de Webhooks para persistência resiliente de dados de usuário e eventos de sistema.

---

Desenvolvido por [João Rajiv](https://github.com/joaorajiv)
