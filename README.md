# peliflix

Aplicación web de películas con Express, EJS y PostgreSQL. Incluye rutas y vistas de películas, usuarios, perfiles y favoritos.

## Estructura

- [src](src)

## Preparación y uso

Requiere PostgreSQL y las variables de conexión usadas en `src/api/database/index.js`. Define `PORT` o `DEVPORT` para el servidor. El repositorio no contiene una migración SQL completa que permita asegurar la creación automática de la base.

### Raíz del repositorio

Requiere Node.js. Este paquete no fija una versión del runtime; valida compatibilidad con las dependencias antes de actualizarlo.

```sh
npm ci
npm run dev
```

Comandos declarados en [package.json](package.json):

| Comando | Acción |
| --- | --- |
| `npm run dev` | `nodemon src/app.js` |
| `npm run start` | `node src/app.js` |

## Configuración detectada en el código

Estas son referencias explícitas a variables de entorno, no una garantía de que toda la configuración esté externalizada. Los nombres y archivos permiten localizar dónde se usan; los valores deben corresponder a tu entorno.

| Variable | Referencia |
| --- | --- |
| `DATABASE` | [src/api/database/index.js](src/api/database/index.js) |
| `DATABASEPORT` | [src/api/database/index.js](src/api/database/index.js) |
| `DEVPORT` | [src/app.js](src/app.js) |
| `HOST` | [src/api/database/index.js](src/api/database/index.js) |
| `PASSWORD` | [src/api/database/index.js](src/api/database/index.js) |
| `PORT` | [src/app.js](src/app.js) |
| `USER` | [src/api/database/index.js](src/api/database/index.js) |

No guardes credenciales reales en la documentación. Si hay `.env.example`, úsalo como referencia y revisa cómo carga la configuración el punto de entrada.

## Validación y estado

Esta guía se contrastó con el árbol de archivos y los manifiestos del repositorio. No se ha validado una ejecución completa contra servicios externos, bases de datos o hardware. Las versiones y los scripts mostrados describen el código actual; no implican que sus dependencias antiguas sigan siendo compatibles.
