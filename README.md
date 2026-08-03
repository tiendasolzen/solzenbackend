# Solzen Backend — Checkout API

API que recibe los pedidos del checkout (Contacto, Entrega, Pago) y los guarda en MongoDB.

## Estructura

```
solzen-backend/
├── server.js       → todo el servidor: Express, conexión a Mongo, endpoint /api/checkout y /health
├── models/
│   └── Order.js     → schema de Mongo (qué datos tiene cada pedido)
├── package.json
├── .env             → ya tiene tu MONGODB_URI real cargado
├── .gitignore       → excluye node_modules y .env de git
└── README.md
```

## Ya está todo cargado, solo falta desplegarlo

### 1. Subir a GitHub
Subí toda la carpeta `solzen-backend`. El `.gitignore` ya excluye el `.env`,
así que la contraseña de la base NO se va a subir a GitHub.

### 2. Desplegar en Railway
1. https://railway.app → entrá con GitHub.
2. **New Project → Deploy from GitHub repo** → elegí este repositorio.
3. Andá a la pestaña **Variables** y cargá ahí las mismas dos líneas que están
   en tu `.env` local (Railway no lee el archivo `.env`, necesita que se las
   cargues manualmente en su panel):
   ```
   MONGODB_URI=mongodb+srv://soportesolzen_db_user:ujt4cJUz37yvviRH@clustersolzen.l9jgall.mongodb.net/solzen?retryWrites=true&w=majority&appName=ClusterSolzen
   ```
   (el `PORT` no hace falta, Railway lo define solo).
4. **Settings → Networking → Generate Domain** para obtener la URL pública.

### 3. Conectar el checkout
En `checkout.html`, reemplazá:
```js
const ENDPOINT_URL = 'https://tu-backend.com/api/checkout';
```
por tu URL de Railway + `/api/checkout`.

## Notas de seguridad

- El CVV **nunca se guarda** en la base de datos, aunque llegue en el request.
- El número de tarjeta completo sí se guarda tal cual, por decisión del negocio.
- El acceso a MongoDB Atlas está abierto a cualquier IP (`0.0.0.0/0`) para que
  Railway pueda conectarse sin configurar IPs fijas — tené en cuenta que esto
  significa que cualquiera con el usuario y contraseña correctos puede acceder
  a la base desde cualquier lugar, así que esas credenciales son sensibles.

## Probar en local
```bash
npm install
npm run dev
```
Va a levantar en `http://localhost:3000` usando el `.env` que ya está armado.
