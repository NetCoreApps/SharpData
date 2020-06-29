PUSHD ..
rd /q /s dist
md dist\assets dist\db dist\components
xcopy /E wwwroot\assets .\dist\assets\
xcopy /E wwwroot\db .\dist\db\
x run _bundle.ss -to /dist
copy wwwroot\* dist
copy scripts\deploy\app.settings dist

REM Uncomment if app requires a .NET .dll:
rem dotnet publish -c release
rem md dist\plugins 
rem copy bin\release\netcoreapp3.1\publish\SharpData.dll dist\plugins\
POPD