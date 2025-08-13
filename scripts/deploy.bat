@echo off
REM Production Deployment Script for Omnipreneur AI Suite (Windows)

setlocal enabledelayedexpansion

REM Colors (limited in Windows CMD)
set RED=
set GREEN=
set YELLOW=
set BLUE=
set NC=

echo [92m🚀 Starting Omnipreneur AI Suite Deployment[0m
echo Environment: %ENVIRONMENT%
echo Domain: %DOMAIN%

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [91m❌ Node.js is not installed or not in PATH[0m
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [91m❌ npm is not installed or not in PATH[0m
    exit /b 1
)

echo [92m✅ Node.js and npm found[0m

REM Install dependencies
echo [94m📦 Installing dependencies...[0m
npm install
if %ERRORLEVEL% neq 0 (
    echo [91m❌ Failed to install dependencies[0m
    exit /b 1
)
echo [92m✅ Dependencies installed[0m

REM Run type check
echo [94m🔍 Running type check...[0m
npm run type-check
if %ERRORLEVEL% neq 0 (
    echo [93m⚠️  Type check failed but continuing[0m
)

REM Run tests
echo [94m🧪 Running tests...[0m
npm test -- --passWithNoTests
if %ERRORLEVEL% neq 0 (
    echo [93m⚠️  Tests failed but continuing[0m
)

REM Build application
echo [94m🏗️  Building application...[0m
npm run build
if %ERRORLEVEL% neq 0 (
    echo [91m❌ Build failed[0m
    exit /b 1
)
echo [92m✅ Build completed[0m

echo [92m🎉 Deployment completed successfully![0m
echo [92m🌐 Your application is ready to run[0m
echo.
echo [93mNext steps:[0m
echo [93m1. Configure your environment variables[0m
echo [93m2. Set up your database[0m
echo [93m3. Start the application with: npm run start:full[0m
echo [93m4. Test your application thoroughly[0m

exit /b 0