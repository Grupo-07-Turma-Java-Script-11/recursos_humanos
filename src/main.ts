import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Indicamos a configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('People Flow')
    .setDescription('Projeto Integrador - Sistema de cadastro de RH')
    .setContact("Grupo 07", "https://github.com/Grupo-07-Turma-Java-Script-11/recursos_humanos", "grupo7javascript11@gmail.com")
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('people-flow-rh', app, document);

  // Ajustando o Fuso Horário do BD
  process.env.TZ = '-03:00';

  // Aplicando os recursos de validação
  app.useGlobalPipes(new ValidationPipe());

  // Habilitando o CORS do projeto
  app.enableCors();

  // Indico qual porta o projeto está sendo executado
  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
