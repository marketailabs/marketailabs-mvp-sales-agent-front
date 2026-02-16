# Profiler | Chat Semántico Comercial

Una plataforma de análisis de perfiles comerciales impulsada por IA que utiliza procesamiento de lenguaje natural para generar insights semánticos sobre clientes potenciales y facilitar conversaciones comerciales inteligentes.

## 🚀 Descripción del Proyecto

Profiler es una aplicación web que combina inteligencia artificial con análisis semántico para ayudar a equipos comerciales a comprender mejor a sus clientes. La plataforma permite:

- **Análisis de Perfiles**: Procesa información de clientes mediante IA (Gemini/GPT) para extraer insights comerciales relevantes
- **Chat Semántico**: Mantén conversaciones contextuales con la IA sobre los perfiles analizados
- **Sistema de Créditos**: Gestión de uso mediante un sistema de créditos por análisis
- **Autenticación Segura**: Login con Google OAuth o credenciales tradicionales
- **Gestión de Contenido**: Integración con Sanity CMS para contenido dinámico

## 🛠️ Stack Tecnológico

### Frontend

- **Next.js 15.3.2** - Framework React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos utilitarios
- **Shadcn UI** - Componentes accesibles
- **Lucide React** - Iconografía

### Backend & Base de Datos

- **Next.js API Routes** - Endpoints serverless
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL (Neon)** - Base de datos principal
- **NextAuth.js 5** - Autenticación y sesiones

### IA & Procesamiento

- **GROQ AI** - Modelo principal de IA
- **Google Gemini AI** - Modelo alternativo de IA
- **OpenAI GPT** - Modelo alternativo de IA
- **API Externa** - Servicio de análisis semántico

### CMS & Contenido

- **Sanity.io** - Headless CMS
- **GROQ** - Lenguaje de consultas para Sanity

### Pagos & Notificaciones

- **Stripe** - Procesamiento de pagos
- **Nodemailer** - Envío de emails

## 📋 Características Principales

### 1. Análisis de Perfiles con IA

- Normalización de texto mediante GROQ AI
- Análisis semántico de información comercial
- Extracción de insights y patrones de comportamiento
- Generación automática de perfiles de cliente

### 2. Chat Inteligente

- Conversaciones contextuales sobre análisis realizados
- Historial de mensajes persistente
- Respuestas generadas por IA (GROQ AI)
- Edición de títulos de chat

### 3. Sistema de Créditos

- Gestión de créditos por usuario
- Planes gratuitos y de pago
- Integración con Stripe para compras
- Alertas de créditos bajos

### 4. Autenticación Robusta

- Login con Google OAuth
- Registro con email y contraseña
- Recuperación de contraseña
- Protección contra intentos masivos por IP

### 5. Panel de Administración

- Gestión de usuarios
- Monitoreo de uso de créditos
- Configuración de contenido via Sanity

## 🏗️ Estructura del Proyecto

```
profiler-ai/
├── app/                    # App Router de Next.js
│   ├── (admin)/           # Rutas de administración
│   ├── (routes)/          # Rutas públicas
│   ├── api/               # API Routes
│   └── layout.tsx         # Layout principal
├── actions/               # Server Actions
│   ├── auth-actions.ts    # Acciones de autenticación
│   ├── chatActions.ts     # Acciones de chat
│   ├── payment-actions.ts # Acciones de pago
│   └── userAction.ts      # Acciones de usuario
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI base
│   ├── layout/           # Componentes de layout
│   └── LoginComponents/  # Componentes de auth
├── config/               # Configuraciones
├── lib/                  # Utilidades y helpers
├── prisma/               # Schema y migraciones
├── sanity/               # Configuración de Sanity
└── types/                # Definiciones de TypeScript
```

## 🚦 Instalación y Configuración

### Prerrequisitos

- Node.js 20+
- pnpm (recomendado)
- PostgreSQL (o cuenta en Neon)
- Cuenta en Google Cloud (para OAuth)
- API Keys de Gemini y/o OpenAI
- Cuenta en Sanity.io
- Cuenta en Stripe (para pagos)

### Instalación

1. Clona el repositorio:

```bash
git clone <repository-url>
cd profiler-ai
```

2. Instala las dependencias:

```bash
pnpm install
```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# URL Environment
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
API_URL=https://tu-api-externa.com

# Gemini API
GEMINI_API_KEY=tu_gemini_api_key

# OpenAI API
OPENAI_API_KEY=tu_openai_api_key

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=tu_token
SANITY_API_ADMIN_TOKEN=tu_admin_token

# NextAuth
AUTH_SECRET=tu_secret_generado
AUTH_GOOGLE_ID=tu_google_client_id
AUTH_GOOGLE_SECRET=tu_google_client_secret

# Database
DATABASE_URL=tu_postgresql_url

# Free Plan ID
NEXT_PUBLIC_FREE_PLAN_ID=uuid_del_plan_gratuito

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email
EMAIL_PASS=tu_app_password

# Stripe
STRIPE_PUBLIC_KEY=tu_stripe_public_key
STRIPE_SECRET_KEY=tu_stripe_secret_key
STRIPE_WEBHOOK_SECRET=tu_webhook_secret
```

4. Configura la base de datos:

```bash
pnpm prisma generate
pnpm prisma db push
```

5. Genera los tipos de Sanity:

```bash
pnpm typegen
```

6. Inicia el servidor de desarrollo:

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📝 Scripts Disponibles

```bash
pnpm dev          # Inicia el servidor de desarrollo con Turbopack
pnpm build        # Construye la aplicación para producción
pnpm start        # Inicia el servidor de producción
pnpm lint         # Ejecuta el linter
pnpm typegen      # Genera tipos de Sanity
```

## 🔐 Autenticación

El proyecto utiliza NextAuth.js v5 con dos proveedores:

1. **Google OAuth**: Autenticación social rápida
2. **Credentials**: Email y contraseña con bcrypt

Los usuarios se sincronizan automáticamente entre PostgreSQL (NextAuth) y Sanity (gestión de créditos).

## 💳 Sistema de Pagos

Integración completa con Stripe para:

- Compra de créditos individuales
- Suscripciones mensuales
- Webhooks para confirmación de pagos
- Gestión automática de créditos post-pago

## 🎨 Temas

La aplicación soporta modo claro/oscuro mediante `next-themes` con detección automática del sistema.

## 📱 Responsive Design

Diseño completamente responsive optimizado para:

- Desktop
- Tablet
- Mobile

## 🔒 Seguridad

- Validación de datos con Zod
- Protección CSRF
- Rate limiting por IP
- Sanitización de inputs
- Encriptación de contraseñas con bcrypt
- Variables de entorno para secretos

## 🌐 Despliegue

El proyecto está optimizado para despliegue en:

- **Vercel** (recomendado para Next.js)
- **Railway**
- **Render**
- Cualquier plataforma que soporte Node.js

### Consideraciones de Despliegue

1. Configura todas las variables de entorno
2. Asegúrate de que la base de datos sea accesible
3. Configura los webhooks de Stripe
4. Actualiza las URLs de callback de Google OAuth

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y propietario.

## 👥 Equipo

Desarrollado por el equipo de MarketAI Labs.

## 📞 Soporte

Para soporte y consultas:

- Email: marcosmoruadev@gmail.com
- Website: https://www.marketailabs.com

---

**Profiler** - Transformando datos en insights comerciales con IA 🚀
