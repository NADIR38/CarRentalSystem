# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY Backend/Backend.csproj ./
RUN dotnet restore "Backend.csproj"

# Copy all source files
COPY Backend/ ./
RUN dotnet publish "Backend.csproj" -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080

# Copy published files from build stage
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "Backend.dll"]
