/* eslint-disable prettier/prettier */
import { IsDate, IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'tb_colaboradores' })
export class Colaborador {

@PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column() 
  nome: string;

  @IsNotEmpty()
  @IsNumber()
  @Column('int')
  matricula: number;

  @IsNotEmpty()
  @Column({ type: 'datetime' }) 
  data_admissao: Date;

  @IsNotEmpty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salario_base: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  acrescimo: number;

  //Criar relação com:
  // tb_usuarios id_cliente e,
  // tb_cargos_id_cargo

}
