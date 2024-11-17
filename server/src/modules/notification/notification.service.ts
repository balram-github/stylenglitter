import * as fs from 'fs/promises';
import * as path from 'path';
import handlebars from 'handlebars';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationTopic } from './types/notification-topics';
import { OrderService } from '../order/order.service';
import { UserService } from '../user/user.service';
import { OrderStatusChangedNotificationPayload } from './types/order-status-changed-notification-payload';
import { OrderStatus } from '../order/types/order-status';

@Injectable()
export class NotificationService {
  private sesClient: SESClient;

  constructor(
    private readonly configService: ConfigService,
    private orderService: OrderService,
    private userService: UserService,
  ) {
    this.sesClient = new SESClient({
      region: this.configService.getOrThrow<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('aws.accessKey'),
        secretAccessKey: this.configService.getOrThrow<string>('aws.secretKey'),
      },
    });
  }

  private async sendEmail(to: string, subject: string, content: string) {
    const emailCommand = new SendEmailCommand({
      Source: this.configService.getOrThrow<string>('aws.ses.fromEmail'),
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: content },
        },
      },
    });

    await this.sesClient.send(emailCommand);
  }

  async sendEmailTemplate(
    to: string,
    subject: string,
    filePath: string,
    context: Record<string, unknown> = {},
  ) {
    const templateSource = (
      await fs.readFile(path.join(__dirname, 'templates', filePath), 'utf-8')
    ).toString();

    const template = handlebars.compile(templateSource);
    const htmlContent = template(context);

    console.log(htmlContent);

    // return this.sendEmail(to, subject, htmlContent);
  }

  @OnEvent(NotificationTopic.ORDER_STATUS_UPDATED)
  async handleOrderStatusChanged(
    payload: OrderStatusChangedNotificationPayload,
  ) {
    try {
      const order = await this.orderService.getOne({
        where: { id: payload.orderId },
        relations: ['shippingAddress'],
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const user = await this.userService.getOne({
        where: { id: order.userId },
      });

      if (!user) {
        throw new NotFoundException('Order creator not found');
      }

      switch (payload.status) {
        case OrderStatus.PLACED: {
          return this.sendEmailTemplate(
            user.email,
            'Order placed successfully!',
            'order-created.html',
            {
              orderNo: order.orderNo,
              shippingAddress: order.shippingAddress,
            },
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
