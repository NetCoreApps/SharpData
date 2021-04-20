FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /app

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - \
 && apt-get install -y --no-install-recommends nodejs \
 && echo "node version: $(node --version)" \
 && echo "npm version: $(npm --version)" \
 && rm -rf /var/lib/apt/lists/*

RUN dotnet tool install -g x
RUN dotnet tool install -g app
ENV PATH="${PATH}:/root/.dotnet/tools"
RUN x --version

COPY . .
RUN npm install
RUN dotnet restore

WORKDIR /app
RUN dotnet publish -c release -o /out --no-restore
RUN chmod +x ./scripts/pack-app.sh
RUN ./scripts/pack-app.sh
RUN cp -r /app/dist /out/wwwroot

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS runtime
WORKDIR /app
COPY --from=build /out ./
ENTRYPOINT ["dotnet", "SharpData.dll"]