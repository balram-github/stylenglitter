export interface RazorpayOptions {
  key: string;
  amount: string | number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color?: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

export interface Razorpay {
  new (options: RazorpayOptions): {
    on: (event: string, handler: (response: RazorpayErrorResponse) => void) => void;
    open: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: Razorpay;
  }
} 