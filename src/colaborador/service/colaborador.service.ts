/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { Colaborador } from './../entities/colaborador.entity';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Like, Repository } from 'typeorm';
import { CargoService } from '../../cargos/services/cargos.service';
import { UnidadeService } from '../../unidades/services/unidade.service';

@Injectable()
export class ColaboradorService {

    constructor(
        @InjectRepository(Colaborador)
        private colaboradorRepository: Repository<Colaborador>,
        private cargoService: CargoService,
        private unidadeService: UnidadeService
    ) { }

    // *** Buscar todos os colaboradores
    async findAll(): Promise<Colaborador[]> {
        return await this.colaboradorRepository.find({
            order: {
                nome: "ASC"
            },
            relations: {
                cargo: true,
                unidade: true
            }
        });
    }

    // *** Buscar Colaborador por ID
    async findById(id: number): Promise<Colaborador> {
        const colaborador = await this.colaboradorRepository.findOne({
            where: {
                id: id // Usando 'id' conforme definido na sua Entity
            },
            relations: {
                cargo: true,
                unidade: true
            }
        });

        if (!colaborador) {
            throw new HttpException('Colaborador não foi encontrado!', HttpStatus.NOT_FOUND);
        }
        return colaborador;
    }

    // *** Buscar colaborador por nome
    async findByNome(nome: string): Promise<Colaborador[]> {
        const colaboradores = await this.colaboradorRepository.find({
            where: {
                nome: Like(`%${nome}%`)
            },
            relations: {
                cargo: true,
                unidade: true
            }
        });

        return colaboradores;
    }

    // *** Criar colaborador
    async create(colaborador: Colaborador): Promise<Colaborador> {
        if (colaborador.cargo) {
            await this.cargoService.findById(colaborador.cargo.id);

            return await this.colaboradorRepository.save(colaborador);
        }
        if (colaborador.unidade) {
            await this.unidadeService.findById(colaborador.unidade.id);

            return await this.colaboradorRepository.save(colaborador);
        }
        return await this.colaboradorRepository.save(colaborador);
    }

    // *** Atualizar colaborador existente
    async update(colaborador: Colaborador): Promise<Colaborador> {
        // Verifica se o colaborador existe antes de atualizar
        await this.findById(colaborador.id);

        if (colaborador.cargo) {
            await this.cargoService.findById(colaborador.cargo.id);

            return await this.colaboradorRepository.save(colaborador);
        }
        if (colaborador.unidade) {
            await this.unidadeService.findById(colaborador.unidade.id);

            return await this.colaboradorRepository.save(colaborador);
        }

        return await this.colaboradorRepository.save(colaborador);
    }

    // *** Deletar colaborador por Id
    async delete(id: number): Promise<void> {
        // Verifica se o colaborador existe
        await this.findById(id);

        await this.colaboradorRepository.delete(id);
    }

    // Regra de Negócio: Cálculo de salários

    async calcularSalarioLiquido(id: number, dados: any): Promise<any> {
        const colaborador = await this.findById(id);

        // Converte valores do banco para Number (segurança contra strings do tipo decimal)
        const salarioBase = Number(colaborador.salario_base);
        const valorAcrescimo = Number(colaborador.acrescimo);

        // Cálculo do valor da hora (baseado em 160h mensais padrão)
        const valorHora = salarioBase / 160;

        // Calcula o proporcional pelas horas efetivamente trabalhadas
        const salarioProporcional = valorHora * dados.horasTrabalhadas;

        // Cálculo das Horas Extras (se houver no JSON)
        const valorHoraExtra = valorHora * 1.5; //1.5 = Valor hora extra correspondendo a 50%
        const totalExtras = valorHoraExtra * (dados.horasExtras || 0);

        const resultadoGeral = (salarioProporcional + totalExtras + valorAcrescimo) - dados.descontos;

        return {
            nome: colaborador.nome,
            matricula: colaborador.matricula,
            demonstrativo: {
                base: salarioBase.toFixed(2),
                extras: totalExtras.toFixed(2),
                acrescimo: valorAcrescimo.toFixed(2),
                descontos: dados.descontos.toFixed(2)
            },
            salarioLiquido: resultadoGeral.toFixed(2)
        };
    }

}