# Configuración de Client Tracker en Vercel con Supabase PostgreSQL

## 🚀 Despliegue con PostgreSQL (Persistencia Real)

### ¿Cómo funciona PostgreSQL con Supabase?

**Ventajas**:
- ✅ Datos persisten permanentemente
- ✅ Funciona en múltiples dispositivos
- ✅ Gratuito (hasta ciertos límites de Supabase)
- ✅ No se pierden en redeploys

### Configuración de Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un proyecto nuevo
3. Ve a Settings > Database
4. Copia la **Direct connection string**
5. Reemplaza `[YOUR-PASSWORD]` con tu contraseña de base de datos

### Variables de entorno en Vercel

En tu proyecto de Vercel:

1. Ve a **Settings** > **Environment Variables**
2. Agrega:
   - `DATABASE_URL`: `postgresql://postgres:TU_PASSWORD@db.TU_PROYECTO.supabase.co:5432/postgres?sslmode=require`

### Despliegue en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub
3. **Agrega la variable de entorno DATABASE_URL**
4. Haz clic en **Deploy**

### Configuración local

Para desarrollo local:

1. Copia `.env.local.example` a `.env.local`
2. Reemplaza `[TU_PASSWORD_AQUI]` con tu contraseña real
3. Ejecuta:

```bash
npm install
npm run dev
```

### ⚠️ Notas importantes

- **SSL**: Siempre usa `?sslmode=require` en la URL
- **Password**: Nunca commits la contraseña real al repo
- **Supabase Free Tier**: 500MB de datos, suficiente para esta app

### 🔄 Migración completada

Ya has migrado a PostgreSQL con Supabase. Los datos ahora persisten permanentemente.

### 🧪 Testing

1. Despliega en Vercel con DATABASE_URL configurada
2. Crea datos en la app
3. **Haz redeploy** - los datos deberían mantenerse
4. Prueba desde diferentes dispositivos

¿Necesitas ayuda con la configuración de Supabase?