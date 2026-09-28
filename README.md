# Wilver Meraz — Portafolio

Portafolio personal con temática astronómica: educación, experiencia y proyectos
(CAELUM, Stratum, Leal Café), con demos interactivas de cada uno.

- **Loader:** la constelación de Casiopea (la «W») se enciende estrella por estrella
  y vuela hasta convertirse en el logo del nav.
- **Hero:** un planeta con anillos cuya cara iluminada sigue al cursor («tu cursor es el sol»).
- **Cielo:** canvas con 3 capas de paralaje, parpadeo y estrellas fugaces; el tono
  cambia según el proyecto en pantalla.
- **Demos:** motor de precios de CAELUM, simulación fog‑to‑cloud de Stratum
  (corta el internet y mira la cola en el ESP32) y la tarjeta de lealtad de Leal Café.
- **Pie de página:** hora local de Guasave y la fase lunar real del día.
- Bilingüe (ES/EN), accesible (`prefers-reduced-motion`, `prefers-reduced-transparency`,
  `prefers-contrast`, navegación por teclado) y responsive.

## Stack

React 19 · TypeScript · Vite · Motion (`motion/react`) · Lenis · Canvas 2D · CSS moderno
(`@property`, `color-mix`, `backdrop-filter`). Las fuentes (Fraunces, Geist) van
empaquetadas: el sitio no hace peticiones externas.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # genera dist/
npm run preview   # sirve dist/ en http://localhost:4173
```

## Editar el contenido

Todo el texto está en [`src/content.ts`](src/content.ts), en español e inglés.
Si falta una clave en inglés, TypeScript marca el error al compilar.

Pendientes:
- `Leal-Cafe` es privado, así que la tarjeta muestra «Repositorio privado».
  Cuando lo hagas público, cambia `repoPrivate: true` a `false` (en ambos idiomas).
- Si quieres mostrar fechas de graduación, edita `period` en `journey.items`.

## Compartir

### 1. Red privada con Tailscale

```bash
npm run serve:tailnet            # build + preview en el puerto 4173
tailscale serve --bg 4173        # HTTPS solo dentro de tu tailnet
tailscale serve status           # muestra la URL: https://<equipo>.<tailnet>.ts.net
```

Tus compañeros (en la misma tailnet) abren esa URL. También funciona
`http://<IP-100.x.y.z>:4173`, pero con HTTPS el botón «Copiar correo» sí puede
usar el portapapeles.

Para exponerlo públicamente desde tu máquina: `tailscale funnel --bg 4173`.
Para dejar de compartir: `tailscale serve reset`.

### 2. GitHub Pages

1. Sube el repositorio a GitHub.
2. *Settings → Pages → Source:* **GitHub Actions**.
3. Cada push a `main` ejecuta [`deploy.yml`](.github/workflows/deploy.yml) y publica en
   `https://<usuario>.github.io/<repo>/`.

### 3. Vercel

Importa el repo en vercel.com (detecta Vite automáticamente) o ejecuta `vercel`
desde esta carpeta. No requiere configuración extra.

> El build usa `base: './'`, así que el mismo `dist/` funciona en Vercel (raíz),
> GitHub Pages (subruta `/<repo>/`) y Tailscale.
