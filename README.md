# Verificador de Usuarios de Twitter

Aplicación web desarrollada con Bun, TypeScript y React que permite verificar si un nombre de usuario está incluido en una lista específica de Twitter. También muestra los 100 usuarios principales ordenados por cantidad de seguidores.

## Características

- Verificación de usuarios contra una lista predefinida
- Visualización de los 100 usuarios con más seguidores
- Almacenamiento de consultas en SQLite usando bun:sqlite
- Interfaz en español argentino

## Instalación

Para instalar las dependencias:

```bash
bun install
```

## Ejecución

Para iniciar el servidor de desarrollo:

```bash
bun run dev
```

La aplicación estará disponible en http://localhost:3000

## Notas Técnicas

- La aplicación actualmente utiliza datos de muestra. Para usar datos reales, se debe proporcionar un archivo JSON con la lista de usuarios.
- Las consultas se almacenan en una base de datos SQLite (`consultas.sqlite`).
- Desarrollado con Bun v1.2.4, React 19 y TypeScript.

## Estructura del Proyecto

- `index.html`: Página principal y estilos CSS
- `index.tsx`: Punto de entrada de React
- `App.tsx`: Componente principal de la aplicación
- `server.ts`: Servidor Bun que maneja APIs y sirve archivos estáticos
