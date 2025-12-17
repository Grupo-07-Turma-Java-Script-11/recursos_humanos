import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cargo } from '../entities/cargos.entity';
import { Unidade } from '../../unidades/entities/unidade.entity';

@Injectable()
export class CargosService {
  constructor(
    @InjectRepository(Cargo)
    private readonly cargosRepository: Repository<Cargo>,

    @InjectRepository(Unidade)
    private readonly unidadeRepository: Repository<Unidade>,
  ) { }

  async criar(cargo: Cargo): Promise<Cargo> {
    const unidade = await this.unidadeRepository.findOne({
      where: { id_unidade: cargo.unidade?.id_unidade },
    });

    if (!unidade) {
      throw new NotFoundException('Unidade não encontrada');
    }

    cargo.unidade = unidade;
    return this.cargosRepository.save(cargo);
  }

  listarTodos(): Promise<Cargo[]> {
    return this.cargosRepository.find({
      relations: ['unidade', 'colaboradores'],
    });
  }

  async buscarPorId(id: number): Promise<Cargo> {
    const cargo = await this.cargosRepository.findOne({
      where: { id_cargos: id },
      relations: ['unidade', 'colaboradores'],
    });

    if (!cargo) {
      throw new NotFoundException('Cargo não encontrado');
    }

    return cargo;
  }

  async alterar(id: number, cargo: Cargo): Promise<Cargo> {
    const cargoExistente = await this.buscarPorId(id);

    if (cargo.unidade?.id_unidade) {
      const unidade = await this.unidadeRepository.findOne({
        where: { id_unidade: cargo.unidade.id_unidade },
      });

      if (!unidade) {
        throw new NotFoundException('Unidade não encontrada');
      }

      cargoExistente.unidade = unidade;
    }

    Object.assign(cargoExistente, cargo);
    return this.cargosRepository.save(cargoExistente);
  }

  async deletar(id: number): Promise<void> {
    const cargo = await this.buscarPorId(id);
    await this.cargosRepository.remove(cargo);
  }
}
