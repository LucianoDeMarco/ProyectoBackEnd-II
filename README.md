# Proyecto Final: Sistema de Autenticación Híbrido - Backend II

Este repositorio contiene la implementación técnica de un sistema de autenticación híbrido desarrollado con Node.js, Express y MongoDB, como proyecto final para el curso de **Backend II: Diseño y Arquitectura** de Coderhouse.

El proyecto demuestra la integración de múltiples estrategias de autenticación (Local y OAuth con GitHub), manejo de sesiones híbridas (JWT + Cookies + MongoDB) y una arquitectura modular y escalable.

## 🚀 Características Principales

*   **Arquitectura MVC Extendida:** Código organizado en capas (`config`, `models`, `routes`, `controllers`, `middlewares`, `strategies`).
*   **Autenticación Híbrida:** 
    *   **Local:** Registro y login con email y contraseña (hasheada con `bcrypt`).
    *   **OAuth:** Integración con GitHub mediante `passport-github2`.
*   **Gestión de Sesiones y Seguridad:**
    *   Emisión de JSON Web Tokens (JWT) almacenados de forma segura en `Cookies HttpOnly`.
    *   Mantenimiento de estado en base de datos mediante `express-session` y `connect-mongo`.
    *   Mitigación de ataques CSRF mediante configuración `sameSite: 'Lax'` y diferenciación de entornos (`development` vs `production`).
*   **Autorización Basada en Roles (RBAC):** Middlewares para proteger rutas según el rol del usuario (`user` o `admin`), manejando correctamente los errores HTTP 401 y 403.

## 🛠️ Tecnologías y Dependencias

*   **Entorno de ejecución:** Node.js
*   **Framework web:** Express.js
*   **Base de datos:** MongoDB (con Mongoose)
*   **Autenticación:** Passport.js (Estrategias: Local y GitHub)
*   **Seguridad y Sesiones:** jsonwebtoken, bcrypt, express-session, connect-mongo, cookie-parser
*   **Configuración:** dotenv

## 📁 Estructura del Proyecto

```text
/src
├── config/           # Inicialización de Passport y configuraciones
├── controllers/      # Lógica de negocio de los endpoints
├── middlewares/      # Interceptores (verificación de JWT y roles)
├── models/           # Esquemas de Mongoose
├── routes/           # Definición de rutas y endpoints
├── strategies/       # Lógica específica de Passport (Local y GitHub)
└── app.js            # Punto de entrada de la aplicación