PUSHD ..
rd /q /s dist
md dist\assets dist\db dist\custom
xcopy /E wwwroot\assets .\dist\assets\
xcopy /E wwwroot\db .\dist\db\
x run _bundle.ss -to /dist
copy wwwroot\* dist
copy scripts\deploy\app.settings dist

copy wwwroot\custom\northwind.js dist-mix\northwind\custom
copy northwind.sqlite dist-mix\northwind
copy wwwroot\custom\chinook.js dist-mix\chinook\custom
copy chinook.sqlite dist-mix\chinook

REM Uncomment if app requires a .NET .dll:
rem dotnet publish -c release
rem md dist\plugins 
rem copy bin\release\netcoreapp3.1\publish\SharpData.dll dist\plugins\
POPD