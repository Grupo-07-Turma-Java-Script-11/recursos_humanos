import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, ILike, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Cargo } from "../entities/cargos.entity";

@Injectable()
export class CargoService {

    constructor(
        @InjectRepository(Cargo) 
        private cargoRepository: Repository<Cargo>               
    ) { }

    async findAll(): Promise<Cargo[]> {
        return await this.cargoRepository.find();
    }

    async findById(id: number): Promise<Cargo> {
        const cargo = await this.cargoRepository.findOne({
            where: { id }
        });

        if (!cargo) {
            throw new HttpException('Cargo não encontrado', HttpStatus.NOT_FOUND);
        }

        return cargo;
    }

    async findByNome(nome: string): Promise<Cargo[]> {
        return await this.cargoRepository.find({
            where: {
                nome: ILike(`%${nome}%`)
            }
        });
    }

    async create(cargo: Cargo): Promise<Cargo> {
        // Removi a busca por usuário que estava aqui, pois não existe nessa entidade
        return await this.cargoRepository.save(cargo);
    }

    async update(cargo: Cargo): Promise<Cargo> {
        // Verifica se o ID foi enviado e se existe no banco
        if (!cargo.id) {
            throw new HttpException('ID do cargo é obrigatório!', HttpStatus.BAD_REQUEST);
        }

        await this.findById(cargo.id);

        return await this.cargoRepository.save(cargo);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findById(id);
        return await this.cargoRepository.delete(id);
    }
}