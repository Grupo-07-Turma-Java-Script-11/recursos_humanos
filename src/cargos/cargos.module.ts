import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cargo } from './entities/cargos.entity';
import { CargoService } from './services/cargos.service';
import { CargosController } from './controllers/cargos.controller'; // Ajustado para CargosController

@Module({
  imports: [TypeOrmModule.forFeature([Cargo])],
  providers: [CargoService],
  controllers: [CargosController], // Deve ser o mesmo nome da classe no arquivo do controller
  exports: [TypeOrmModule]
})
export class CargoModule {}