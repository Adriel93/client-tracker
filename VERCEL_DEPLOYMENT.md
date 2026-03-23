# Configuración de Client Tracker en Vercel con SQLite

## 🚀 Despliegue con SQLite (Persistencia Local)

### ¿Cómo funciona SQLite en Vercel?

**Importante**: Vercel es serverless, por lo que **SQLite no persiste datos entre deployments**. Los datos se pierden cada vez que se redeploya.

### Soluciones para persistencia:

#### Opción 1: SQLite con Vercel (Datos temporales)
- ✅ Fácil de configurar
- ✅ No requiere servicios externos
- ❌ Datos se pierden en cada redeploy
- ❌ No funciona entre múltiples instancias

#### Opción 2: PostgreSQL con Supabase (Recomendado)
- ✅ Datos persisten permanentemente
- ✅ Funciona en múltiples dispositivos
- ✅ Gratuito (hasta ciertos límites)
- ❌ Requiere configuración adicional

### Para mantener SQLite en Vercel:

1. **No necesitas variables de entorno** (DATABASE_URL)
2. **Los datos duran mientras la instancia esté viva**
3. **Para desarrollo/testing**: Perfecto
4. **Para producción**: Considera migrar a PostgreSQL

### Despliegue en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub
3. **No agregues variables de entorno** (usa SQLite por defecto)
4. Haz clic en **Deploy**

### Configuración local

Para desarrollo local con SQLite:

```bash
npm install
npm run dev
```

### ⚠️ Limitaciones en Vercel

- **Cold starts**: La BD se recrea cada vez que la función se "despierta"
- **Múltiples instancias**: Cada instancia tiene su propia BD
- **Timeout**: Las funciones serverless tienen límite de tiempo

### 🔄 Si quieres persistencia real

Para datos que persistan, ejecuta:

```bash
# Instalar PostgreSQL client
npm uninstall sqlite3
npm install pg

# Luego configura Supabase según VERCEL_DEPLOYMENT.md
```

### 🧪 Testing

1. Despliega en Vercel
2. Crea datos en la app
3. **No hagas redeploy** (mantén la instancia viva)
4. Los datos deberían persistir mientras no se redeploye

¿Necesitas migrar a PostgreSQL para persistencia real?