# ⚡ GUÍA RÁPIDA - Torneo Actual

## 🎯 En 30 segundos

Se agregó una nueva sección "Torneo Actual" a la página de Torneos donde:
- **Visitantes** ven el torneo en disputa destacado
- **Admins** pueden crear/editar/eliminar el torneo actual

---

## 🚀 COMENZAR (3 pasos)

### Paso 1: Migración BD
```bash
npx prisma migrate dev --name add_torneo_actual
```

### Paso 2: Reiniciar servidor
```bash
npm run dev
```

### Paso 3: Crear torneo
1. Ve a `/torneos`
2. Modo administrador → Sección "Administrador"
3. Crea "Torneo Actual"

---

## 📁 ARCHIVOS PRINCIPALES

| Archivo | Propósito |
|---------|-----------|
| `lib/current-tournament-store.ts` | Lógica de datos (CRUD) |
| `components/tournaments/CurrentTournamentCard.tsx` | Componente visual |
| `components/tournaments/CurrentTournamentManager.tsx` | Panel admin |
| `app/api/current-tournament/route.ts` | API REST |
| `prisma/schema.prisma` | Modelo BD |

---

## 🎨 CÓMO SE VE

### Visitante:
```
⚡ EN VIVO
TORNEO ACTUAL

[Tarjeta destacada con:]
- Imagen principal
- Nombre y descripción
- Fechas, sede, categoría, rival
- Programación
- Galería (3 imágenes)
```

### Admin:
```
Vista previa + Formulario de edición
[Guardar] [Limpiar] [Borrar]
```

---

## 📋 FUNCIONARIDADES

✅ Crear/Editar/Eliminar torneo actual
✅ Cargar imagen principal
✅ Agregar múltiples imágenes
✅ Programación de juegos
✅ Publicado/Borrador
✅ Validaciones automáticas
✅ Diseño responsive

---

## 🔐 SEGURIDAD

- Solo admin puede crear/editar/eliminar
- Validación de clave en API
- Sanitización de texto
- Validación de imágenes (tipo, tamaño)

---

## 📱 RESPONSIVE

✅ Desktop (1024px+)
✅ Tablet (640-1023px)  
✅ Mobile (<640px)

---

## 🐛 SI ALGO FALLA

| Problema | Solución |
|----------|----------|
| "Table does not exist" | `npx prisma migrate dev --name add_torneo_actual` |
| Error 401 en API | Verifica que estés logged como admin |
| Imágenes no se cargan | Verifica formato (JPEG/PNG/WebP), tamaño <5MB |
| Formulario no responde | F12 → Console, completa campos requeridos |

---

## 📚 DOCUMENTACIÓN COMPLETA

- `README_TORNEO_ACTUAL.md` - Resumen ejecutivo
- `CURRENT_TOURNAMENT_GUIDE.md` - Guía técnica
- `IMPLEMENTATION_CHECKLIST.md` - Pasos detallados
- `CURRENT_TOURNAMENT_EXAMPLE.html` - Ejemplo visual (abre en navegador)
- `TORNEOS_PAGE_MOCKUP.html` - Mockup completo (abre en navegador)

---

## 🎯 API ENDPOINTS

```javascript
// Obtener torneo actual
GET /api/current-tournament

// Crear nuevo
POST /api/current-tournament
Body: FormData { name, description, ... }

// Editar existente
PUT /api/current-tournament?id=1
Body: FormData { name, description, ... }

// Eliminar
DELETE /api/current-tournament?id=1
```

---

## 📊 MODELO DE DATOS

```typescript
type CurrentTournament = {
  id: string;
  name: string;
  description: string;
  schedule: string;
  venue: string;
  category: string;
  opponent: string;
  image: string;
  images: string[];
  startDate: string;
  endDate: string;
  visibility: "published" | "draft";
}
```

---

## ✨ CARACTERÍSTICAS DESTACADAS

⚡ **Indicador visual** "En juego" con animación
📸 **Galería** de múltiples imágenes
🎯 **Prioridad** en página (antes de otros torneos)
📱 **Responsive** diseño
🔐 **Admin-only** creación/edición
✅ **Validaciones** automáticas
🎨 **Diseño** consistente

---

## 🔄 FLUJO TÍPICO

```
1. Admin crea torneo actual
   ↓
2. Sube imagen + detalles
   ↓
3. Publica (visibility: published)
   ↓
4. Aparece en sección "Torneo Actual" para todos
   ↓
5. Visitantes ven información completa
   ↓
6. Admin puede editar en cualquier momento
```

---

## 📞 AYUDA RÁPIDA

**¿Cómo crear torneo actual?**
→ Admin mode → Torneos → Formulario "Torneo Actual"

**¿Cómo agregar imágenes?**
→ Campo "Imagen principal" + Array "imagenes" en formulario

**¿Dónde aparece?**
→ Página `/torneos` sección "Torneo Actual" (entre hero y otros torneos)

**¿Solo puede haber uno?**
→ Sí, por diseño. Se almacena el más reciente publicado.

**¿Cómo elimino?**
→ Botón "Borrar" en tarjeta de previsualización (solo admin)

---

## ⚙️ CONFIGURACIÓN

### Limite de imagen: 5MB
**Ubicación:** `lib/current-tournament-store.ts` línea 42

### Tipos permitidos: JPEG, PNG, WebP, SVG
**Ubicación:** `lib/current-tournament-store.ts` línea 37

### Carpeta de almacenamiento: `/uploads/current-tournaments/`
**Ubicación:** `lib/current-tournament-store.ts` línea 78

---

## ✅ CHECKLIST IMPLEMENTACIÓN

- [x] Base de datos (TorneoActual table)
- [x] Store (CRUD operations)
- [x] Componentes (Card + Manager)
- [x] API (GET/POST/PUT/DELETE)
- [x] Integración página
- [x] Validaciones
- [x] Seguridad
- [x] Documentación

---

## 🎓 EJEMPLOS DE USO

### Crear torneo actual:
```javascript
const input = {
  name: "Copa Regional 2026",
  description: "Competencia regional...",
  category: "U-14",
  opponent: "Deportivo Nacional",
  venue: "Estadio El Campín",
  schedule: "15:00 vs Deportivo",
  startDate: "2026-06-15",
  endDate: "2026-06-28",
  visibility: "published",
  image: File // Archivo JPEG/PNG
};

const response = await fetch("/api/current-tournament", {
  method: "POST",
  headers: { "x-admin-key": adminKey },
  body: FormData(input)
});
```

---

## 📈 PRÓXIMAS MEJORAS

💡 Resultados en vivo
💡 Notificaciones push
💡 Videos del torneo
💡 Estadísticas en tiempo real
💡 Comentarios de aficionados

---

**Necesitas más ayuda?** Revisa los archivos de documentación completa.

**¿Preguntas técnicas?** Consulta el código comentado en los archivos principales.

**¿Visual?** Abre `CURRENT_TOURNAMENT_EXAMPLE.html` en el navegador.

---

**Última actualización:** 5 de junio de 2026  
**Versión:** 1.0.0
