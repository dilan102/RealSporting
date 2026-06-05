## 📋 Sección "Torneo Actual" - Guía de Implementación

### 🎯 Descripción General

Se ha agregado una nueva sección llamada **"Torneo Actual"** a la página de Torneos que permite:

✅ **Para visitantes:**
- Ver el torneo en disputa del club de forma destacada
- Acceso a información completa: fechas, sede, categoría, rival
- Visualización de galería de imágenes
- Información de programación de juegos

✅ **Para administradores:**
- Crear un nuevo torneo actual
- Editar torneo actual existente
- Agregar/eliminar imágenes
- Publicar o guardar como borrador
- Eliminar el torneo actual

---

## 📁 Archivos Creados

### 1. **Prisma Schema** (`prisma/schema.prisma`)
```prisma
model TorneoActual {
  id           Int      @id @default(autoincrement())
  nombre       String
  descripcion  String
  programacion String   @default("")
  sede         String   @default("")
  categoria    String   @default("")
  rival        String   @default("")
  imagen       String?
  imagenes     String[] @default([])
  fechaInicio  DateTime @default(now())
  fechaFin     DateTime?
  publicado    Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @default(now()) @updatedAt
}
```

### 2. **Store** (`lib/current-tournament-store.ts`)
- `readCurrentTournament()` - Obtiene el torneo actual publicado
- `readAllCurrentTournaments()` - Obtiene todos los torneos actuales
- `createCurrentTournament()` - Crea un nuevo torneo actual
- `updateCurrentTournament()` - Actualiza torneo actual
- `deleteCurrentTournament()` - Elimina torneo actual

### 3. **Componentes**
- **CurrentTournamentCard** (`components/tournaments/CurrentTournamentCard.tsx`)
  - Card visual para mostrar torneo actual
  - Incluye galería de imágenes
  - Botones de editar/borrar en modo admin

- **CurrentTournamentManager** (`components/tournaments/CurrentTournamentManager.tsx`)
  - Formulario para crear/editar torneo actual
  - Carga de imágenes principales
  - Gestión de múltiples imágenes en galería
  - Vista previa en tiempo real

### 4. **API** (`app/api/current-tournament/route.ts`)
- `GET` - Obtiene torneo actual
- `POST` - Crea nuevo torneo actual
- `PUT` - Actualiza torneo actual
- `DELETE` - Elimina torneo actual

### 5. **Página Actualizada** (`app/torneos/page.tsx`)
- Nueva sección "Torneo Actual" mostrada con ícono de Zap (⚡)
- Integración con administrador para gestionar torneo actual

---

## 🎨 Estructura Visual

### En modo visitante:

```
┌─────────────────────────────────────────────────────┐
│  TORNEOS                                            │
│  Programación competitiva, resultados...            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ⚡ EN VIVO                                         │
│  TORNEO ACTUAL                                      │
│  Competencia en disputa donde participa el club...  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ [Imagen del torneo]        ⚡ EN JUEGO       │  │
│  └──────────────────────────────────────────────┘  │
│  • 📅 Fechas                                       │
│  • 🛡️ Categoría                                   │
│  • 📍 Sede                                         │
│  • 👥 Rival                                        │
│                                                      │
│  PROGRAMACIÓN                                       │
│  Horarios de juegos...                             │
│                                                      │
│  GALERÍA (3 imágenes)                              │
│  [Img] [Img] [Img]                                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  TORNEOS JUGADOS                                    │
│  Participaciones finalizadas...                     │
│  [Card] [Card] [Card]                              │
└─────────────────────────────────────────────────────┘
```

### En modo administrador (sección)

```
┌──────────────────────────────────────┐
│ 👨‍💼 ADMINISTRADOR                       │
│ SUBIR PROGRAMACIÓN                    │
│                                        │
│ TORNEO ACTUAL                          │
│ ┌──────────────────────────────────┐ │
│ │ [Preview del torneo actual]      │ │
│ │ [Botón Editar] [Botón Borrar]   │ │
│ └──────────────────────────────────┘ │
│                                        │
│ [Formulario de edición]                │
│ - Nombre: _________________           │
│ - Descripción: _________________      │
│ - Categoría: ________  Rival: _____   │
│ - Sede: ________  Programación: ___   │
│ - Fecha inicio: ____  Fin: ____       │
│ - Visibilidad: [Borrador ▼]          │
│ - Imagen: [Cargar archivo]            │
│ [Guardar torneo] [Limpiar]           │
│                                        │
│ OTROS TORNEOS                          │
│ [Formulario para otros torneos...]     │
└──────────────────────────────────────┘
```

---

## 📊 Ejemplo de Datos

### Torneo Actual Ejemplo:

```json
{
  "id": "1",
  "name": "Copa Regional 2026",
  "description": "Competencia regional donde el club Real Sporting participa con categorías U-14 y U-17",
  "schedule": "Grupo A - 15:00 vs Deportivo Nacional\nGrupo A - 17:30 vs Academia del Valle\nSemifinales - 19:00 vs Clasificado",
  "venue": "Estadio El Campín, Bogotá",
  "category": "U-14 y U-17",
  "opponent": "Deportivo Nacional (Próximo)",
  "image": "/uploads/tournaments/copa-regional-2026.jpg",
  "images": [
    "/uploads/tournaments/copa-regional-foto-1.jpg",
    "/uploads/tournaments/copa-regional-foto-2.jpg",
    "/uploads/tournaments/copa-regional-foto-3.jpg"
  ],
  "startDate": "2026-06-15",
  "endDate": "2026-06-28",
  "visibility": "published"
}
```

---

## 🚀 Cómo Usar

### Para Administrador:

1. **Crear Torneo Actual:**
   - Ir a "Torneos" → Sección "Administrador"
   - Llenar el formulario de "Torneo Actual"
   - Cargar imagen principal
   - Hacer clic en "Guardar torneo"

2. **Editar Torneo Actual:**
   - Hacer clic en botón "Editar" en la tarjeta
   - Modificar los datos
   - Hacer clic en "Guardar torneo"

3. **Agregar Imágenes a Galería:**
   - En el formulario de edición
   - Las imágenes se almacenan en el array `images`

4. **Eliminar:**
   - Hacer clic en botón "Borrar"
   - Se eliminará toda la información

---

## 🔐 Funcionalidades de Seguridad

✅ Solo administradores autenticados pueden:
- Crear torneos actuales
- Editar torneos actuales  
- Eliminar torneos actuales

✅ Validaciones:
- Campos requeridos: nombre, descripción, fechas
- Tipos de imagen: JPEG, PNG, WebP, SVG
- Tamaño máximo de imagen: 5MB
- Sanitización de texto para prevenir inyecciones

---

## 🔄 Flujo de Datos

```
Frontend (CurrentTournamentManager)
         ↓
    API POST/PUT/DELETE
         ↓
API Route Handler (route.ts)
         ↓
Store (current-tournament-store.ts)
         ↓
Prisma Client
         ↓
PostgreSQL Database (TorneoActual)
```

---

## 📝 Pasos Siguientes (Migraciones)

Para que todo funcione, necesitas ejecutar:

```bash
npx prisma migrate dev --name add_torneo_actual
```

Esto creará la tabla `TorneoActual` en tu base de datos PostgreSQL.

---

## ✨ Características Destacadas

🎯 **Torneo en Vivo:**
- Indicador visual con animación (⚡ En juego)
- Posición prioritaria en la página
- Fácil acceso para visitantes

📸 **Galería de Imágenes:**
- Múltiples imágenes del evento
- Vista previa en administrador
- Almacenamiento eficiente

⚡ **Administración Intuitiva:**
- Formulario fácil de usar
- Vista previa en tiempo real
- Botones de acción claros

🔍 **Visibilidad Flexible:**
- Publicado/Borrador
- Solo admins ven borradores
- Cambio rápido de estado

