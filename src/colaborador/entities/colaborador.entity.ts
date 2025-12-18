/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'tb_colaboradores' })
export class Colaborador {

@PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column() 
  nome: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Column('int')
  matricula: number;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ type: 'datetime' }) 
  data_admissao: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salario_base: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  acrescimo: number;

  //Criar relação com:
  // tb_usuarios id_cliente e,
  // tb_cargos_id_cargo

}
