import { Request, Response } from 'express';
import OpenPaymentsService  from '../services/open-payments-service';

class OpenPaymentsGrantController {
  private openPaymentsService: OpenPaymentsService;

  constructor() {
    const walletAddressUrl = process.env.WALLET_ADDRESS_URL ?? '';
    const privateKey = process.env.PRIVATE_KEY ?? '';
    const keyId = process.env.KEY_ID ?? '';
    this.openPaymentsService = new OpenPaymentsService(walletAddressUrl, privateKey, keyId);
  }

  // Method to create any type of grant based on the `grantType` in the request body
  public async createGrant(grantType:string ,limits?:number, nonce?:any): Promise<any> {

    try {
      // Get wallet address (assuming the service method exists for this)
      await this.openPaymentsService.init();
      const walletAddressBody = await this.openPaymentsService.getWalletAddress();

      let grant;

      // Handle different grant types dynamically
      switch (grantType) {
        case 'incoming-payment':
          grant = await this.openPaymentsService.requestIncomingPaymentGrant(walletAddressBody.authServer);
          break;

        case 'quote':
          grant = await this.openPaymentsService.requestQuoteGrant(walletAddressBody.authServer);
          break;

        case 'outgoing-payment':
          if (!limits || !nonce) {
            throw new Error("Limits and nonce are required for outgoing payment grant.");
          }
          grant = await this.openPaymentsService.requestOutgoingPaymentGrant(walletAddressBody.authServer, limits, nonce);
          break;

        default:
          throw new Error(`Unsupported grant type: ${grantType}`);
      }

      // Respond with the created grant
      console.log('Grant successfully created:', JSON.stringify(grant));
      return grant;
    } catch (error) {
      console.error('Error creating grant:', error);
    }
  }
}

export default OpenPaymentsGrantController;
