import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Unidades } from "../entities/unidade.entity";
import { Repository } from "typeorm";

@Injectable()
export class UnidadeService {
    constructor(
        @InjectRepository(Unidades)
        private unidadeRepository: Repository<Unidades>,
    ) { }

    async findByUsuario(usuario: string): Promise<Unidades | null> {
        return await this.unidadeRepository.findOne({
            where: {
                usuario: usuario
            }
        })
    }

    async findAll(): Promise<Unidades[]> {
        return await this.unidadeRepository.find();
    }

    async findById(id: number): Promise<Unidades> {
        let unidade = await this.unidadeRepository.findOne({
            where: { id }
        });

        if (!unidade)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

        return unidade;
    }

    async create(usuario: Unidades): Promise<Unidades> {
        let usuarioBusca = await this.findByUsuario(usuario.usuario);

        if (!usuarioBusca) {


            return await this.unidadeRepository.save(usuario);
        }

        throw new HttpException("O Usuário ja existe!", HttpStatus.BAD_REQUEST);

    }

    async update(usuario: Unidades): Promise<Unidades> {
        let usuarioUpdate: Unidades = await this.findById(usuario.id) // Função para localizar o usuario pelo ID
        let usuarioBusca = await this.findByUsuario(usuario.usuario) // Função para localizar o usuario pelo email

        if (!usuarioUpdate)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

        if (usuarioBusca && usuarioBusca.id !== usuario.id)
            throw new HttpException('Usuário (e-mail) já Cadastrado, digite outro!', HttpStatus.BAD_REQUEST);


        return await this.unidadeRepository.save(usuario);
    }
}