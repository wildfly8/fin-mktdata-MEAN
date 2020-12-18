@echo off

setlocal

cd C:\MyProject\fin-mktdata-MEAN
call npm run start
if not "%ERRORLEVEL%" == "0" pause

:end
endlocal