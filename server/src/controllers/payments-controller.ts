import { Request, Response } from 'express';
import {
  createAuthenticatedClient,
  OpenPaymentsClientError,
  isFinalizedGrant,
  WalletAddress,
} from "@interledger/open-payments";
import readline from "readline/promises";

const PAYER_WALLET_ADDRESS = process.env.PAYER_WALLET_ADDRESS || "";
const PAYER_KEY_ID = process.env.KEY_ID || "";
const PAYER_PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH || "";
const PAYEE_WALLET_ADDRESS = process.env.PAYEE_WALLET_ADDRESS || "";
class PaymentsController {
  private client: any;
  

  constructor() {
    this.client = null;
  }

  // Initialize the Open Payments client
  private async initClient(): Promise<void> {
    this.client = await createAuthenticatedClient({
    walletAddressUrl: 'https://ilp.interledger-test.dev/dionne-velfund' , // Make sure the wallet address starts with https:// (not $), and has no trailing slashes
    privateKey:'/Users/dionnechasi/stoks-hackathon/server/private.key',
    keyId: 'fac82984-86ba-45ef-b933-f9498194c5ed',
    });
  }

  // Main method to make a payment
  public async makePayment(req: Request, res: Response): Promise<void> {
    const {finalizedOutgoingPaymentGrantAccessTokenValue,  quoteID} = req.body;
     const sendingWalletAddress: WalletAddress = await this.client.walletAddress.get({
        url: 'https://ilp.interledger-test.dev/dionne-velfund', // Make sure the wallet address starts with https:// (not $)
      });
    
    try {
      await this.initClient();

      // Step 8: Create the outgoing payment
      const outgoingPayment = await this.client.outgoingPayment.create(
        {
          url: sendingWalletAddress.resourceServer,
          accessToken: finalizedOutgoingPaymentGrantAccessTokenValue,
        },
        {
          walletAddress: sendingWalletAddress.id,
          quoteId: quoteID,
        }
      );
      console.log("\nStep 7: Created outgoing payment", outgoingPayment);

      // Return the final result of the payment flow
      res.status(200).json({
        message: "Payment successfully made.",
      });

    } catch (error) {
      console.error("Error making payment:", error);
      res.status(500).json({
        message: "Error making payment",
        error,
      });
    }
  }

  public async initiatePayment(req: Request, res: Response): Promise<void> {
     try {
      await this.initClient();

      // Step 1: Retrieve sending and receiving wallet addresses
      const sendingWalletAddress: WalletAddress = await this.client.walletAddress.get({
        url: 'https://ilp.interledger-test.dev/dionne-velfund',
      });
      const receivingWalletAddress: WalletAddress = await this.client.walletAddress.get({
        url: 'https://ilp.interledger-test.dev/khaya-stokvel',
      });

      console.log("Got wallet addresses", { receivingWalletAddress, sendingWalletAddress });

      // Step 2: Get a grant for the incoming payment (receiving wallet)
      const incomingPaymentGrant = await this.client.grant.request(
        {
          url: receivingWalletAddress.authServer,
        },
        {
          access_token: {
            access: [
              {
                type: "incoming-payment",
                actions: ["read", "complete", "create"],
              },
            ],
          },
        }
      );
      console.log("\nStep 1: got incoming payment grant", incomingPaymentGrant);

      // Step 3: Create the incoming payment
      const incomingPayment = await this.client.incomingPayment.create(
        {
          url: receivingWalletAddress.resourceServer,
          accessToken: incomingPaymentGrant?.access_token?.value,
        },
        {
          walletAddress: receivingWalletAddress.id,
          incomingAmount: {
            assetCode: receivingWalletAddress.assetCode,
            assetScale: receivingWalletAddress.assetScale,
            value: "1000",
          },
        }
      );
      console.log("\nStep 2: created incoming payment", incomingPayment);

      // Step 4: Get a quote grant (sending wallet)
      const quoteGrant = await this.client.grant.request(
        {
          url: sendingWalletAddress.authServer,
        },
        {
          access_token: {
            access: [
              {
                type: "quote",
                actions: ["create", "read"],
              },
            ],
          },
        }
      );
      console.log("\nStep 3: got quote grant", quoteGrant);

      // Step 5: Create a quote
      const quote = await this.client.quote.create(
        {
          url: sendingWalletAddress.resourceServer,
          accessToken: quoteGrant.access_token.value,
        },
        {
          walletAddress: sendingWalletAddress.id,
          receiver: incomingPayment.id,
          method: "ilp",
        }
      );
      console.log("\nStep 4: got quote", quote);

      // Step 6: Get an outgoing payment grant (sending wallet)
      const outgoingPaymentGrant = await this.client.grant.request(
        {
          url: sendingWalletAddress.authServer,
        },
        {
          access_token: {
            access: [
              {
                type: "outgoing-payment",
                actions: ["read", "create"],
                limits: {
                  debitAmount: {
                    assetCode: quote.debitAmount.assetCode,
                    assetScale: quote.debitAmount.assetScale,
                    value: quote.debitAmount.value,
                  },
                },
                identifier: sendingWalletAddress.id,
              },
            ],
          },
          interact: {
            start: ["redirect"],
          },
        }
      );
      console.log("\nStep 5: got pending outgoing payment grant", outgoingPaymentGrant);
       res.status(200).json({
        message: "Payment successfully made.",
        redirect: outgoingPaymentGrant.interact.redirect,
        quote,
        incomingPayment,
        outgoingPaymentGrant,
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      }
  }
}

export default PaymentsController;
