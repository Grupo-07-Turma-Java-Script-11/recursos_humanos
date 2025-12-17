import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cargo } from './entities/cargos.entity';
import { Usuario } from '../usuarios/entities/usuarios.entity';
import { Colaborador } from '../colaboradores/entities/colaboradores.entity';
import { CargosService } from './services/cargos.service';
import { CargosController } from './controllers/cargos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cargo,
      Usuario,
      Colaborador,
    ]),
   ],
  controllers: [CargosController],
  providers: [CargosService],
  exports: [CargosService],
})
export class CargosModule {}
