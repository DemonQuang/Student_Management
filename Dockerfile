# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
ARG VITE_API_URL=
ENV VITE_API_URL=${VITE_API_URL}
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN echo "VITE_API_URL=" > .env.production && npm run build

# Stage 2: Build backend
FROM maven:3.9.6-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY pom.xml .
COPY src ./src
COPY --from=frontend-build /app/dist ./src/main/resources/static/
RUN mvn clean package -DskipTests

# Stage 3: Run
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=backend-build /app/target/student-management-api-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
