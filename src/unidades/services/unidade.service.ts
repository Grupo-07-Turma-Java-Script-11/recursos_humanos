import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Unidades } from "../entities/unidade.entity";
import { DeleteResult, ILike, Repository } from "typeorm";
import { Bcrypt } from "../../auth/bcrypt/bcrypt";


@Injectable()
export class UnidadeService {
    constructor(
        @InjectRepository(Unidades)
        private unidadeRepository: Repository<Unidades>,
        private bcrypt: Bcrypt
    ) { }

    async findAll(): Promise<Unidades[]> {
        return await this.unidadeRepository.find({
            relations: {
                colaborador: true
            }
        });
    }

    async findById(id: number): Promise<Unidades> {
        let unidade = await this.unidadeRepository.findOne({
            where: { id }
        });

        if (!unidade)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

        return unidade;
    }

    async findByUsuario(usuario: string): Promise<Unidades | null> {
        return await this.unidadeRepository.findOne({
            where: {
                usuario: usuario
            },
            relations: {
                colaborador: true
            }
        })
    }

    async findByNome(nome: string): Promise<Unidades[]> {
        return this.unidadeRepository.find({
            where: {
                nome: ILike(`%${nome}%`)
            },
            relations: {
                colaborador: true
            }
        })
    }

    async create(usuario: Unidades): Promise<Unidades> {
        let usuarioBusca = await this.findByUsuario(usuario.usuario);

        if (!usuarioBusca) {
            usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)

            return await this.unidadeRepository.save(usuario);
        }

        throw new HttpException("O Usuário ja existe!", HttpStatus.BAD_REQUEST);

    }

    async update(usuario: Unidades): Promise<Unidades> {
        // 1. Localiza o usuário existente no banco
        let usuarioUpdate: Unidades = await this.findById(usuario.id);

        // 2. Localiza se o e-mail novo já pertence a outra pessoa
        let usuarioBusca = await this.findByUsuario(usuario.usuario);

        if (!usuarioUpdate)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

        if (usuarioBusca && usuarioBusca.id !== usuario.id)
            throw new HttpException('Usuário (e-mail) já Cadastrado, digite outro!', HttpStatus.BAD_REQUEST);

        // --- LÓGICA DA SENHA INTELIGENTE ---
        
        // Se a senha veio vazia do Front (ou não veio), mantém a senha que já estava no banco
        if (!usuario.senha || usuario.senha.trim() === "") {
            usuario.senha = usuarioUpdate.senha; 
        } else {
            // Se o usuário digitou uma senha nova, aí sim nós criptografamos
            usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
        }

        return await this.unidadeRepository.save(usuario);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findById(id);

        return await this.unidadeRepository.delete(id);
    }
}
