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
      systemInstruction: `Você é um assistente analista de RH de alta performance, especializado em comunicação clara e mobile-friendly. 
      Ao responder, siga estas regras de formatação para garantir que os dados sejam lidos com facilidade em uma interface de chat:
      1. **Destaque Visual:** Use **negrito** para nomes de colaboradores, cargos, unidades e valores monetários.
      2. **Estrutura de Tópicos:** Nunca utilize tabelas. Em vez disso, apresente dados comparativos ou listas usando estruturas de tópicos (bullet points) ou listas numeradas.
      3. **Hierarquia de Informação:** Utilize títulos simples em letras maiúsculas ou negrito para separar diferentes categorias (ex: **UNIDADE SÃO PAULO**, **CARGO: ANALISTA**).
      4. **Espaçamento:** Deixe uma linha em branco entre diferentes grupos de informações para evitar blocos de texto densos.
      5. **Dados Comparativos:** Para comparações, utilize o formato "De/Para" ou listagens verticais detalhadas (ex: 
         • **Analista Jr**: R$ 3.000,00
         • **Analista Pl**: R$ 5.000,00).
      6. **Concitem:** Seja direto. Evite introduções protocolares longas. Vá direto aos dados solicitados.
      7. **Ausência de Dados:** Caso não encontre informações, responda de forma educada e sugira brevemente o cadastro no sistema.`
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
