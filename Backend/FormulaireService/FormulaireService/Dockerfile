FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS base
WORKDIR /app
EXPOSE 5113
EXPOSE 5114

FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /src
COPY ["FormulaireService.csproj", "./"]
RUN dotnet restore "./FormulaireService.csproj"
COPY . .
RUN dotnet build "FormulaireService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FormulaireService.csproj" -c Release -o /app/publish 

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FormulaireService.dll"]