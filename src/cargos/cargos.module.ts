import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cargo } from './entities/cargos.entity';
import { CargoService } from './services/cargos.service';
import { CargosController } from './controllers/cargos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cargo])],
  providers: [CargoService],
  controllers: [CargosController],
  exports: [TypeOrmModule]
})
export class CargoModule { }