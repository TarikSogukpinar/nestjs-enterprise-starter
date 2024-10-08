import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'İsim alanı boş olamaz' })
  name: string;

  @IsEmail({}, { message: 'Geçerli bir e-posta adresi girin' })
  email: string;

  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
  password: string;
}
