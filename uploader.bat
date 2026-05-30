@echo off
chcp 65001 > nul
title GitHub Auto-Uploader
cls

:: Стилизация интерфейса (Dark Mode / Modern Console)
color 0B
echo ====================================================
echo          GITHUB AUTOMATIC REPOSITORY CREATOR        
echo ====================================================
echo.

:: 1. Запрос имени репозитория
echo --- НАСТРОЙКА РЕПОЗИТОРИЯ --------------------------
set /p repo_name="[?] Введите ТОЧНОЕ имя репозитория на GitHub: "
if "%repo_name%"=="" (
    echo [!] Имя не может быть пустым! Перезапустите скрипт.
    pause
    exit
)

:: Проверяем, инициализирован ли уже Git
if not exist .git (
    echo.
    echo --- ИНИЦИАЛИЗАЦИЯ GIT ------------------------------
    echo [*] Создаем локальный Git-репозиторий...
    git init
    git branch -M main
)

:: 2. Настройка удаленного репозитория (меняем, если уже привязан другой)
git remote remove origin 2>nul
git remote add origin https://github.com/zaratosheva1503/%repo_name%.git

:: 3. Добавление файлов и коммит
echo.
echo --- ИНДЕКСАЦИЯ И КОММИТ ----------------------------
echo [*] Добавляем файлы проекта...
git add .

set /p commit_msg="[?] Введите описание изменений (или нажмите Enter для 'Auto-commit'): "
if "%commit_msg%"=="" set commit_msg=Auto-commit

echo [*] Фиксируем изменения (commit)...
git commit -m "%commit_msg%"

:: 4. Синхронизация с тем, что уже есть на GitHub (например, LICENSE)
echo.
echo --- СИНХРОНИЗАЦИЯ С СЕРВЕРОМ -----------------------
echo [*] Проверяем удаленный репозиторий на наличие файлов...
git pull origin main --allow-unrelated-histories --no-edit 2>nul

:: 5. Финальный Push
echo.
echo --- ОТПРАВКА НА GITHUB -----------------------------
echo [*] Загружаем файлы в репозиторий '%repo_name%'...
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ====================================================
    echo [v] УСПЕХ! Проект успешно отправлен на GitHub!
    echo ====================================================
) else (
    echo.
    echo ====================================================
    echo [x] ОШИБКА! Что-то пошло не так при отправке.
    echo     Проверьте, правильно ли указано имя репозитория.
    echo ====================================================
)

pause