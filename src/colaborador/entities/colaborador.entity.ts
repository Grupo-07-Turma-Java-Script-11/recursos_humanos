/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Unidades } from '../../Unidades/entities/unidade.entity';
import { Cargo } from '../../cargos/entities/cargos.entity';


@Entity({ name: 'tb_colaboradores' })
export class Colaborador {

  @PrimaryGeneratedColumn()
  @ApiProperty()
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

  @ApiProperty({ type: () => Unidades })
  @ManyToOne(() => Unidades, (unidade) => unidade.colaborador, {
    onDelete: "CASCADE"
  })
  unidade: Unidades

  @ApiProperty({ type: () => Cargo })
  @ManyToOne(() => Cargo, (cargo) => cargo.colaborador, {
    onDelete: "CASCADE"
  })
  cargo: Cargo

}
