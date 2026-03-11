#!/bin/bash

# ============================================
# AGRI-CONNECT - Script de Setup Automático
# ============================================

echo "🌾 Bem-vindo ao AgriConnect - Painel Empresarial"
echo "================================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se Node.js está instalado
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null
then
    echo -e "${RED}❌ Node.js não está instalado!${NC}"
    echo "Por favor, instale o Node.js 18+ de: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js $NODE_VERSION encontrado${NC}"
echo ""

# Verificar gerenciador de pacotes
echo "📦 Detectando gerenciador de pacotes..."
if command -v pnpm &> /dev/null
then
    PM="pnpm"
    INSTALL_CMD="pnpm install"
    RUN_CMD="pnpm run dev"
elif command -v yarn &> /dev/null
then
    PM="yarn"
    INSTALL_CMD="yarn install"
    RUN_CMD="yarn dev"
else
    PM="npm"
    INSTALL_CMD="npm install"
    RUN_CMD="npm run dev"
fi

echo -e "${GREEN}✅ Usando: $PM${NC}"
echo ""

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "🔧 Criando arquivo .env..."
    cp .env.example .env
    echo -e "${GREEN}✅ Arquivo .env criado${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo .env já existe${NC}"
fi
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
echo "Isso pode levar alguns minutos..."
echo ""
$INSTALL_CMD

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Dependências instaladas com sucesso!${NC}"
    echo ""
    echo "================================================"
    echo "🚀 Setup Concluído!"
    echo "================================================"
    echo ""
    echo "Para iniciar o servidor de desenvolvimento:"
    echo -e "${YELLOW}$RUN_CMD${NC}"
    echo ""
    echo "O projeto estará disponível em: http://localhost:3000"
    echo ""
    echo "📚 Documentação completa: README.md"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    echo "Por favor, tente executar manualmente: $INSTALL_CMD"
    exit 1
fi
