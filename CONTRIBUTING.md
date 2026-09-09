# Contribuindo para o CRM System

Obrigado por considerar contribuir! 🎉

## 📋 Como Contribuir

### 1. Fork o Repositório

```bash
git clone https://github.com/SEU-USERNAME/crm-system.git
cd crm-system
```

### 2. Crie uma Branch

```bash
git checkout -b feature/nova-feature
```

### 3. Instale as Dependências

```bash
# Backend
cd backend
composer install

# Frontend
cd ../frontend
npm install
```

### 4. Configure o Ambiente

```bash
# Backend
cp .env.example .env
php artisan key:generate
```

### 5. Execute os Testes

```bash
# Backend
cd backend
php artisan test

# Frontend
cd ../frontend
npm test
```

### 6. Faça suas Alterações

- Siga o padrão de código existente
- Adicione testes para novas funcionalidades
- Atualize a documentação se necessário

### 7. Commits

Use mensagens de commit claras:

```
feat: adicionar nova funcionalidade de login
fix: corrigir bug no dashboard
docs: atualizar documentação da API
test: adicionar testes unitários
```

### 8. Push e Pull Request

```bash
git push origin feature/nova-feature
```

Abra um Pull Request descrevendo suas alterações.

## 📐 Regras

- ✅ Código limpo e bem documentado
- ✅ Testes para novas funcionalidades
- ✅ Seguir padrões existentes
- ✅ Atualizar README se necessário

## 🐛 Reportar Bugs

Abra uma Issue com:
- Descrição do problema
- Passos para reproduzir
- Comportamento esperado vs atual

## 💡 Sugerir Features

Abra uma Issue com:
- Descrição da funcionalidade
- Casos de uso
- Benefícios esperados

## 📞 Contato

- Email: kelvin_olivares@hotmail.com
- LinkedIn: linkedin.com/in/kelvinolivares
