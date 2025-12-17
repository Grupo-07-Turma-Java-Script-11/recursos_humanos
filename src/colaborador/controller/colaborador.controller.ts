/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { ColaboradorService } from "../service/colaborador.service";
import { Colaborador } from "../entities/colaborador.entity";

@Controller("/colaboradores")
export class ColaboradorController {
    constructor(private readonly colaboradorService: ColaboradorService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Colaborador[]> {
        // Retorna todos os registros ordenados por nome
        return this.colaboradorService.findAll();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    findById(@Param('id', ParseIntPipe) id: number): Promise<Colaborador> {
        // Busca um colaborador específico pelo ID (numérico)
        return this.colaboradorService.findById(id);
    }

    @Get('/nome/:nome')
    @HttpCode(HttpStatus.OK)
    findByNome(@Param('nome') nome: string): Promise<Colaborador[]> {
        // Busca colaboradores que contenham o texto no nome
        return this.colaboradorService.findByNome(nome);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() colaborador: Colaborador): Promise<Colaborador> {
        // Cria um novo colaborador no banco de dados
        return this.colaboradorService.create(colaborador);
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() colaborador: Colaborador
    ): Promise<Colaborador> {
        // Atualiza os dados de um colaborador existente
        return this.colaboradorService.update(id, colaborador); 
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        // Remove um colaborador permanentemente pelo ID
        return this.colaboradorService.delete(id);
    }

    @Post('/:id/contracheque')
    @HttpCode(HttpStatus.OK)
    async getSalario(

    @Param('id', ParseIntPipe) id: number,
    @Body() dadosHolerite: any // Recebe o objeto completo do JSON
    ) {
        // Executa a regra de cálculo automático de salário na Service
        return this.colaboradorService.calcularSalarioLiquido(id, dadosHolerite);
    }
}