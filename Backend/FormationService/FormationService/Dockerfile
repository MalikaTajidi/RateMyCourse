FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS base
WORKDIR /app
EXPOSE 5080
EXPOSE 5081

FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /src
COPY ["FormationService.csproj", "./"]
RUN dotnet restore "./FormationService.csproj"
COPY . .
RUN dotnet build "FormationService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FormationService.csproj" -c Release -o /app/publish 

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FormationService.dll"]