@echo off
setlocal
cd /d "%~dp0"
echo === Candy Sort Factory - khoi tao Git ===
where git >nul 2>nul
if errorlevel 1 (
  echo [!] Chua cai Git. Tai Git for Windows tai: https://git-scm.com/download/win
  echo     Cai xong, mo lai VS Code roi chay lai file nay.
  pause
  exit /b 1
)
if exist ".git" (
  echo Repo Git da ton tai trong thu muc nay - khong can khoi tao lai.
  git log --oneline -n 5
  pause
  exit /b 0
)
for /f "delims=" %%n in ('git config --global user.name') do set GN=%%n
if "%GN%"=="" (
  set /p GN=Nhap ten hien thi cho Git ^(vd: Kaguya^): 
  set /p GE=Nhap email cho Git: 
)
if not "%GE%"=="" git config --global user.email "%GE%"
if not "%GN%"=="" git config --global user.name "%GN%"
git init
git symbolic-ref HEAD refs/heads/main
git config core.autocrlf false
git add -A
git commit -m "Initial import: Candy Sort Factory prototype v38"
git tag v38
echo.
echo Xong! Repo Git da san sang (nhanh main, tag v38).
git log --oneline -n 3
pause
