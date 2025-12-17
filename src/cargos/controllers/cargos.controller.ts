import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CargosService } from '../services/cargos.service';
import { Cargo } from '../entities/cargos.entity';

@ApiTags('Cargos')
@Controller('cargos')
export class CargosController {
    constructor(private readonly cargosService: CargosService) { }

    @ApiOperation({ summary: 'Criar cargo' })
    @Post()
    criar(@Body() cargo: Cargo) {
        return this.cargosService.criar(cargo);
    }

    @ApiOperation({ summary: 'Listar todos os cargos' })
    @Get()
    listarTodos() {
        return this.cargosService.listarTodos();
    }

    @ApiOperation({ summary: 'Buscar cargo por ID' })
    @Get(':id')
    buscarPorId(@Param('id') id: number) {
        return this.cargosService.buscarPorId(+id);
    }

    @ApiOperation({ summary: 'Alterar cargo' })
    @Put(':id')
    alterar(@Param('id') id: number, @Body() cargo: Cargo) {
        return this.cargosService.alterar(+id, cargo);
    }

    @ApiOperation({ summary: 'Deletar cargo' })
    @Delete(':id')
    deletar(@Param('id') id: number) {
        return this.cargosService.deletar(+id);
    }
}
