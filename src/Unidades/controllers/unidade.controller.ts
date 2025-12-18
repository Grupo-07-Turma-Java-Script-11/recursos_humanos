import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { Unidades } from "../entities/unidade.entity";
import { UnidadeService } from "../services/unidade.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Unidades')
@Controller("/unidades")
export class UnidadeController {

    constructor(private readonly unidadeService: UnidadeService) { }


    @Get('/all')
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Unidades[]> {
        return this.unidadeService.findAll();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    findById(@Param('id', ParseIntPipe) id: number): Promise<Unidades> {
        return this.unidadeService.findById(id)
    }


    @Post('/cadastrar')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() usuario: Unidades): Promise<Unidades> {
        return this.unidadeService.create(usuario)
    }

    @Put('/atualizar')
    @HttpCode(HttpStatus.OK)
    async update(@Body() usuario: Unidades): Promise<Unidades> {
        return this.unidadeService.update(usuario)
    }

}