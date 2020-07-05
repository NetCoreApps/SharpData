COPY deploy\.publish ..\dist
PUSHD ..\dist
x publish -token %GISTLYN_TOKEN%
POPD