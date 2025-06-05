FROM maven:3.9.6-eclipse-temurin-21 as buildstage
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
# Donner les droits d'exécution à mvnw
RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline
COPY src src
RUN ./mvnw package -Dmaven.test.skip=true
RUN mv target/*.jar service.jar

FROM openjdk:17
COPY --from=buildstage /app/service.jar .
ENTRYPOINT ["java", "-jar", "service.jar"] 