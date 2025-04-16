#!/bin/bash

# Instala dependências Python
echo "🔧 Instalando dependências Python..."
pip install -r requirements.txt

# Instala dependências do frontend
echo "📦 Instalando dependências do React..."
npm install

# Compila o frontend com Vite
echo "⚙️  Compilando projeto React..."
npm run build

# Inicia o backend com Gunicorn
echo "🚀 Iniciando servidor Flask com Gunicorn..."
gunicorn app:app --bind 0.0.0.0:$PORT
