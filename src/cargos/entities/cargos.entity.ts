import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, } from "typeorm"
import { Colaborador } from "../../colaborador/entities/colaborador.entity";

@Entity({ name: "tb_cargos" })
export class Cargo {

    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    nome: string;

    @ApiProperty()
    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    descricao_funcao: string;

    @ApiProperty()
    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    nivel_hierarquico: string;

    @ApiProperty()
    @OneToMany(() => Colaborador, (colaborador) => colaborador.cargo)
    colaborador: Colaborador[]

}