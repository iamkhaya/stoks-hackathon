import { Request, Response } from 'express';
import OpenPaymentsGrantController from '../controllers/grant-controller';
import PaymentsController from '../controllers/payments-controller';
import QuotesController from '../controllers/quotes-controller';

class PaymentsFlowController {
  private OpenPaymentsGrantController: OpenPaymentsGrantController;
  private paymentsController: PaymentsController;
  private quoteController: QuotesController;

  constructor() {
    this.OpenPaymentsGrantController = new OpenPaymentsGrantController();
    this.paymentsController = new PaymentsController();
    this.quoteController = new QuotesController();
  }

  // Main function to handle making a full payment
  public async makePayment(req: Request, res: Response): Promise<void> {
    try {
      // 1. Create an Incoming Payment Grant
      const grantResponse = await this.OpenPaymentsGrantController.createGrant('incoming-payment');
      const incomingPaymentAccessToken = grantResponse.access_token.value;
      console.log('Incoming access token:', incomingPaymentAccessToken);

      // 2. Create an Incoming Payment using the Incoming Payment Grant
     
      const incomingPayment = await this.paymentsController.createIncomingPayment(process.env.PAYEE_WALLET_ADDRESS_URL||'', '100',grantResponse.access_token.value,'ZAR', );
        console.log('Incoming payment:', incomingPayment);
      const incomingPaymentUrl = incomingPayment.incomingPayment.id; // URL of the created incoming payment

      // 3. Create a Quote Grant
      const quoteGrantResponse = await this.OpenPaymentsGrantController.createGrant('quote');
        console.log('Quote grant response:', quoteGrantResponse);
      const quoteAccessToken = quoteGrantResponse.access_token.value;

      // 4. Create a Quote
      const quote = await this.quoteController.createQuote('ilp',process.env.PAYEE_WALLET_ADDRESS_URL||'',incomingPaymentUrl,quoteAccessToken);
      const quoteId = quote.quote.id;

      // 5. Create an Outgoing Payment Grant
      const outgoingGrantResponse = await this.OpenPaymentsGrantController.createGrant('outgoing-payment');
      console.log('Outgoing grant response:', outgoingGrantResponse);
      const outgoingPaymentAccessToken = outgoingGrantResponse.access_token.value;

      // 6. Create the Outgoing Payment
      const outgoingPayment = await this.paymentsController.createOutgoingPayment(process.env.PAYEE_WALLET_ADDRESS_URL||'',quoteId,outgoingPaymentAccessToken);
      console.log('Outgoing payment:', outgoingPayment);

      // Send the response back indicating the payment was successful
      res.status(200).json({
        message: 'Payment successfully made',
        incomingPayment,
        quote,
        outgoingPayment
      });
    } catch (error) {
      console.error('Error executing payment flow:', error);
      res.status(400).json({
        message: 'Error making payment',
        error,
      });
    }
  }
}

export default PaymentsFlowController;
