/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Colaborador } from "./entities/colaborador.entity";
import { ColaboradorService } from "./service/colaborador.service";
import { ColaboradorController } from "./controller/colaborador.controller";
import { CargoModule } from "../cargos/cargos.module";
import { UnidadeModule } from "../Unidades/unidade.module";

@Module({
  imports: [TypeOrmModule.forFeature([Colaborador]), CargoModule, UnidadeModule],
  providers: [ColaboradorService],
  controllers: [ColaboradorController],
  exports: [],

  //Criar relação com:
  // tb_usuarios id_cliente e,
  // tb_cargos_id_cargo

})
export class ColaboradorModule { }