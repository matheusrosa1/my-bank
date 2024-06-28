import { IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

export class ResponsePaymentDto {
  id: number;

  @IsNumber()
  accountId: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  date?: Date;

  @IsOptional()
  @IsString()
  description?: string;
}
