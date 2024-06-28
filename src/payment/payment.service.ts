import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Repository } from 'typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { AccountEntity } from '../account/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
    const { accountId, amount, description } = createPaymentDto;

    if (!createPaymentDto.amount) {
      throw new UnauthorizedException('Amount is required');
    }

    if (!createPaymentDto.accountId) {
      throw new UnauthorizedException('Account ID is required');
    }

    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.balance < amount) {
      throw new UnauthorizedException('Insufficient funds');
    }

    account.balance -= amount;
    await this.accountRepository.save(account);

    const payment = this.paymentRepository.create({
      accountId,
      amount,
      description,
    });

    return this.paymentRepository.save(payment);
  }

  async findAll() {
    return this.paymentRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (updatePaymentDto.amount) {
      throw new UnauthorizedException('Amount cannot be updated');
    }

    if (updatePaymentDto.description !== undefined) {
      payment.description = updatePaymentDto.description;
    }

    return this.paymentRepository.save(payment);
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }

  async salvarUrlDaImagem(url: string, paymentId: number): Promise<boolean> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id: paymentId },
      });
      if (!payment) {
        throw new Error(`Pagamento com ID ${paymentId} não encontrado.`);
      }

      payment.imageUrl = url; // Supondo que 'imageUrl' seja o nome do campo na entidade Payment para armazenar a URL da imagem
      await this.paymentRepository.save(payment);
      return true;
    } catch (error) {
      console.error(
        'Erro ao salvar URL da imagem no pagamento:',
        error.message,
      );
      return false;
    }
  }

  async uploadImagem(
    file: Express.MulterS3.File,
    paymentId: number,
  ): Promise<{ message: string; imageUrl?: string }> {
    if (!file) {
      return { message: 'Nenhum arquivo foi enviado' };
    }

    const imageUrl = file.location; // A URL pública da imagem após o upload para o S3
    const success = await this.salvarUrlDaImagem(imageUrl, paymentId);

    if (success) {
      return { message: 'URL da imagem salva com sucesso', imageUrl };
    } else {
      return { message: 'Falha ao salvar a URL da imagem' };
    }
  }
}
