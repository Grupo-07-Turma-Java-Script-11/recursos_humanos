import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Unidades } from "./entities/unidade.entity";
import { UnidadeService } from "./services/unidade.service";
import { UnidadeController } from "./controllers/unidade.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Unidades])],
    providers: [UnidadeService],
    controllers: [UnidadeController],
    exports: [UnidadeService],
})
export class UnidadeModule { }