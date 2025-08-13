@echo off
REM Development Environment Startup Script (Windows)

setlocal enabledelayedexpansion

echo [92m🚀 Starting Omnipreneur AI Suite Development Environment[0m

REM Check requirements
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [91m❌ Node.js is not installed[0m
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [91m❌ npm is not installed[0m
    exit /b 1
)

echo [92m✅ Requirements check passed[0m

REM Check environment file
if not exist .env.local (
    if exist env.example (
        echo [93m⚠️  No .env.local found. Creating from env.example...[0m
        copy env.example .env.local
        echo [93mPlease update .env.local with your actual configuration values[0m
    ) else (
        echo [93m⚠️  No environment file found. Please create .env.local[0m
    )
) else (
    echo [92m✅ Environment file found[0m
)

REM Install dependencies
if not exist node_modules (
    echo [94m📦 Installing dependencies...[0m
    npm install
    if !ERRORLEVEL! neq 0 (
        echo [91m❌ Failed to install dependencies[0m
        exit /b 1
    )
    echo [92m✅ Dependencies installed[0m
) else (
    echo [92m✅ Dependencies already installed[0m
)

REM Setup database
if exist prisma\schema.prisma (
    echo [94m🗄️  Setting up database...[0m
    npx prisma generate
    npx prisma db push
    echo [92m✅ Database setup completed[0m
)

REM Show information
echo.
echo [94mℹ️  Development Information[0m
echo.
echo [92mAvailable Scripts:[0m
echo   npm run dev          - Start development server
echo   npm run build        - Build for production
echo   npm run test         - Run tests
echo   npm run lint         - Run linter
echo   npm run ws:dev       - Start WebSocket server only
echo.
echo [92mUseful URLs:[0m
echo   Application:         http://localhost:3000
echo   WebSocket:           ws://localhost:3001
echo.

echo [92m🎉 Development environment is ready![0m
echo [92m📱 Run 'npm run dev:full' to start both Next.js and WebSocket server[0m
echo [92m🔌 Or run 'npm run dev' for Next.js only[0m
echo.
echo [93mPress any key to start the development server...[0m
pause >nul

REM Start development server
npm run dev:full

exit /b 0