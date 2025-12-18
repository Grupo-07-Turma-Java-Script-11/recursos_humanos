import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CargoService } from '../services/cargos.service'; // Verifique se o nome da pasta é services ou service
import { Cargo } from '../entities/cargos.entity';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';

@UseGuards( JwtAuthGuard )   
@ApiTags('Cargos')
@Controller('cargos')
export class CargosController {
  constructor(private readonly cargosService: CargoService) {}

  @ApiOperation({ summary: 'Criar cargo' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  criar(@Body() cargo: Cargo) {
    return this.cargosService.create(cargo);
  }

  @ApiOperation({ summary: 'Listar todos os cargos' })
  @Get()
  @HttpCode(HttpStatus.OK)
  listarTodos() {
    return this.cargosService.findAll();
  }

  @ApiOperation({ summary: 'Buscar cargo por ID' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.cargosService.findById(id);
  }

  @ApiOperation({ summary: 'Alterar cargo' })
  @Put() // No seu service o update espera o objeto completo com ID, então tiramos o :id da URL ou atribuímos no corpo
  @HttpCode(HttpStatus.OK)
  alterar(@Body() cargo: Cargo) {
    return this.cargosService.update(cargo);
  }

  @ApiOperation({ summary: 'Deletar cargo' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletar(@Param('id', ParseIntPipe) id: number) {
    return this.cargosService.delete(id);
  }
}