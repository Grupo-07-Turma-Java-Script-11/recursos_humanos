import { JwtService } from '@nestjs/jwt';
import { UnidadeService } from '../../Unidades/services/unidade.service';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Bcrypt } from '../bcrypt/bcrypt';
import { UsuarioLogin } from '../entities/usuariologin.entity';

@Injectable()
export class AuthService {
    constructor(
        private UnidadeService: UnidadeService,
        private jwtService: JwtService,
        private bcrypt: Bcrypt
    ) { }

    async validateUser( username: string, password: string ): Promise< any > {

        const buscaUsuario = await this.UnidadeService.findByUsuario( username )

        if ( !buscaUsuario )
            throw new HttpException( 'Usuário não encontrado!', HttpStatus.NOT_FOUND )

        const matchPassword = await this.bcrypt.compararSenhas( buscaUsuario.senha, password )

        if ( buscaUsuario && matchPassword ) {
            const { senha, ...resposta } = buscaUsuario
            return resposta
        }

        return null
    }

    async login( usuarioLogin: UsuarioLogin ) {
        const payload = { sub: usuarioLogin.usuario }

        const buscaUsuario = await this.UnidadeService.findByUsuario( usuarioLogin.usuario )

        return {
            id: buscaUsuario?.id,   
            nome: buscaUsuario?.nome,
            usuario: usuarioLogin.usuario,
            senha: '',
            foto: buscaUsuario?.foto,
            token: `Bearer ${ this.jwtService.sign( payload ) }`, 
        }

    }
}