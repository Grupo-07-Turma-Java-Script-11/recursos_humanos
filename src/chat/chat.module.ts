import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './services/chat.service';
import { ChatController } from './controllers/chat.controller';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { Cargo } from '../cargos/entities/cargos.entity';
import { Unidades } from '../unidades/entities/unidade.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Colaborador, Cargo, Unidades]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}