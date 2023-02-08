FROM mcr.microsoft.com/dotnet/sdk:6.0-focal AS build
WORKDIR /app

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - \
 && apt-get install -y --no-install-recommends nodejs \
 && echo "node version: $(node --version)" \
 && echo "npm version: $(npm --version)" \
 && rm -rf /var/lib/apt/lists/*

RUN dotnet tool install -g x
ENV PATH="${PATH}:/root/.dotnet/tools"
RUN x --version

COPY . .
RUN npm install --include-dev
RUN ./node_modules/.bin/tsc -p .
RUN dotnet restore

WORKDIR /app
RUN dotnet publish -c release -o /out --no-restore
RUN chmod +x ./scripts/pack-app.sh
RUN ./scripts/pack-app.sh
RUN cp -r /app/dist/* /out/wwwroot/
RUN cp /app/dist/app.settings /out/app.settings
RUN cp -r /app/src /out/src
RUN cp -r /app/typings /out/typings
RUN cp -r /app/dist-mix /out/dist-mix


FROM mcr.microsoft.com/dotnet/aspnet:6.0-focal AS runtime
WORKDIR /app
RUN chmod 755 /app
COPY --from=build /out ./
#WORKDIR /out
#ENV ASPNETCORE_ENVIRONMENT=Development
#ENV ASPNETCORE_URLS=http://+:80  
#EXPOSE 80
ENTRYPOINT ["dotnet", "SharpData.dll"]