# Serviços de API - Documentação

## 📁 Estrutura

```
services/
├── api.ts      # Cliente HTTP e endpoints da API
└── hooks.ts    # Hooks React para gerenciamento de estado
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado em `.env.example`:

```bash
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
```

### 2. Autenticação

O cliente API gerencia automaticamente o token JWT:

```typescript
import { authAPI, apiClient } from '../services/api';

// Login
const response = await authAPI.login({
  telefone: '+244 900 000 000',
  senha: 'senha123'
});

if (response.success) {
  // Token é automaticamente armazenado no localStorage
  apiClient.setToken(response.data.token);
  navigate('/dashboard');
}
```

## 📚 Uso dos Serviços

### Exemplo 1: Listar Empresas

```typescript
import { empresasAPI } from '../services/api';
import { useFetch } from '../services/hooks';

function EmpresasComponent() {
  const { data, loading, error, refetch } = useFetch(
    () => empresasAPI.list({ status: 'ATIVO' }),
    { status: 'ATIVO' }
  );

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {data?.map(empresa => (
        <div key={empresa.id}>{empresa.nome}</div>
      ))}
      <button onClick={refetch}>Recarregar</button>
    </div>
  );
}
```

### Exemplo 2: Criar Lote no Marketplace

```typescript
import { lotesAPI } from '../services/api';
import { useMutation } from '../services/hooks';

function CriarLoteComponent() {
  const { mutate, loading, error, success } = useMutation(lotesAPI.create);

  const handleSubmit = async (formData) => {
    const result = await mutate({
      produto_id: formData.produtoId,
      quantidade_kg: formData.quantidade,
      preco_por_kg: formData.preco,
      qualidade: formData.qualidade,
      data_colheita: new Date(),
      // ... outros campos
    });

    if (result.success) {
      alert('Lote criado com sucesso!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* campos do formulário */}
      <button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Criar Lote'}
      </button>
      {success && <div className="success">Lote criado!</div>}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### Exemplo 3: Paginação

```typescript
import { fazendasAPI } from '../services/api';
import { usePagination } from '../services/hooks';

function FazendasComponent() {
  const {
    data,
    loading,
    page,
    totalPages,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage
  } = usePagination(fazendasAPI.list, 1, 20);

  return (
    <div>
      {data?.map(fazenda => (
        <div key={fazenda.id}>{fazenda.nome}</div>
      ))}
      
      <div className="pagination">
        <button onClick={previousPage} disabled={!hasPreviousPage}>
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button onClick={nextPage} disabled={!hasNextPage}>
          Próxima
        </button>
      </div>
    </div>
  );
}
```

### Exemplo 4: Polling (Atualização Automática)

```typescript
import { notificacoesAPI } from '../services/api';
import { usePolling } from '../services/hooks';

function NotificacoesComponent() {
  const { data, loading } = usePolling(
    () => notificacoesAPI.getUnreadCount(),
    30000, // 30 segundos
    { enabled: true }
  );

  return (
    <div className="notification-badge">
      {data?.count > 0 && (
        <span className="badge">{data.count}</span>
      )}
    </div>
  );
}
```

## 🎯 Hooks Disponíveis

### `useFetch<T>`
Gerencia requisições GET com cache automático.

**Parâmetros:**
- `fetchFunction`: Função que retorna Promise<APIResponse<T>>
- `filters`: QueryFilters opcionais
- `options`: { skip?, cacheTime? }

**Retorna:**
- `data`: Dados retornados
- `loading`: Estado de carregamento
- `error`: Mensagem de erro
- `refetch`: Função para recarregar dados

### `useMutation<TData, TVariables>`
Gerencia mutações (POST, PUT, DELETE).

**Parâmetros:**
- `mutationFunction`: Função que executa a mutação

**Retorna:**
- `mutate`: Função para executar a mutação
- `data`: Dados retornados
- `loading`: Estado de carregamento
- `error`: Mensagem de erro
- `success`: Indica sucesso
- `reset`: Reseta o estado

### `usePagination<T>`
Gerencia listagens paginadas.

**Parâmetros:**
- `fetchFunction`: Função de fetch
- `initialPage`: Página inicial (padrão: 1)
- `pageSize`: Itens por página (padrão: 20)

**Retorna:**
- `data`: Dados da página atual
- `loading`: Estado de carregamento
- `page`: Página atual
- `totalPages`: Total de páginas
- `totalItems`: Total de itens
- `nextPage/previousPage`: Funções de navegação
- `hasNextPage/hasPreviousPage`: Indicadores booleanos

### `usePolling<T>`
Atualização automática periódica.

**Parâmetros:**
- `fetchFunction`: Função para buscar dados
- `interval`: Intervalo em ms (padrão: 30000)
- `options`: { enabled? }

**Retorna:**
- `data`: Dados atualizados
- `loading`: Estado de carregamento
- `error`: Mensagem de erro

### `useAuth`
Gerencia autenticação.

**Retorna:**
- `isAuthenticated`: Se está autenticado
- `token`: Token atual
- `login`: Função para fazer login
- `logout`: Função para fazer logout

## 🔌 APIs Disponíveis

### `authAPI`
- `login(credentials)`: Autenticar usuário
- `logout()`: Fazer logout
- `verifyOTP(data)`: Verificar código OTP
- `refreshToken()`: Renovar token
- `getProfile()`: Obter perfil do usuário

### `empresasAPI`
- `list(filters?)`: Listar empresas
- `getById(id)`: Obter por ID
- `create(data)`: Criar empresa
- `update(id, data)`: Atualizar empresa
- `delete(id)`: Deletar empresa
- `getUsers(empresaId, filters?)`: Usuários da empresa
- `addUser(empresaId, data)`: Adicionar usuário
- `removeUser(empresaId, usuarioId)`: Remover usuário

### `utilizadoresAPI`
- `list(filters?)`: Listar utilizadores
- `getById(id)`: Obter por ID
- `create(data)`: Criar utilizador
- `update(id, data)`: Atualizar utilizador

### `fazendasAPI`
- `list(filters?)`: Listar fazendas
- `getById(id)`: Obter por ID
- `create(data)`: Criar fazenda
- `update(id, data)`: Atualizar fazenda
- `approve(id)`: Aprovar fazenda
- `reject(id, motivo)`: Rejeitar fazenda

### `lotesAPI`
- `list(filters?)`: Listar lotes
- `getById(id)`: Obter por ID
- `create(data)`: Criar lote
- `update(id, data)`: Atualizar lote
- `publish(id)`: Publicar no marketplace
- `unpublish(id)`: Despublicar

### `hubsAPI`
- `list(filters?)`: Listar hubs
- `getById(id)`: Obter por ID
- `create(data)`: Criar hub
- `update(id, data)`: Atualizar hub
- `getStats(id)`: Estatísticas do hub

### `fretesAPI`
- `list(filters?)`: Listar fretes
- `getById(id)`: Obter por ID
- `create(data)`: Criar frete
- `update(id, data)`: Atualizar frete
- `getTracking(id)`: Rastreamento GPS

### `transacoesAPI`
- `list(filters?)`: Listar transações
- `getById(id)`: Obter por ID
- `getByHash(hash)`: Obter por hash blockchain

### `notificacoesAPI`
- `list(filters?)`: Listar notificações
- `markAsRead(id)`: Marcar como lida
- `markAllAsRead()`: Marcar todas como lidas
- `getUnreadCount()`: Contagem de não lidas

### `estatisticasAPI`
- `getDashboard(filters?)`: Estatísticas do dashboard
- `getComunas(filters?)`: Estatísticas de comunas
- `getRankingComunas(filters?)`: Ranking de comunas

### `produtosAPI`
- `list(filters?)`: Listar produtos
- `getById(id)`: Obter por ID
- `getPriceHistory(id, dias?)`: Histórico de preços

## 🛡️ Tratamento de Erros

Todos os serviços retornam um `APIResponse<T>`:

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    page?: number;
    limit?: number;
    totalPages?: number;
    totalItems?: number;
  };
}
```

Exemplo de tratamento:

```typescript
const response = await empresasAPI.getById('123');

if (response.success && response.data) {
  console.log('Empresa:', response.data);
} else {
  console.error('Erro:', response.error);
  // Mostrar mensagem de erro ao usuário
}
```

## 🔄 Migração de Componentes Existentes

Para migrar componentes que usam dados mock:

**ANTES:**
```typescript
const [data, setData] = useState(mockData);
```

**DEPOIS:**
```typescript
import { useFetch } from '../services/hooks';
import { empresasAPI } from '../services/api';

const { data, loading, error } = useFetch(() => empresasAPI.list());
```

## 📝 Notas Importantes

1. **Token JWT**: Armazenado automaticamente no localStorage
2. **Cache**: useFetch tem cache de 5 minutos por padrão
3. **Tipos**: Todos os endpoints são tipados com TypeScript
4. **Erros**: Sempre verifique `response.success` antes de usar `response.data`
5. **Prisma**: Tipos alinhados com schema.prisma do backend

## 🚀 Próximos Passos

1. Criar arquivo `.env` com URL da API
2. Implementar backend REST API com Prisma
3. Migrar componentes para usar os novos serviços
4. Adicionar interceptors para refresh token automático
5. Implementar retry logic para requisições falhadas
