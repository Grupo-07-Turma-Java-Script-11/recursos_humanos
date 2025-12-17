import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configuracaoSwagger = new DocumentBuilder()
    .setTitle('Sistema de RH')
    .setDescription('API para gestão de Cargos, Colaboradores e Unidades')
    .setVersion('1.0')
    .build();

  const documentoSwagger = SwaggerModule.createDocument(
    app,
    configuracaoSwagger,
  );

  SwaggerModule.setup('rh', app, documentoSwagger);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
