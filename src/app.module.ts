import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unidades } from './Unidades/entities/unidade.entity';
import { UnidadeModule } from './Unidades/unidade.module';
import { Colaborador } from './colaborador/entities/colaborador.entity';
import { ColaboradorModule } from './colaborador/colaborador.module';
import { Cargo } from './cargos/entities/cargos.entity';
import { CargoModule } from './cargos/cargos.module';
import { AuthModule } from './auth/auth.module';
import { ProdService } from './data/services/prod.service';

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
    UnidadeModule, ColaboradorModule, CargoModule, AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
