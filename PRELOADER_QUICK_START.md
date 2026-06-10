# 🚀 Guía de Inicio Rápido - Sistema de Preloader Profesional

**Estado:** ✅ Implementado y probado | Compilación exitosa

---

## ¿Qué Se Ha Implementado?

Un sistema profesional de preloader que:

1. **Muestra SOLO el preloader** durante la carga inicial
2. **Espera eventos críticos** antes de mostrar el contenido:
   - Fuentes cargadas (`document.fonts.ready`)
   - Imágenes críticas cargadas
   - Componente Hero renderizado
3. **Bloquea el scroll** completamente mientras carga
4. **Se desvanece suavemente** (fade-out 500ms) cuando está listo
5. **Adapta el contenido** según el rendimiento del dispositivo

---

## Archivos Creados/Modificados

### ✨ Archivos Nuevos (7 archivos)

```
contexts/LoadingContext.tsx
components/providers/LoadingInitializer.tsx
components/providers/MainContentRenderer.tsx
hooks/useLoading.ts
hooks/usePerformance.ts
PRELOADER_PROFESSIONAL_GUIDE.md
PRELOADER_IMPLEMENTATION_SUMMARY.md
```

### ✅ Archivos Modificados (5 archivos)

```
app/layout.tsx                    (Estructura principal)
components/ui/PagePreloader.tsx   (Preloader mejorado)
components/ui/StarField.tsx       (Optimizado)
components/home/Hero.tsx          (Integración)
package.json                      (Dependencias)
```

---

## Cómo Probarlo

### 1. **Build & Test**

```bash
# Compilar el proyecto
npm run build

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000
```

### 2. **Ver el Preloader en Acción**

```bash
# Hard refresh para ver preloader (Ctrl+Shift+R en Windows/Linux, Cmd+Shift+R en Mac)
# O limpia caché del navegador antes de recargar
```

### 3. **Verificar en Móvil**

```bash
# El preloader también se verá en móviles
# Menos estrellas renderizadas (mejor rendimiento)
```

---

## ¿Cómo Funciona?

### El Ciclo de Vida Completo

```
[PASO 1] Usuario carga página
         ↓
[PASO 2] LoadingProvider se monta
         ├─ isPreloaderVisible = true
         └─ Bloquea scroll
         ↓
[PASO 3] Solo PagePreloader renderiza
         ├─ Animación "SPORTING"
         └─ Resto de componentes = null
         ↓
[PASO 4] LoadingInitializer monitoriza:
         ├─ document.fonts.ready ✓
         ├─ Imagen del Hero cargada ✓
         └─ Hero renderizado ✓
         ↓
[PASO 5] Cuando TODO está listo:
         ├─ allResourcesReady = true
         └─ Inicia fade-out
         ↓
[PASO 6] Después de 500ms:
         ├─ setIsPreloaderVisible = false
         ├─ Desbloquea scroll
         └─ MainContentRenderer libera contenido
         ↓
[PASO 7] Renders ahora sí:
         ├─ Navbar
         ├─ Hero (completo)
         ├─ StarField
         ├─ Footer
         └─ Todas las animaciones
         ↓
         ✨ PÁGINA LISTA ✨
```

---

## Hooks Disponibles para Usar

### En Tus Componentes

```typescript
// Obtener estado de carga
import { useLoading } from '@/contexts/LoadingContext';

const MyComponent = () => {
  const { isLoading, allResourcesReady } = useLoading();
  
  return isLoading ? <Skeleton /> : <Content />;
};

// Marcar tu componente como crítico
import { useHeroReady } from '@/hooks/useLoading';

const MyCriticalComponent = () => {
  useHeroReady(); // ← Dice al preloader que esto está listo
  return <div>...</div>;
};

// Monitorizar imágenes críticas
import { useCriticalImage } from '@/hooks/useLoading';

const MyImageComponent = () => {
  useCriticalImage('my-image');
  
  return <Image data-critical-image="my-image" src="..." />;
};
```

---

## Configuración

### Ajustar el Número de Estrellas

Edita en `hooks/usePerformance.ts`:

```typescript
export function useOptimalStarCount() {
  const isLowPerformance = usePerformanceMode();
  // Cambiar números aquí:
  return isLowPerformance ? 20 : 80;
  //                        ↑   ↑
  //                      móvil desktop
}
```

### Ajustar Tiempo de Fade-Out

Edita en `contexts/LoadingContext.tsx`:

```typescript
useEffect(() => {
  if (allResourcesReady && isLoading) {
    setIsPreloaderFading(true);
    // Cambiar 500 a otro valor (en ms):
    setTimeout(() => {
      setIsPreloaderVisible(false);
    }, 500);  // ← Duración del fade
  }
}, [allResourcesReady, isLoading]);
```

---

## Monitoreo de Rendimiento

### Ver Métricas en Console

```javascript
// Abre la consola del navegador (F12) y copia esto:

// Medir tiempo hasta que preloader desaparece:
window.preloaderStartTime = performance.now();

// Luego cuando el preloader desaparece, en consola:
const duration = performance.now() - window.preloaderStartTime;
console.log(`Preloader duró: ${duration.toFixed(0)}ms`);

// Ideal: 800-1500ms
```

### Monitorear en DevTools

1. Abre DevTools (F12)
2. Ve a la pestaña **Performance**
3. Haz hard refresh (Ctrl+Shift+R)
4. Detén la grabación cuando veas el contenido
5. Busca en la grabación cuándo desaparece el preloader

---

## Checklist Final

Verifica que funcione correctamente:

- [ ] **Hard refresh**: Ves el preloader
- [ ] **Scroll bloqueado**: No puedes scrollear mientras carga
- [ ] **Fade suave**: Preloader desaparece con transición
- [ ] **Contenido listo**: Todo se ve completo después
- [ ] **StarField visible**: Aparece después del preloader
- [ ] **Móvil**: Preloader se ve bien en teléfono
- [ ] **Navegación**: No muestra preloader en cambios de ruta
- [ ] **Build**: `npm run build` sin errores
- [ ] **Dev server**: `npm run dev` funciona
- [ ] **No console errors**: F12 → Console está limpia

---

## Solución de Problemas

### ❌ "Preloader nunca desaparece"

**Checklist:**

```typescript
// 1. ¿LoadingInitializer está en el layout?
✓ app/layout.tsx tiene <LoadingInitializer />

// 2. ¿Hero usa useHeroReady()?
✓ components/home/Hero.tsx tiene useHeroReady()

// 3. ¿Imagen tiene atributo?
✓ <Image data-critical-image="hero-image" ... />

// 4. ¿document.fonts está listo?
// En console:
document.fonts.ready.then(() => console.log('Fonts ready'))
```

### ❌ "Veo contenido detrás del preloader"

**Checklist:**

```typescript
// 1. ¿PagePreloader tiene z-index correcto?
✓ z-index: 999999

// 2. ¿Position correcto?
✓ position: fixed; inset: 0;

// 3. ¿Ancho y alto correctos?
✓ width: 100vw; height: 100vh;

// 4. ¿MainContentRenderer funciona?
✓ No renderiza nada mientras isPreloaderVisible=true
```

### ❌ "Scroll no está bloqueado"

**Solución:**

```typescript
// En console:
document.body.style.overflow
// Debe mostrar: "hidden"

// Si no, forza:
document.body.style.overflow = 'hidden'
```

---

## Próximas Mejoras Opcionales

1. **Mostrar progreso**
   ```typescript
   // En PagePreloader, agregar:
   <ProgressBar progress={(loadedResources / totalResources) * 100} />
   ```

2. **Analytics de carga**
   ```typescript
   // Trackear tiempos:
   console.log('Fonts loaded: ', fontLoadTime);
   console.log('Images loaded: ', imageLoadTime);
   console.log('Total preload: ', totalTime);
   ```

3. **Diferente preloader por ruta**
   ```typescript
   // Si /admin tiene su propio preloader
   // Crea LoadingProvider específico por ruta
   ```

4. **Mostrar preloader en navegación lenta**
   ```typescript
   // Agregar lógica para mostrar preloader
   // cuando la navegación es lenta entre rutas
   ```

---

## Documentación Completa

Para entender más profundamente cómo funciona, lee:

📖 **[PRELOADER_PROFESSIONAL_GUIDE.md](./PRELOADER_PROFESSIONAL_GUIDE.md)**  
- Arquitectura completa
- Flujo de datos
- Troubleshooting detallado
- Casos de uso

📋 **[PRELOADER_IMPLEMENTATION_SUMMARY.md](./PRELOADER_IMPLEMENTATION_SUMMARY.md)**  
- Cambios realizados
- Comparación antes/después
- Estructura de archivos

---

## Soporte Técnico

Si algo no funciona:

1. **Verifica la consola** (F12 → Console)
2. **Revisa los logs** en terminal
3. **Haz hard refresh** (Ctrl+Shift+R)
4. **Limpia node_modules** y reinstala:
   ```bash
   rm -rf node_modules
   npm install
   npm run build
   ```

---

## Métricas de Éxito

Después de implementar, esperas:

| Métrica | Valor |
|---------|-------|
| Preloader duration | 800-1500ms |
| No content shift (CLS) | < 0.1 |
| First paint | Instant (preloader) |
| Main content paint | 1-2s después |
| Mobile stars | 20 (vs 80) |
| Build size | Sin cambios |

---

## ¡Listo para Usar!

El sistema está completamente implementado y listo para usar.

✅ Compila sin errores  
✅ Incluye toda la lógica de carga  
✅ Optimizado para móviles  
✅ Documentado completamente  

**Disfruta de tu preloader profesional!** 🚀

---

**Sistema implementado:** 10 de junio de 2026  
**Por:** GitHub Copilot  
**Versión:** 1.0.0

