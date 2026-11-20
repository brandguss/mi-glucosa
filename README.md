# Mi Glucosa

App web instalable (PWA) para registrar lecturas de glucosa (manuales o del sensor Dexcom / FreeStyle Libre), llevar el control de medicamentos, ver gráficas y recibir recomendaciones diarias basadas en las lecturas.

## Funciones

- Registro de glucosa con momento del día (ayunas, antes/después de comer, antes de dormir, sensor).
- Importación de CSV de **Dexcom Clarity** y **LibreView** (detecta columnas, fechas y mmol/L).
- Recomendaciones del día por reglas: hipoglucemia (regla 15-15), glucosa alta, promedio de 3 días, ayuno alto, subidas después de comer, medicamentos pendientes.
- Plan de comida del día (qué preferir y qué evitar).
- Gráficas: tendencia con rango 70–180, tiempo en rango, A1c estimada (GMI), promedio por hora del día y promedio diario.
- Medicamentos con casilla diaria de "tomado".
- Reporte de 14 días para el médico y respaldo/restauración en JSON.
- Funciona sin internet (service worker) y se instala en la pantalla de inicio.

## Modos de guardado

| Modo | Cuándo | Dónde se guardan los datos |
|---|---|---|
| Local | `firebase-config.js` con `apiKey` vacío | Solo en el navegador del dispositivo |
| Cuenta | `firebase-config.js` con la configuración de Firebase | Firestore, sincronizado entre dispositivos, con inicio de sesión |

Al iniciar sesión por primera vez, los datos del modo local se suben automáticamente a la cuenta.

## Activar inicio de sesión con Firebase (gratis)

1. Entra a https://console.firebase.google.com y crea un proyecto llamado `mi-glucosa` (puedes desactivar Google Analytics).
2. **Build → Authentication → Get started** y habilita los proveedores **Email/Password** y **Google**.
3. **Authentication → Settings → Authorized domains → Add domain**: `brandguss.github.io`.
4. **Build → Firestore Database → Create database**, en modo producción, región `us-central1` (o la más cercana).
5. En **Firestore → Rules**, pega el contenido de `firestore.rules` y publica.
6. **Project settings (engrane) → Your apps → Web (`</>`)**, registra la app y copia el objeto `firebaseConfig`.
7. Pega esos valores en `firebase-config.js`, sube el cambio y cambia `CACHE` en `sw.js` (por ejemplo a `mi-glucosa-v2`).

## Instalar en el celular

- **iPhone:** abre el link en Safari → Compartir → Agregar a pantalla de inicio.
- **Android:** abre el link en Chrome → menú ⋮ → Instalar app.

## Aviso

La app da orientación general basada en las lecturas y en guías de diabetes; no sustituye la atención médica ni indica suspender o cambiar medicamentos.
