@echo off
echo 🚀 Instalando Client Tracker...
echo.

echo 📦 Instalando dependencias...
npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas correctamente
echo.
echo 🎯 Scripts disponibles:
echo   npm run dev     - Iniciar servidor + cliente
echo   npm run server  - Solo servidor API
echo   npm start       - Solo cliente React
echo   npm run build   - Build de producción
echo.
echo 📖 Lee el README.md para más información
echo.
echo 🎉 ¡Listo para usar!
pause