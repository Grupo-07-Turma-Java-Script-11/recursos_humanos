import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, isEmail, IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tb_unidades'})
export class Unidades {

    @PrimaryGeneratedColumn()
    id: number;

        
    @ApiProperty()
    @IsNotEmpty()
    @Column({length: 255, nullable: false})
    nome: string

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty() 
    @Column({length: 255, nullable: false})
    usuario: string

    @ApiProperty()
    @IsNotEmpty() 
    @Column({length: 255, nullable: false})
    senha: string

    @ApiProperty()
    @Column({ length: 5000 })
    foto: string

}