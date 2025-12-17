import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargosModule } from './cargos/cargos.module';
import { ColaboradoresModule } from './colaboradores/colaboradores.module';
import { UnidadesModule } from './unidades/unidade.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3310,
      username: 'root',
      password: 'root',
      database: 'db_rh',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CargosModule, UnidadesModule, ColaboradoresModule,
  ],
})
export class AppModule { }
