import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargosModule } from './cargos/cargos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ColaboradoresModule } from './colaboradores/colaboradores.module';

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
    CargosModule,
    UsuariosModule,
    ColaboradoresModule,
  ],
})
export class AppModule {}
