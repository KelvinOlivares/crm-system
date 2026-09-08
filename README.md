# CRM System - Laravel + Angular

Sistema CRM completo com backend Laravel e frontend Angular.

## Stack Tecnologica

| Camada | Tecnologia | Versao |
|--------|------------|--------|
| Backend | Laravel | 10.x |
| Frontend | Angular | 17.x |
| Database | MySQL | 8.0 |
| Cache | Redis | 7.x |
| Auth | Laravel Sanctum | 3.x |
| CSS | Tailwind CSS | 3.x |
| Container | Docker | Compose |

## Funcionalidades

### Gestao de Contatos
- CRUD completo de contatos
- Busca e filtros avancados
- Status: Lead, Prospect, Ativo, Inativo
- Fonte: Website, Social, Referral, Cold Call

### Pipeline de Vendas
- Visualizacao Kanban do pipeline
- 5 estagios: Qualification, Proposal, Negotiation, Closed Won/Lost
- Valor e probabilidade por deal
- Data prevista de fechamento

### Atividades
- Registro de calls, emails, meetings, tasks, notes
- Calendario de atividades pendentes
- Marcar como concluido
- Filtros por tipo e status

### Dashboard
- Metricas gerais (contatos, deals, receita)
- Deals por estagio
- Atividades proximas
- Atividades recentes

## Estrutura do Projeto

```
crm-system/
├── backend/                    # Laravel 10
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── ContactController.php
│   │   │   ├── DealController.php
│   │   │   ├── ActivityController.php
│   │   │   └── DashboardController.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Contact.php
│   │       ├── Deal.php
│   │       └── Activity.php
│   ├── database/migrations/
│   └── routes/api.php
├── frontend/                   # Angular 17
│   └── src/app/
│       ├── pages/
│       │   ├── login/
│       │   ├── dashboard/
│       │   ├── contacts/
│       │   ├── deals/
│       │   └── activities/
│       ├── services/
│       ├── guards/
│       └── interceptors/
├── docker-compose.yml
└── nginx.conf
```

## API Endpoints

### Auth
| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Registro |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/user | Usuario atual |

### Contacts
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | /api/contacts | Listar contatos |
| POST | /api/contacts | Criar contato |
| GET | /api/contacts/:id | Detalhes do contato |
| PUT | /api/contacts/:id | Atualizar contato |
| DELETE | /api/contacts/:id | Excluir contato |

### Deals
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | /api/deals | Listar deals |
| POST | /api/deals | Criar deal |
| GET | /api/deals/:id | Detalhes do deal |
| PUT | /api/deals/:id | Atualizar deal |
| DELETE | /api/deals/:id | Excluir deal |
| GET | /api/deals/pipeline | Pipeline visual |

### Activities
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | /api/activities | Listar atividades |
| POST | /api/activities | Criar atividade |
| GET | /api/activities/:id | Detalhes da atividade |
| PUT | /api/activities/:id | Atualizar atividade |
| DELETE | /api/activities/:id | Excluir atividade |

### Dashboard
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | /api/dashboard | Dados do dashboard |

## Instalacao

### Com Docker

```bash
git clone https://github.com/KelvinOlivares/crm-system.git
cd crm-system
docker-compose up -d

# Instalar dependencias do Laravel
docker-compose exec backend composer install
docker-compose exec backend php artisan key:generate
docker-compose exec backend php artisan migrate

# Instalar dependencias do Angular
docker-compose exec frontend npm install
```

Acesse:
- Frontend: http://localhost:4200
- Backend API: http://localhost:8000/api
- API Docs: http://localhost:8000/api/docs

### Desenvolvimento Local

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Frontend
cd frontend
npm install
ng serve
```

## Credenciais de Teste

| Email | Senha | Role |
|-------|-------|------|
| admin@crm.com | password | admin |
| user@crm.com | password | user |

## Licenca

MIT License
