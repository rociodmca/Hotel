# Design

<!-- impeccable:design-schema 1 -->

Sistema visual de la web de **Hotel El Tormo**. Extensión del mundo ya establecido en el código
(verde bosque, rural y premium), documentado tras la mejora de la landing.

## World

La Serranía de Cuenca al atardecer como única vecina. Luz cálida y natural, materiales nobles
(madera, piedra, lana), y la sierra enmarcada por la arquitectura de la página. El verde bosque
es el campo dominante; el barro/ocre aporta el calor del paisaje castellano.

## Color

Estrategia: **committed**. El verde bosque (`brand-900`) posee regiones enteras (sección de reserva,
footer); el barro (`clay-600`) es el único acento de acción (CTAs, selección, foco).

| Rol | Token | Hex | Uso |
| --- | --- | --- | --- |
| Campo profundo | `brand-900` | `#1f321e` | Fondo de reserva y footer |
| Campo | `brand-700` | `#2d4a2b` | Logo, texto fuerte sobre claro |
| Texto sobre claro | `brand-800` | `#263c24` | Títulos |
| Texto secundario | `brand-600` | `#385d35` | Cuerpo |
| Borde suave | `brand-200` | `#c2d6bf` | Bordes de campos y divisores |
| Superficie clara | `brand-50` | `#f2f6f1` | Etiquetas, chips |
| Acento de acción | `clay-600` | `#a8582a` | CTA principal, selección, foco |
| Acento hover | `clay-500` | `#c26f34` | Hover del CTA |
| Fondo papel | `paper` | `#faf7f0` | Fondo general de página |

## Typography

- **Display:** Bitter (slab serif, autohospedada), pesos 500-700. Títulos con `tracking-tightest`
  (`-0.045em`) y `text-wrap: balance`. Da carácter de patrimonio rural sin caer en el serif de libro.
- **Cuerpo:** Work Sans, pesos 400-600, `text-wrap: pretty`. Humanista y legible en móvil.
- Escala: hero `clamp(2.5rem, 7vw, 4.5rem)`, sección `2.5-3rem`, títulos de tarjeta `1.25rem`.

## Space & Layout

- Ancho de contenido `max-w-6xl`, padding horizontal `px-5`.
- Ritmo vertical por sección `py-20` (hero `min-h-[88vh]`, beneficios `py-14`, cierre `py-14`).
- Más aire sobre un título que debajo: `mt-3`/`mt-4` entre título y subtítulo.
- Cuadrículas: habitaciones `3/2/1`, guía `3/1`, beneficios `4/2`.

## Surfaces

- Tarjetas: `rounded-2xl`, `shadow-soft` → `shadow-lift` en hover, `ring-1 ring-brand-800/5`.
- Campos: `.field` (`rounded-lg`, borde `brand-200`, foco `brand-500` + ring suave).
- Botones: `.btn-primary` (barro, `rounded-full`), `.btn-ghost` (contorno verde).
- Estados del navegador tematizados: `::selection` en barro, foco `2px clay` con offset,
  scrollbar verde sobre `brand-100`, `caret-color` en barro.

## Motion

Un único momento orquestado: `ken-burns` (zoom lento) en la imagen del hero y `fade-rise`
escalonado en hero y CTA. Todo con `prefers-reduced-motion` desactivado. Curvas
`cubic-bezier(0.22, 1, 0.36, 1)` (exponential ease-out).

## Imagery

Ilustraciones SVG locales en `/public/images/` (sin fotografía real todavía): paisaje de la sierra
y una escena por habitación y por punto turístico, todas en la paleta de marca. Deben reemplazarse
por fotografía real del hotel cuando exista; etiquetadas como relleno en PRODUCT.md.

## Accessibility

Objetivo WCAG AA. Un solo `<h1>`, jerarquía de encabezados correcta, `alt` en todas las imágenes,
`aria-label` en navegación e iconos, `role="status"` en mensajes de formulario, foco visible.

## Surfaces

Cuatro superficies comparten el mismo mundo:

- **Landing** (`/`) — *Persuade*. Hero a pantalla completa, beneficios, habitaciones, disponibilidad, reserva y guía.
- **Check-in** (`/checkin`) — *Operate*. Dos columnas: contexto y pasos a la izquierda, formulario a la derecha.
- **Acceso** (`/admin/login`) — *Operate*. Tarjeta centrada, un único campo y acción principal. `noindex`.
- **Backoffice** (`/admin`) — *Operate*, code-led. Tablas densas y escaneables, cifras con `tabular-nums`,
  estados como badges de color (barro = pendiente, verde = confirmado), habitaciones con punto de estado.
- Formularios y tablas usan las mismas clases (`.field`, `.btn-primary`) y los mismos tokens.

## Backoffice auth

El panel se protege con una contraseña (`ADMIN_PASSWORD`) y una sesión firmada con HMAC-SHA256
(`ADMIN_SESSION_SECRET`) guardada en la cookie `el-tormo-admin` (httpOnly, SameSite=Lax, 12 h).
`src/middleware.ts` intercepta `/admin/*` y `/api/admin/*`; sin sesión válida redirige (307) a
`/admin/login?next=…` o devuelve 401 en las rutas de API. `login` y `logout` están exentos.

## Gestión de estados de reserva

El personal cambia el estado desde `/admin` con botones inline (`BookingActions`), que llaman a
`PATCH /api/admin/bookings/[id]`. Las transiciones permitidas viven en `src/lib/booking-status.ts`:

```
PENDING ──► CONFIRMED ──► CHECKED_IN ──► CHECKED_OUT
   │            │
   └────────────┴──► CANCELLED
```

`CHECKED_OUT` y `CANCELLED` son terminales. Una transición no permitida devuelve **409** con el
motivo. El listado se filtra con las pestañas `?status=` (Todas / Pendiente / Confirmada / En casa /
Finalizada / Cancelada) usando `Link`, sin estado de cliente.

## Availability calendar

Semáforo de ocupación por día, calculado en `GET /api/availability` a partir de las reservas
(`PENDING`, `CONFIRMED`, `CHECKED_IN`) frente al total de habitaciones:

| Estado | Umbral | Color |
| --- | --- | --- |
| Disponible | libres > 34 % del total | `brand-400` (verde) |
| Últimas habitaciones | libres ≤ 34 % | `clay-300` (naranja) |
| Completo | 0 libres | `clay-600` (rojo) |

Días pasados en gris claro y no seleccionables; los completos tampoco. Día seleccionado con anillo
`ring-2` en su tono. Se usa para orientar la reserva, no para bloquear fechas por habitación.

