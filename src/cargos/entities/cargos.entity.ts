import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn,  } from "typeorm"

@Entity({ name: "tb_cargos" }) 
export class Cargo {

    @PrimaryGeneratedColumn()   
    id: number;

    @IsNotEmpty()
    @Column( { length: 255, nullable: false } )
    nome: string;

    @IsNotEmpty()   
    @Column( { length: 255, nullable: false } )
    descricao_funcao: string;

    @IsNotEmpty()   
    @Column( { length: 255, nullable: false } )
    nivel_hierarquico: string;

}