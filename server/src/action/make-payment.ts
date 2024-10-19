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
      const incomingPaymentAccessToken = grantResponse.grant.access_token.value;

      // 2. Create an Incoming Payment using the Incoming Payment Grant
      const incomingPaymentBody = {
        walletAddress: req.body.payeeWalletAddress,
        incomingAmount: {
          value: req.body.amountValue,
          assetCode: req.body.assetCode || 'USD',
          assetScale: req.body.assetScale || 2
        },
        accessToken: incomingPaymentAccessToken
      };
      const incomingPayment = await this.paymentsController.createIncomingPayment(process.env.WALLET_ADDRESS||'', '100','USD', grantResponse.grant.access_token.value);
      const incomingPaymentUrl = incomingPayment.incomingPayment.id; // URL of the created incoming payment

      // 3. Create a Quote Grant
      const quoteGrantResponse = await this.OpenPaymentsGrantController.createGrant('quote');
      const quoteAccessToken = quoteGrantResponse.grant.access_token.value;

      // 4. Create a Quote
      const quoteBody = {
        method: 'ilp',
        walletAddress: req.body.payerWalletAddress,
        receiver: incomingPaymentUrl,
        accessToken: quoteAccessToken
      };
      const quote = await this.quoteController.createQuote('ilp',process.env.WALLET_ADDRESS||'',incomingPaymentUrl,quoteAccessToken);
      const quoteId = quote.quote.id;

      // 5. Create an Outgoing Payment Grant
      const outgoingGrantResponse = await this.OpenPaymentsGrantController.createGrant('outgoing-payment');
      const outgoingPaymentAccessToken = outgoingGrantResponse.grant.access_token.value;

      // 6. Create the Outgoing Payment
      const outgoingPaymentBody = {
        walletAddress: req.body.payerWalletAddress,
        quoteId: quoteId,
        accessToken: outgoingPaymentAccessToken
      };
      const outgoingPayment = await this.paymentsController.createOutgoingPayment(process.env.WALLET_ADDRESS||'',quoteId,outgoingPaymentAccessToken);

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
