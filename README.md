# 🍝 Frontend - Risotto

Este frontend está construido con **Vite + React** y está diseñado para conectarse al backend mediante API REST. Se encuentra preparado para ejecutarse dentro de contenedores Docker.

---

## ✅ Requisitos

- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
#Colocar una id client de OAUTH2 DE GOOGLE Y AGREGAR LA IP PÚBLICA DEL SERVIDOR
VITE_OAUTH_CLIENT_ID=165174662934-b59vpj3f6oor8rjs7johfsq6s8k3lvog.apps.googleusercontent.com

# Coloca la IP pública del backend si deseas acceder desde internet
# Por ejemplo: http://123.123.123.123:3001
VITE_BACKEND_IP=http://localhost:3001

# Ruta base para las llamadas a la API
VITE_API_URL=/api
