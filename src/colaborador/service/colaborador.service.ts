/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { Colaborador } from './../entities/colaborador.entity';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Like, Repository } from 'typeorm';

@Injectable()
export class ColaboradorService {

    constructor(
        @InjectRepository(Colaborador)
        private colaboradorRepository: Repository<Colaborador>,
    ) {}

    // *** Buscar todos os colaboradores
    async findAll(): Promise<Colaborador[]> {
        return await this.colaboradorRepository.find({
            order: {
                nome: "ASC"
            }
        });
    }
    
    // *** Buscar Colaborador por ID
    async findById(id: number): Promise<Colaborador> {
        const colaborador = await this.colaboradorRepository.findOne({
            where: {
                id: id // Usando 'id' conforme definido na sua Entity
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
        });

        if (colaboradores.length === 0) {
            throw new HttpException('Nenhum colaborador encontrado com este nome.', HttpStatus.NOT_FOUND);
        }

        return colaboradores;
    }

    // *** Criar colaborador
    async create(colaborador: Colaborador): Promise<Colaborador> {
        // Regra: Verifica se já existe um colaborador com o mesmo nome
        const colaboradorExistente = await this.colaboradorRepository.findOne({
            where: { nome: colaborador.nome }
        });

        if (colaboradorExistente) {
            throw new HttpException('Colaborador com este nome já cadastrado.', HttpStatus.BAD_REQUEST);
        }

        return await this.colaboradorRepository.save(colaborador);   
    }

    // *** Atualizar colaborador existente
    async update(id: number, colaborador: Colaborador): Promise<Colaborador> {
        // Verifica se o colaborador existe antes de atualizar
        await this.findById(id);

        // Garante que o ID do objeto seja o ID passado no parâmetro
        colaborador.id = id;
        
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

  //Criar relação com:
  // tb_usuarios id_cliente e,
  // tb_cargos_id_cargo
  
}