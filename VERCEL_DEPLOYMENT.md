# Configuración de Client Tracker en Vercel

## 🚀 Pasos para desplegar con persistencia

### 1. Configurar Supabase (Base de datos PostgreSQL gratuita)

1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"**
3. Crea una cuenta o inicia sesión
4. Crea un nuevo proyecto:
   - **Name**: `client-tracker`
   - **Database Password**: Guarda esta contraseña
   - **Region**: Elige la más cercana
5. Espera a que se provisione (2-3 min)
6. Copia tu **Connection String** desde:
   - Settings → Database → Connection String (URI)
   - Reemplaza `[YOUR-PASSWORD]` con tu contraseña

### 2. Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub
3. En **Environment Variables**, agrega:
   - **Name**: `DATABASE_URL`
   - **Value**: Tu connection string de Supabase (pegado arriba)
4. Haz clic en **Deploy**

### 3. Configurar variable de entorno local

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
DATABASE_URL=postgresql://postgres:TU_PASSWORD@db.supabase.co:5432/postgres?sslmode=require
```

Luego ejecuta:
```bash
npm install
npm run dev
```

## 🔍 Verificar que funciona

1. Abre la app en Vercel (o localhost:3000 localmente)
2. Crea un cliente, actividad, pendiente
3. Actualiza la página (F5)
4. **Importante**: Los datos deben persistir ✅

## 📝 Notas

- La BD está en Supabase, no en el servidor local
- Todos los cambios se guardan automáticamente
- Funciona en cualquier dispositivo/navegador
- Es totalmente gratuito (plan free de Supabase)

## 🆘 Si no funciona

- Verifica que `DATABASE_URL` esté configurada en Vercel
- Revisa los logs de Vercel en el dashboard
- Confirma que las tablas PostgreSQL se crearon en Supabase

