import { Request, Response } from 'express';
import OpenPaymentsService from '../services/open-payments-service';
import { StringifyOptions } from 'querystring';

class PaymentsController {
  private openPaymentsService: OpenPaymentsService;

  constructor() {
    const walletAddressUrl = process.env.WALLET_ADDRESS_URL ?? 'https://your-wallet.example.com';
    const privateKey = process.env.PRIVATE_KEY_PATH ?? '/path/to/private/key.pem';
    const keyId = process.env.KEY_ID ?? 'your-key-id';

    // Initialize the OpenPaymentsService instance
    this.openPaymentsService = new OpenPaymentsService(walletAddressUrl, privateKey, keyId);
  }

  // Create an incoming payment
  public async createIncomingPayment(walletAddress:string, incomingAmount:string, accessToken:string, currency:string ): Promise<any> {
    const incomingAmountBody = {
      value: incomingAmount,
      assetCode: currency,
      assetScale: 2
    }
    try {
      // Initialize the client
      await this.openPaymentsService.init();
      console.log(`walletAddress: ${walletAddress}, incomingAmount: ${incomingAmount}, accessToken: ${accessToken}, currency: ${currency}`);

      // Create an incoming payment
      const incomingPayment = await this.openPaymentsService.createIncomingPayment(
        { walletAddress, incomingAmount: incomingAmountBody },
        accessToken
      );
      console.log('Incoming payment successfully created:', incomingPayment);
    } catch (error) {
     console.error('Error creating incoming payment:', JSON.stringify(error));
    }
  }

  // Create an outgoing payment
  public async createOutgoingPayment(walletAddress:string, quoteId:string,accessToken: string): Promise<void> {

    try {
      // Initialize the client
      await this.openPaymentsService.init();

      // Create the outgoing payment
      const outgoingPayment = await this.openPaymentsService.createOutgoingPayment(
        { walletAddress, quoteId },
        accessToken
      );

      console.log('Outgoing payment successfully created:', outgoingPayment);
      return outgoingPayment;
    } catch (error) {
      console.error('Error creating outgoing payment:', error);
    }
  }
}

export default PaymentsController;
