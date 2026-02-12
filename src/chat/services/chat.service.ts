import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config'; // Importe o ConfigService
import { Colaborador } from '../../colaborador/entities/colaborador.entity';

@Injectable()
export class ChatService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    @InjectRepository(Colaborador)
    private colaboradorRepository: Repository<Colaborador>,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY')!;
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: 'Você é um assistente de RH. Você analisa dados de colaboradores, cargos e unidades para fornecer insights gerenciais.',
    });
  }

  async gerarInsight(pergunta: string) {
    // 1. Busca os dados com os relacionamentos necessários
    const dados = await this.colaboradorRepository.find({
      relations: ['cargo', 'unidade']
    });

    // 2. Limpeza de dados: Remove campos sensíveis como senhas
    const dadosParaIA = dados.map(colaborador => {
      const { unidade, ...resto } = colaborador;
      return {
        ...resto,
        unidade: unidade ? { nome: unidade.nome } : null,
      };
    });

    const contexto = JSON.stringify(dadosParaIA);

    // 3. Envio para a API
    const prompt = `Com base nos seguintes dados de RH: ${contexto}. Responda à pergunta do usuário: ${pergunta}`;
    
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}