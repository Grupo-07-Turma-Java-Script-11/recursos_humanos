import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Cargo } from "../../cargos/entities/cargos.entity";
import { Colaborador } from "../../colaborador/entities/colaborador.entity";
import { Unidades } from "../../unidades/entities/unidade.entity";


@Injectable()
export class DevService implements TypeOrmOptionsFactory {

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'db_rh',
            entities: [Cargo, Colaborador, Unidades],
            synchronize: true,
        };
    }
}