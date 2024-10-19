import { createAuthenticatedClient, AuthenticatedClient } from "@interledger/open-payments";

interface IncomingPaymentParams {
  walletAddress: string;
  incomingAmount: {
    value: string;
    assetCode: string;
    assetScale: number;
  };
  expiresAt?: string;
}

interface QuoteParams {
  method: string;
  walletAddress: string;
  receiver: string;
}

interface OutgoingPaymentParams {
  walletAddress: string;
  quoteId: string;
}

class OpenPaymentsService {
  private client: AuthenticatedClient | null = null;

  constructor(
    private walletAddressUrl: string,
    private privateKey: string,
    private keyId: string
  ) {}

  // Initialize the Open Payments authenticated client
  public async init(): Promise<void> {
    console.log('line 35, walletAddressUrl: ', process.env.WALLET_ADDRESS_URL, 'privateKey: ', process.env.PRIVATE_KEY, 'keyId: ', process.env.KEY_ID );
    this.client = await createAuthenticatedClient({
      walletAddressUrl: process.env.WALLET_ADDRESS_URL ?? "",
      privateKey: process.env.PRIVATE_KEY_PATH ?? "",
      keyId: process.env.KEY_ID ?? "",
    });
  }

  // Request an incoming payment grant
  public async requestIncomingPaymentGrant(authServerUrl: string): Promise<any> {
    if (!this.client) throw new Error("Client not initialized.");
    
    const grant = await this.client.grant.request(
      { url: authServerUrl },
      {
        access_token: {
          access: [
            {
              type: "incoming-payment",
              actions: ["list", "read", "read-all", "complete", "create"],
            },
          ],
        },
      }
    );

    return grant;
  }

  // Create an incoming payment
  public async createIncomingPayment(params: IncomingPaymentParams, accessToken: string): Promise<any> {
    if (!this.client) throw new Error("Client not initialized.");

    const incomingPayment = await this.client.incomingPayment.create(
      {
        url: new URL(this.walletAddressUrl).origin,
        accessToken,
      },
      {
        walletAddress: params.walletAddress,
        incomingAmount: params.incomingAmount,
        expiresAt: params.expiresAt ?? new Date(Date.now() + 60_000 * 10).toISOString(), // Optional expiry
      }
    );

    return incomingPayment;
  }

  // Request a quote grant
  public async requestQuoteGrant(authServerUrl: string): Promise<any> {
    if (!this.client) throw new Error("Client not initialized.");

    const grant = await this.client.grant.request(
      { url: authServerUrl },
      {
        access_token: {
          access: [
            {
              type: "quote",
              actions: ["create", "read", "read-all"],
            },
          ],
        },
      }
    );

    return grant;
  }

  // Create a quote
  public async createQuote(params: QuoteParams, accessToken: string): Promise<any> {
    if (!this.client) throw new Error("Client not initialized.");

    const quote = await this.client.quote.create(
      {
        url: new URL(this.walletAddressUrl).origin,
        accessToken,
      },
      {
        method: 'ilp',
        walletAddress: params.walletAddress,
        receiver: params.receiver,
      }
    );

    return quote;
  }

  // Request an outgoing payment grant
  public async requestOutgoingPaymentGrant(authServerUrl: string, limits: any, nonce: string): Promise<any> {
    if (!this.client) throw new Error("Client not initialized.");

    const grant = await this.client.grant.request(
      { url: authServerUrl },
      {
        access_token: {
          access: [
            {
              identifier: this.walletAddressUrl,
              type: "outgoing-payment",
              actions: ["list", "list-all", "read", "read-all", "create"],
              limits,
            },
          ],
        },
        interact: {
          start: ["redirect"],
          finish: {
            method: "redirect",
            uri: "http://localhost:3344", // Example redirect URI
            nonce,
          },
        },
      }
    );

    return grant;
  }

  // Create an outgoing payment
  public async createOutgoingPayment(params: OutgoingPaymentParams, accessToken: string): Promise<any> {
    if (!this.client) throw new Error("Client not initialized.");

    const outgoingPayment = await this.client.outgoingPayment.create(
      {
        url: new URL(this.walletAddressUrl).origin,
        accessToken,
      },
      {
        walletAddress: params.walletAddress,
        quoteId: params.quoteId,
      }
    );

    return outgoingPayment;
  }

  // Rotate the access token
  public async rotateToken(manageUrl: string, accessToken: string): Promise<any> {
    if (!this.client) throw new Error("Client not initialized.");

    const token = await this.client.token.rotate({
      url: manageUrl,
      accessToken,
    });

    return token;
  }

    public async getWalletAddress() {
    if (!this.client) throw new Error("Client not initialized.");
    return this.client.walletAddress.get({
      url: process.env.WALLET_ADDRESS_URL ?? "",
    });
  }
}

export default OpenPaymentsService;
