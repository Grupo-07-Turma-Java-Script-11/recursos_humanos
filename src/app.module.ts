import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadeModule } from './unidades/unidade.module';
import { ColaboradorModule } from './colaborador/colaborador.module';
import { CargoModule } from './cargos/cargos.module';
import { AuthModule } from './auth/auth.module';
import { ProdService } from './data/services/prod.service';
import { AppController } from './app.controller';
import { DevService } from './data/services/dev.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    // Deixa disponivel em todo o projeto as variaveis de hambiente.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // configurar acesso ao banco de dados
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: ProdService,
      imports: [ConfigModule],
    }),
    UnidadeModule, ColaboradorModule, CargoModule, AuthModule, ChatModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }