import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuarios.entity';
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
    type: () => Usuario,
    description: 'Empresa responsável pelo cargo',
  })
  @ManyToOne(() => Usuario, (usuario) => usuarios.cargos, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  empresa: Usuario;

  @ApiProperty({
    type: () => Colaborador,
    isArray: true,
    description: 'Colaboradores associados ao cargo',
  })
  @OneToMany(() => Colaborador, (colaborador) => colaboradores.cargo)
  colaboradores: Colaborador[];
}
