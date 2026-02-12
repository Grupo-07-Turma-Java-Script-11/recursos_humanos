import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, isEmail, IsNotEmpty, IsOptional } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Colaborador } from "../../colaborador/entities/colaborador.entity";

@Entity({ name: 'tb_unidades' })
export class Unidades {

    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    nome: string

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    usuario: string

    @ApiProperty()
    @IsOptional() // <-- MUDANÇA AQUI: Permite que o campo não venha na atualização
    @IsNotEmpty({ groups: ['create'] }) // Opcional: exige apenas no cadastro se usar groups
    @Column({ length: 255, nullable: false })
    senha: string;

    @ApiProperty()
    @Column({ length: 5000 })
    foto: string

    @ApiProperty()
    @OneToMany(() => Colaborador, (colaborador) => colaborador.unidade)
    colaborador: Colaborador[]
}
