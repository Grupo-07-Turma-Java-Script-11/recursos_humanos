// src/chat/controllers/chat.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Chatbot')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('insight')
  @ApiOperation({ summary: 'Envia uma pergunta para o chatbot de RH' })
  async enviarPergunta(@Body('pergunta') pergunta: string) {
    return { response: await this.chatService.gerarInsight(pergunta) };
  }
}