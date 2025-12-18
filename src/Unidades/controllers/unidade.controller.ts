import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { Unidades } from "../entities/unidade.entity";
import { UnidadeService } from "../services/unidade.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { DeleteResult } from "typeorm";

@ApiTags('Unidades')
@Controller("/unidades")
@ApiBearerAuth()
export class UnidadeController {

    constructor(private readonly unidadeService: UnidadeService) { }

    // @UseGuards(JwtAuthGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Unidades[]> {
        return this.unidadeService.findAll();
    }

    // @UseGuards(JwtAuthGuard)
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    findById(@Param('id', ParseIntPipe) id: number): Promise<Unidades> {
        return this.unidadeService.findById(id)
    }

    // @UseGuards(JwtAuthGuard)
    @Get('nome/:nome')
    @HttpCode(HttpStatus.OK)
    findByName(@Param('nome') nome: string): Promise<Unidades[]> {
        return this.unidadeService.findByNome(nome);
    }

    @Post('/cadastrar')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() usuario: Unidades): Promise<Unidades> {
        return this.unidadeService.create(usuario)
    }

    // @UseGuards(JwtAuthGuard)
    @Put('/atualizar')
    @HttpCode(HttpStatus.OK)
    async update(@Body() usuario: Unidades): Promise<Unidades> {
        return this.unidadeService.update(usuario)
    }

    // @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return this.unidadeService.delete(id);
    }

}