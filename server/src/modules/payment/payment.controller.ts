import {
  BadRequestException,
  Body,
  Controller,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { VerifyPaymentDto } from './dtos/verify-payment.dto';
import { WebhookEventPayload } from './types/webhook-event-payload';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  /**
   * Verify payment signature
   */
  @Post('/verify')
  async verifyPayment(@Body() body: VerifyPaymentDto) {
    const isVerified = await this.paymentService.verifyPaymentSignature(body);

    if (!isVerified) {
      throw new BadRequestException('Failed to verify payment signature');
    }

    return true;
  }

  /**
   * Handle payment related webhooks
   */
  @Post('/webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Body() body: WebhookEventPayload,
  ) {
    const raw = req.rawBody!;

    const signature = req.headers['X-Razorpay-Signature'];

    const isVerified = await this.paymentService.verifyWebhookSignature({
      payload: raw,
      signature,
    });

    if (!isVerified) {
      throw new BadRequestException('Failed to verify payment signature');
    }

    return this.paymentService.handleWebhookEvent(body);
  }
}
