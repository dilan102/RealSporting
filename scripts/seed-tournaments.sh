#!/bin/bash

# Script para sembrar torneos de referencia
# Uso: bash scripts/seed-tournaments.sh o chmod +x scripts/seed-tournaments.sh && ./scripts/seed-tournaments.sh

echo "🌱 Sembrando torneos de referencia...\n"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json no encontrado"
    echo "Por favor ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Ejecutar el script de Node
echo "📚 Leyendo datos de torneos..."
node scripts/seed-tournaments.js

if [ $? -eq 0 ]; then
    echo "\n✨ ¡Listo para usar!"
    echo "📍 Visita: http://localhost:3000/torneos"
else
    echo "\n❌ Error durante el seed"
    exit 1
fi
