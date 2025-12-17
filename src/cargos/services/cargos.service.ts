import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cargo } from '../entities/cargos.entity';
//import { Usuario } from '../../usuarios/entities/usuario.entity';

@Injectable()
export class CargosService {
  constructor(
    @InjectRepository(Cargo)
    private cargosRepository: Repository<Cargo>,
    
    *@InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async criar(cargo: Cargo): Promise<Cargo> {
    const empresa = await this.usuariosRepository.findOne({
      where: { id: cargo.empresa?.id },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    cargo.empresa = empresa;
    return this.cargosRepository.save(cargo);
  }

  listarTodos(): Promise<Cargo[]> {
    return this.cargosRepository.find({
      relations: ['empresa', 'colaboradores'],
    });
  }

  async buscarPorId(id: number): Promise<Cargo> {
    const cargo = await this.cargosRepository.findOne({
      where: { id_cargos: id },
      relations: ['empresa', 'colaboradores'],
    });

    if (!cargo) {
      throw new NotFoundException('Cargo não encontrado');
    }

    return cargo;
  }

  async alterar(id: number, cargo: Cargo): Promise<Cargo> {
    const cargoExistente = await this.buscarPorId(id);

    Object.assign(cargoExistente, cargo);

    return this.cargosRepository.save(cargoExistente);
  }

  async deletar(id: number): Promise<void> {
    const cargo = await this.buscarPorId(id);
    await this.cargosRepository.remove(cargo);
  }
}
