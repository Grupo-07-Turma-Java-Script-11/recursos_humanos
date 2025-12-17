import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Unidade } from '../../unidades/entities/unidade.entity';
import { Colaborador } from '../../colaboradores/entities/colaboradores.entity';

@Entity({ name: 'tb_cargos' })
export class Cargo {
  @ApiProperty({ example: 1, description: 'ID do cargo' })
  @PrimaryGeneratedColumn({ name: 'id_cargos' })
  id_cargos: number;

  @ApiProperty({
    example: 'Desenvolvedor Backend',
    description: 'Nome do cargo',
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  nome: string;

  @ApiProperty({
    example: 'Atua no desenvolvimento de APIs',
    description: 'Descrição do cargo',
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  descricao: string;

  @ApiProperty({
    example: 'Pleno',
    description: 'Nível hierárquico do cargo',
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  hierarquia: string;

  @ApiProperty({
    type: () => Unidade,
    description: 'Unidade responsável pelo cargo',
  })
  @ManyToOne(() => Unidade, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  unidade: Unidade;

  @ApiProperty({
    type: () => Colaborador,
    isArray: true,
    description: 'Colaboradores associados ao cargo',
  })
  @OneToMany(() => Colaborador, (colaborador) => colaborador.cargo)
  colaboradores: Colaborador[];
}
