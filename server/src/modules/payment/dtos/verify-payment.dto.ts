import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  razorpay_payment_id: string;

  @IsString()
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  razorpay_order_id: string;

  @IsString()
  @IsNotEmpty({ message: 'Field "$property" is required.' })
  razorpay_signature: string;
}
