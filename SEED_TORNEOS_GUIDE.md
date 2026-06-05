# 🌱 Seed de Torneos de Referencia

Se ha creado un script para poblar la base de datos con torneos de referencia en cada sección.

## 📋 Torneos que se crearán

### 📝 Torneos Jugados (4)
- Copa Metro 2025 (U-14)
- Torneo Intercolegial 2025 (U-17)
- Liga Regional 2025 (U-14)
- Torneo Amistoso Internacional (U-17)

### 🏆 Torneos Ganados (3)
- Campeonato Regional U-14 2024
- Copa Interna 2025 (U-17)
- Torneo Clasificatorio 2024 (U-14)

### 📅 Torneos Por Jugar (4)
- Copa Nacional 2026 (U-14)
- Torneo Sudamericano U-17
- Liga Regional 2026 (U-14 y U-17)
- Torneo Amistoso Fin de Año

## 🚀 Cómo ejecutar

### Opción 1: Ejecutar el seed directamente
```bash
npm run db:seed
```

### Opción 2: Ejecutar durante la migración (automático)
```bash
npx prisma migrate dev --name add_torneos_reference
```

### Opción 3: Ejecutar con el script de Prisma
```bash
npx prisma db seed
```

## ✅ Lo que hará el script

1. ✓ Elimina torneos existentes (limpia la tabla)
2. ✓ Crea 4 torneos jugados con información completa
3. ✓ Crea 3 torneos ganados con detalles
4. ✓ Crea 4 torneos por jugar con fechas futuras
5. ✓ Muestra resumen de torneos creados

## 📊 Resultado esperado

Cuando ejecutes el seed verás:

```
🌱 Sembrando torneos de referencia...

📝 Creando torneos jugados...
  ✓ Copa Metro 2025
  ✓ Torneo Intercolegial 2025
  ✓ Liga Regional 2025
  ✓ Torneo Amistoso Internacional

🏆 Creando torneos ganados...
  ✓ Campeonato Regional U-14 2024
  ✓ Copa Interna 2025
  ✓ Torneo Clasificatorio 2024

📅 Creando torneos por jugar...
  ✓ Copa Nacional 2026
  ✓ Torneo Sudamericano U-17
  ✓ Liga Regional 2026
  ✓ Torneo Amistoso Fin de Año

✅ Base de datos sembrada exitosamente!
Total: 11 torneos creados
```

## 🔄 Información de cada torneo

Cada torneo incluye:
- ✅ Nombre descriptivo
- ✅ Descripción del evento
- ✅ Programación con resultados o fechas
- ✅ Sede/localización
- ✅ Categoría (U-14, U-17, etc.)
- ✅ Rival/Rivales
- ✅ Imagen (default: /brand/hero-training.jpg)
- ✅ Fechas inicio y fin
- ✅ Estado (played, won, future)
- ✅ Publicado (visible en web)

## 💡 Notas importantes

- **Primero ejecuta la migración:** `npx prisma migrate dev --name add_torneo_actual`
- **Luego ejecuta el seed:** `npm run db:seed`
- **Los torneos se visualizarán en:** `/torneos`
- **Solo visitantes:** Verán todos los torneos publicados
- **Administradores:** Pueden editar, crear más o eliminar torneos

## 🗑️ Limpiar base de datos

Si necesitas limpiar y empezar de nuevo:

```bash
# Resetea la BD completamente
npx prisma migrate reset

# O solo elimina torneos
npx prisma db execute --stdin < scripts/clean-tournaments.sql
```

## 📍 Archivos relacionados

- **Script:** `prisma/seed.ts`
- **Config:** `.prismarc.json`
- **Comando:** `npm run db:seed`
- **Schema:** `prisma/schema.prisma`

---

**Fecha:** 5 de junio de 2026
**Total torneos:** 11
**Categorías:** U-14, U-17, Mixtas
