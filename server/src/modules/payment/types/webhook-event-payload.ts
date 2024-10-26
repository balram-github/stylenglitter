export type OrderPaidWebhookEventPayload = {
  event: 'order.paid';
  payload: {
    order: {
      entity: {
        id: string;
        amount: number;
        amount_paid: number;
        amount_due: number;
        currency: string;
        receipt: string;
        status: 'paid';
        attempts: number;
        notes: any[];
        created_at: number;
      };
    };
  };
  created_at: number;
};

export type PaymentFailedWebhookEventPayload = {
  event: 'payment.failed';
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: 'failed';
        created_at: number;
        error_code: string;
        error_description: string;
        error_source: string;
        error_step: string;
        error_reason: string;
      };
    };
  };
  created_at: number;
};

export type RefundCreatedWebhookEventPayload = {
  event: 'refund.created';
  payload: {
    refund: {
      entity: {
        id: string;
        amount: 50000;
        currency: string;
        payment_id: string;
        status: 'created';
        created_at: number;
      };
    };
    payment: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: 'captured';
        created_at: number;
      };
    };
  };
  created_at: number;
};

export type RefundProcessedWebhookEventPayload = {
  event: 'refund.processed';
  payload: {
    refund: {
      entity: {
        id: string;
        amount: 50000;
        currency: string;
        payment_id: string;
        status: 'processed';
        created_at: number;
      };
    };
    payment: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: 'captured';
        created_at: number;
      };
    };
  };
  created_at: number;
};

export type RefundFailedWebhookEventPayload = {
  event: 'refund.failed';
  payload: {
    refund: {
      entity: {
        id: string;
        amount: 50000;
        currency: string;
        payment_id: string;
        status: 'failed';
        created_at: number;
      };
    };
    payment: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: 'captured';
        created_at: number;
      };
    };
  };
  created_at: number;
};

export type WebhookEventPayload =
  | OrderPaidWebhookEventPayload
  | PaymentFailedWebhookEventPayload
  | RefundCreatedWebhookEventPayload
  | RefundProcessedWebhookEventPayload
  | RefundFailedWebhookEventPayload;
