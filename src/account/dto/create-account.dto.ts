import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  typeAccount: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  balance: number;
}
