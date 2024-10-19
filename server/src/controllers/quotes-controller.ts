import { Request, Response } from 'express';
import OpenPaymentsService from '../services/open-payments-service';

class QuotesController {
  private openPaymentsService: OpenPaymentsService;

  constructor() {
    const walletAddressUrl = process.env.WALLET_ADDRESS_URL ?? 'https://your-wallet.example.com';
    const privateKey = process.env.PRIVATE_KEY_PATH ?? '/path/to/private/key.pem';
    const keyId = process.env.KEY_ID ?? 'your-key-id';

    // Initialize the OpenPaymentsService instance
    this.openPaymentsService = new OpenPaymentsService(walletAddressUrl, privateKey, keyId);
  }

  // Request a quote grant
  public async requestQuoteGrant(authServerUrl:string): Promise<any> {

    try {
      // Initialize the client
      await this.openPaymentsService.init();

      // Request a quote grant
      const grant = await this.openPaymentsService.requestQuoteGrant(authServerUrl);

     console.log('Quote grant successfully requested:', grant);
     return grant;
    } catch (error) {
      console.error('Error requesting quote grant:', error);
    }
  }

  // Create a quote
  public async createQuote(method:string, walletAddress:string, receiver:string, accessToken:string): Promise<any> {

    try {
      // Initialize the client
      await this.openPaymentsService.init();

      // Create the quote
      const quote = await this.openPaymentsService.createQuote(
        { method, walletAddress, receiver },
        accessToken
      );
      console.log('Quote successfully created:', quote);
      return quote;
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  }
}

export default QuotesController;
