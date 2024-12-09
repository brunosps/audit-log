import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AppService } from './app.service';
import { MinhaTabela } from './entities/minha-tabela.model';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectModel(MinhaTabela)
    private readonly minhaTabela: typeof MinhaTabela) { }

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {

    return {
      message: 'User created successfully',
      user: createUserDto,
    };
  }

  @Get()
  async getHello(): Promise<string> {
    try {

      const novoRegistro = await this.minhaTabela.create({
        com_id_lote: 12345,
        pes_migrado: true,
        vou_cpf: '12345678901234',
        data: new Date('2024-11-05'),
        dataInicio: new Date('2024-11-01T08:00:00Z'),
        dataFim: new Date('2024-11-30T17:00:00Z'),
        primeiraParcela: 500.00,
        ultimaParcela: 1000.00,
        tipo: 'CONSORCIO',
        status: 'ATIVO',
        codigoUnidadeNegocio: 10,
        contrato_informacoes: 'Informações detalhadas do contrato.',
        dados_anexo: 'Dados adicionais ou anexos.',
        men_status: 1,
        payload: 'Dados adicionais no formato JSON ou texto.',
        nome: 'Nome Completo do Cliente',
        sincronizado: 0,
      });

      console.log('Registro criado com sucesso:', novoRegistro);
    } catch (error) {
      console.error('Erro ao criar o registro:', error);
    }

    return this.appService.getHello();
  }

  @Get('/divisao/:number1/:number2')
  async divisao(@Param('number1') number1: number, @Param('number2') number2: number) {

    if (number2 == 0) {
      // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      throw new Error('O divisor não pode ser zero')
    }

    return { divisao: number1 / number2 };
  }
}
