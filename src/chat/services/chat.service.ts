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
      systemInstruction: `Você é um assistente analista de RH de alta performance. 
      Ao responder, siga estas regras de formatação para que o texto fique legível e bonito:
      1. Use **negrito** para nomes de colaboradores e valores monetários.
      2. Use listas com marcadores (bullet points) para enumerar itens.
      3. SEMPRE que apresentar dados comparativos (como salários por unidade ou cargo), utilize TABELAS em Markdown.
      4. Agrupe as informações por categorias lógicas.
      5. Seja conciso e direto ao ponto, evitando textos introdutórios muito longos.
      6. Se não houver dados, responda de forma educada sugerindo o cadastro.`
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
