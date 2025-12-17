import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unidades } from './Unidades/entities/unidade.entity';
import { UnidadeModule } from './Unidades/unidade.module';



@Module({
  imports: [
    // Deixa disponivel em todo o projeto as variaveis de hambiente.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // configurar acesso ao banco de dados
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? 3310),//alterar as configurações 
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Unidades],
      synchronize: true,
    }),
    UnidadeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
