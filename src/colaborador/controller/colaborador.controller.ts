/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { ColaboradorService } from "../service/colaborador.service";
import { Colaborador } from "../entities/colaborador.entity";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import * as e from 'express';

@ApiTags('Colaboradores')
@UseGuards(JwtAuthGuard)
@Controller("/colaboradores")
@ApiBearerAuth()
export class ColaboradorController {
    constructor(private readonly colaboradorService: ColaboradorService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Listar todos os colaboradores' })
    findAll(): Promise<Colaborador[]> {
        // Retorna todos os registros ordenados por nome
        return this.colaboradorService.findAll();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Listar os colaboradores pelo ID' })
    findById(@Param('id', ParseIntPipe) id: number): Promise<Colaborador> {
        // Busca um colaborador específico pelo ID (numérico)
        return this.colaboradorService.findById(id);
    }

    @Get('/nome/:nome')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Listar os colaboradores pelo nome' })
    findByNome(@Param('nome') nome: string): Promise<Colaborador[]> {
        // Busca colaboradores que contenham o texto no nome
        return this.colaboradorService.findByNome(nome);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Criar colaborador' })
    create(@Body() colaborador: Colaborador): Promise<Colaborador> {
        // Cria um novo colaborador no banco de dados
        return this.colaboradorService.create(colaborador);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Atualizar colaborador' })
    update(@Body() colaborador: Colaborador): Promise<Colaborador> {
        // Atualiza os dados de um colaborador existente
        return this.colaboradorService.update(colaborador);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Deletar colaborador' })
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        // Remove um colaborador permanentemente pelo ID
        return this.colaboradorService.delete(id);
    }

    @Post('/:id/contracheque')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Calcular salário' })
    async getSalario(

        @Param('id', ParseIntPipe) id: number,
        @Body() dadosHolerite: any // Recebe o objeto completo do JSON
    ) {
        // Executa a regra de cálculo automático de salário na Service
        return this.colaboradorService.calcularSalarioLiquido(id, dadosHolerite);
    }

    @Get('/relatorio/excel')
    @ApiOperation({ summary: 'Gerar relatório em Excel' })
    async exportExcel(@Res() res: e.Response) { 
        try {
            // Chama a service para gerar o arquivo
            const buffer = await this.colaboradorService.exportarExcel();

            // Define os cabeçalhos para o navegador entender que é um download
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=colaboradores.xlsx',
                'Content-Length': buffer.byteLength,
            });

            // Envia o arquivo finalizado
            res.end(buffer);
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Erro ao gerar relatório");
        }
    }

}