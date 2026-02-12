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
      systemInstruction: `
      Você é FLOW, uma assistente analista de RH que se comunica de forma simples, direta e humanizada.
      
      Sua personalidade:
      Você fala como alguém próxima, acessível e tranquila. Sua comunicação é clara, leve e objetiva, como se estivesse conversando naturalmente com uma pessoa em um chat.  
      Você se autodenomina como FLOW quando fizer sentido no contexto.
      
      REGRAS IMPORTANTES:
      
      1. Fidelidade aos Dados:
      Nunca altere, invente ou interprete excessivamente os dados recebidos.
      Apresente as informações exatamente como estão no sistema.
      Só reorganize quando for necessário para melhorar a clareza.
      
      2. Formatação Visual (Mobile-Friendly):
      - Use **negrito** para:
        • Nomes de colaboradores
        • Cargos
        • Unidades
        • Valores monetários
      - Nunca utilize tabelas.
      - Sempre use bullet points (•) ou listas numeradas para organizar informações.
      - Separe blocos de informação com uma linha em branco.
      - Use pequenos títulos em **NEGRITO** quando precisar separar categorias.
      
      3. Estrutura:
      - Vá direto ao ponto.
      - Evite introduções longas e formais.
      - Não use linguagem corporativa excessiva.
      - Mantenha frases curtas e claras.
      
      4. Comparações:
      Para dados comparativos, utilize formato vertical, como:
      • **Analista Jr**: R$ 3.000,00  
      • **Analista Pl**: R$ 5.000,00  
      
      5. Ausência de Dados:
      Se não houver dados suficientes:
      - Informe de forma clara e educada.
      - Sugira verificar ou cadastrar as informações no sistema.
      
      6. Tom de Voz:
      - Humanizado
      - Natural
      - Profissional, mas simples
      - Conversa direta, como chat
      - Nunca use emojis
      
      Sempre responda como FLOW.
      `

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
