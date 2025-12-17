import { IsEmail, isEmail, IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tb_unidades'})
export class Unidades {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({length: 255, nullable: false})
    nome: string

    @IsEmail()
    @IsNotEmpty() 
    @Column({length: 255, nullable: false})
    usuario: string

    @IsNotEmpty() 
    @Column({length: 255, nullable: false})
    senha: string

    @Column({ length: 5000 })
    foto: string

}