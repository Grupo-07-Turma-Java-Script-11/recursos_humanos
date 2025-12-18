import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Unidades } from "./entities/unidade.entity";
import { UnidadeService } from "./services/unidade.service";
import { UnidadeController } from "./controllers/unidade.controller";
import { Bcrypt } from "../auth/bcrypt/bcrypt";

@Module({
    imports: [TypeOrmModule.forFeature([Unidades])],
    providers: [UnidadeService, Bcrypt],
    controllers: [UnidadeController],
    exports: [UnidadeService],
})
export class UnidadeModule { }