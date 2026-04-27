# Gestor de Tareas

Este proyecto es una aplicacion web pensada para organizar tareas de una forma simple, clara y rapida. La idea no fue hacer un sistema pesado ni lleno de pantallas innecesarias, sino una herramienta directa para crear tareas, ver su estado y darles seguimiento sin perder tiempo.

La aplicacion permite trabajar con un flujo muy sencillo:

- crear tareas nuevas
- ver todas las tareas cargadas
- cambiar su estado
- finalizar tareas
- eliminar tareas cuando ya no hacen falta

Cada tarea tiene una estructura basica pero util:

- `id`
- `title`
- `description`
- `estado`
- `crateAt`

Los estados que maneja actualmente son:

- `pendiente`
- `completado`
- `finalizado`

## Que puede hacer la aplicacion

La app esta pensada para que una persona pueda entrar, cargar una tarea en pocos segundos y entender rapidamente en que situacion esta cada pendiente.

Desde la interfaz se puede:

- crear una tarea con titulo, descripcion y estado inicial
- visualizar un resumen de tareas por estado
- ver el detalle de las tareas agrupadas
- marcar tareas como completadas
- finalizar tareas
- eliminar tareas finalizadas

La experiencia del frontend intenta mantenerse liviana, con una vista unica y un flujo simple, para que no haga falta aprender nada raro antes de usarla.

## Como esta organizada

El proyecto esta dividido en dos partes principales:

- `front/`: contiene la interfaz web
- `BACKEND/`: contiene la API y la logica de persistencia

El frontend se comunica con el backend mediante peticiones HTTP. El backend recibe las operaciones sobre tareas y decide donde guardarlas.

## Tecnologias usadas

### Frontend

Para la parte visual se uso:

- `Next.js`
- `React`
- `TypeScript`
- `Tailwind CSS`

Estas herramientas permiten construir una interfaz moderna, rapida y facil de mantener. Next.js organiza bien la aplicacion, React maneja la UI, TypeScript ayuda a evitar errores de datos y Tailwind hace mas agil el trabajo de estilos.

### Backend

Para la parte del servidor se uso:

- `Python`
- `FastAPI`
- `Pydantic`
- `Uvicorn`

Python se eligio por su claridad y facilidad para desarrollar logica de negocio. FastAPI se encarga de exponer los endpoints de la API, Pydantic valida la informacion que entra y sale, y Uvicorn levanta el servidor en desarrollo.

### Base de datos principal

La base principal del proyecto es:

- `Supabase`

Supabase se usa como almacenamiento principal de las tareas cuando esta disponible.

## Respaldo de base de datos con CSV

Una parte importante de este proyecto es que no depende solamente de la base principal para seguir funcionando.

Se implemento un sistema de respaldo para que, si Supabase no esta disponible, la aplicacion no quede inutilizada.

En ese caso, el backend cambia automaticamente a un archivo CSV que actua como base de datos secundaria.

Esto permite seguir haciendo las operaciones principales:

- crear tareas
- leer tareas
- filtrar tareas por estado
- actualizar tareas
- eliminar tareas

En otras palabras: si la base principal falla pero el backend sigue levantado, la aplicacion puede seguir trabajando.

## Como funciona ese respaldo

El backend intenta usar Supabase primero.

Si Supabase responde bien:

- las tareas se leen y se guardan en la base principal

Si Supabase no responde o no esta configurado:

- el backend usa el archivo CSV como respaldo

Ese archivo se crea automaticamente si no existe, y se guarda por defecto en:

- `BACKEND/tasks_backup.csv`

Tambien se puede cambiar su ubicacion con la variable de entorno:

- `TASKS_CSV_PATH`

Este respaldo fue pensado como una solucion simple pero confiable para no frenar el funcionamiento de la aplicacion por una caida de la base principal.

## API disponible

El backend expone endpoints para trabajar con tareas, por ejemplo:

- `GET /tasks`
- `GET /tasks/{id}`
- `POST /tasks`
- `PUT /tasks/{id}`
- `DELETE /tasks/{id}`

Tambien existe:

- `GET /health`

Ese endpoint permite ver si la API esta activa y que almacenamiento esta usando en ese momento:

- `supabase`
- `csv`

## Idea general del proyecto

Este gestor no busca competir con herramientas gigantes, sino resolver bien algo concreto: tener un lugar rapido para administrar tareas con una interfaz amigable y un backend que no se caiga a la primera complicacion.

Por eso el proyecto combina:

- una interfaz simple
- una API clara
- validacion de datos
- una base principal
- un respaldo automatico en CSV

Eso lo vuelve una buena base para seguir creciendo, agregar autenticacion, categorias, prioridades, fechas limite o cualquier otra mejora futura.

## Resumen

Este proyecto permite gestionar tareas de manera sencilla desde una aplicacion web moderna.

Usa:

- `Next.js`, `React`, `TypeScript` y `Tailwind CSS` en el frontend
- `Python`, `FastAPI`, `Pydantic` y `Uvicorn` en el backend
- `Supabase` como base de datos principal
- `CSV` como respaldo cuando la base principal no esta disponible
- `Render` y `Vercel` para su despliegue

## Link

- https://gestor-tareas-nine.vercel.app/
