import { Request, Response } from "express";
import {
  createAuthenticatedClient,
  OpenPaymentsClientError,
  isFinalizedGrant,
  WalletAddress,
  IncomingPayment,
  GrantRequest,
  OutgoingPayment,
  Grant,
  GrantContinuation
} from "@interledger/open-payments";
import readline from "readline/promises";
import { createClient, id, AccountFlags, TransferFlags } from "tigerbeetle-node";


const PAYER_WALLET_ADDRESS = process.env.PAYER_WALLET_ADDRESS || "";
const PAYER_KEY_ID = process.env.KEY_ID || "";
const PAYER_PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH || "";
const PAYEE_WALLET_ADDRESS = process.env.PAYEE_WALLET_ADDRESS || "";

const tigerbeetleClient = createClient({
  cluster_id: 0n,
  replica_addresses: [
    "127.0.0.1:4000",
    "127.0.0.1:4001",
    "127.0.0.1:4002",
    "127.0.0.1:4003",
    "127.0.0.1:4004",
    "127.0.0.1:4005",
  ],
});

class PaymentsController {
  private client: any;

  constructor() {
    this.client = null;
  }

  // Initialize the Open Payments client
  private async initClient(): Promise<void> {
    this.client = await createAuthenticatedClient({
      walletAddressUrl: "https://ilp.interledger-test.dev/dionne-velfund", // Make sure the wallet address starts with https:// (not $), and has no trailing slashes
      privateKey: "/Users/dionnechasi/stoks-hackathon/server/private.key",
      keyId: "fac82984-86ba-45ef-b933-f9498194c5ed",
    });
  }

  // Track the payment in TigerBeetle (create or update accounts and transfer)
  private async trackInTigerBeetle(payerId: bigint, amount: string): Promise<void> {
    const velFundAccountId = 1n; // seeded VelFund account ID in TigerBeetle
    const payerAccountId = payerId;

    // Check if the payer account exists or create it
    const payerAccount = {
      id: payerAccountId,
      debits_pending: 0n,
      debits_posted: 0n,
      credits_pending: 0n,
      credits_posted: 0n,
      user_data_128: payerAccountId,
      user_data_64: BigInt(Date.now()), // realworld timestamp of the transaction
      user_data_32: 0, //locale
      reserved: 0,
      ledger: 1, // Same ledger as VelFund
      code: 1000, // used for contributions
      flags: AccountFlags.history,
      timestamp: 0n,
    };

    const accountErrors = await tigerbeetleClient.createAccounts([payerAccount]);
    if (accountErrors.length === 0) {
      console.log(`TigerBeetle: Payer account ${payerId} created or exists.`);
    } else {
      console.error("TigerBeetle: Error creating payer account:", accountErrors);
    }

    // Create a transfer from the payer to VelFund
    const transfer = {
      id: id(), // Unique transfer ID
      debit_account_id: payerAccountId, // Debit payer's account
      credit_account_id: velFundAccountId, // Credit VelFund account
      amount: BigInt(amount),
      pending_id: 0n,
      user_data_128: payerAccountId, // Track payer ID
      user_data_64: BigInt(Date.now()), // Timestamp for tracking
      user_data_32: 0,
      timeout: 0,
      ledger: 1, // Same ledger
      code: 720, // Custom code for transfers
      flags: TransferFlags.linked,
      timestamp: BigInt(Date.now()),
    };

    const transferErrors = await tigerbeetleClient.createTransfers([transfer]);
    if (transferErrors.length === 0) {
      console.log(`TigerBeetle: Transfer of ${amount} from ${payerId} to VelFund successful.`);
    } else {
      console.error("TigerBeetle: Error creating transfer:", transferErrors);
    }
  }

public async makePayment(req: Request, res: Response): Promise<void> {
  const { quoteID, outgoingPaymentGrantContinueUri, continueAccessToken } = req.body;
  
  console.log(`Received request with quoteID: ${quoteID}, outgoingPaymentGrantContinueUri: ${outgoingPaymentGrantContinueUri}, continueAccessToken: ${continueAccessToken}`);
  
  try {
    await this.initClient();

    const sendingWalletAddress = await this.getWalletAddress("https://ilp.interledger-test.dev/dionne-velfund");

    const finalizedOutgoingPaymentGrant = await this.getFinalizedOutgoingPaymentGrant(outgoingPaymentGrantContinueUri, continueAccessToken);

    const outgoingPayment = await this.createOutgoingPayment(sendingWalletAddress, finalizedOutgoingPaymentGrant, quoteID);

    console.log("Created outgoing payment:", outgoingPayment);

    // Return success response
    res.status(200).json({
      message: "Payment successfully made.",
      outgoingPayment,
    });
  } catch (error:any) {
    this.handleError(res, error, "Error making payment");
  }
}

/**
 * Retrieve the wallet address based on the provided URL.
 * @param {string} url - The URL of the wallet address to retrieve.
 * @returns {Promise<WalletAddress>} - The wallet address object.
 */
private async getWalletAddress(url: string): Promise<WalletAddress> {
  try {
    return await this.client.walletAddress.get({ url });
  } catch (error) {
    throw new Error(`Failed to retrieve wallet address from ${url}: ${error}`);
  }
}

/**
 * Retrieve the finalized outgoing payment grant.
 * @param {string} grantUri - The URI for continuing the outgoing payment grant.
 * @param {string} accessToken - The access token to continue the grant.
 * @returns {Promise<GrantContinuation>} - The finalized outgoing payment grant.
 */
private async getFinalizedOutgoingPaymentGrant(grantUri: string, accessToken: string): Promise<GrantContinuation> {
  try {
    return await this.client.grant.continue({
      url: grantUri,
      accessToken,
    });
  } catch (error) {
    throw new Error(`Failed to finalize outgoing payment grant: ${error}`);
  }
}

/**
 * Create the outgoing payment with the provided wallet address and finalized grant.
 * @param {WalletAddress} walletAddress - The sending wallet address object.
 * @param {Grant} finalizedGrant - The finalized outgoing payment grant.
 * @param {string} quoteID - The ID of the payment quote.
 * @returns {Promise<OutgoingPayment>} - The created outgoing payment object.
 */
private async createOutgoingPayment(walletAddress: WalletAddress, finalizedGrant: any, quoteID: string): Promise<OutgoingPayment> {
  try {
    return await this.client.outgoingPayment.create(
      {
        url: walletAddress.resourceServer,
        accessToken: finalizedGrant.access_token.value,
      },
      {
        walletAddress: walletAddress.id,
        quoteId: quoteID,
      }
    );
  } catch (error) {
    throw new Error(`Failed to create outgoing payment: ${error}`);
  }
}

/**
 * Handle and log errors, sending an appropriate response to the client.
 * @param {Response} res - The response object to send the error.
 * @param {Error} error - The error object to log and send.
 * @param {string} defaultMessage - The default error message.
 */
private handleError(res: Response, error: Error, defaultMessage: string): void {
  console.error(defaultMessage, error);
  res.status(500).json({
    message: defaultMessage,
    error: error.message,
  });
}


  /**
 * Initiates a payment process by retrieving wallet addresses, creating an incoming payment,
 * generating a quote, and preparing an outgoing payment.
 * 
 * This method performs the following steps:
 * 1. Initializes the payment client.
 * 2. Retrieves sending and receiving wallet addresses from the specified Interledger Payment Platform (ILP) URLs.
 * 3. Requests a grant for the incoming payment associated with the receiving wallet address.
 * 4. Creates an incoming payment for the receiving wallet address.
 * 5. Requests a grant for a quote associated with the sending wallet address.
 * 6. Creates a quote for the payment based on the sending wallet's information and the incoming payment details.
 * 7. Requests a grant for an outgoing payment from the sending wallet, preparing the final stage of the payment process.
 * 
 * After successful execution, a JSON response with the quote, incoming payment, and outgoing payment grant details is sent
 * back to the client. If an error occurs, it is logged and a failure response is sent.
 * 
 * @param {Request} req - The HTTP request containing the necessary parameters for the payment process.
 * @param {Response} res - The HTTP response object used to send the outcome of the payment process.
 * @returns {Promise<void>} - No return value, but sends a response to the client containing payment details.
 * 
 * @throws {Error} - If any step of the payment initiation process fails, an error is logged and handled appropriately.
 */
  public async initiatePayment(req: Request, res: Response): Promise<void> {
    try {
      await this.initClient();

      // Retrieve sending and receiving wallet addresses
      const sendingWalletAddress: WalletAddress =
        await this.client.walletAddress.get({
          url: "https://ilp.interledger-test.dev/dionne-velfund",
        });
      const receivingWalletAddress: WalletAddress =
        await this.client.walletAddress.get({
          url: "https://ilp.interledger-test.dev/khaya-stokvel",
        });

      console.log("Got wallet addresses", {
        receivingWalletAddress,
        sendingWalletAddress,
      });

      //Get a grant for the incoming payment (receiving wallet)
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
      console.log("Successfully created: Incoming payment grant", incomingPaymentGrant);

      //Create the incoming payment
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
      console.log("Sucessfully created incoming payment:", incomingPayment);

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
      console.log("Successfully created quote grant:", quoteGrant);

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
      console.log("Successfully created quote", quote);

      // Get an outgoing payment grant (sending wallet)
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
      console.log(
        "Successfully created pending outgoing payment grant:",
        outgoingPaymentGrant
      );
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
