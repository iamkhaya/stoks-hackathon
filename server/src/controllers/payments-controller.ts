// import dotenv from "dotenv";
// import { Request, Response } from "express";
// import OpenPaymentsService from "../services/open-payments-service";

// class PaymentsController {
//   quoteUrl: String;
//   constructor(quoteUrl: String) {
//     this.quoteUrl = quoteUrl;
//   }

//   public async createOutgoingPayment(req: Request, res: Response) {
//     dotenv.config();
//     const walletAddressUrl = process.env.WALLET_ADDRESS_URL ?? "";
//     const privateKeyPath = process.env.PRIVATE_KEY_PATH ?? "";
//     const keyId = process.env.KEY_ID ?? "";
//     const openPaymentsService = new OpenPaymentsService(
//       walletAddressUrl,
//       privateKeyPath,
//       keyId,
//     );
//     try {
//       const outgoingPayment = await openPaymentsService.createOutgoingPayment(
//         this.quoteUrl,
//       );
//       res.status(201).json(outgoingPayment);
//     } catch (error) {
//       if (error instanceof Error) {
//         res.status(400).json({ error: error.message });
//       } else {
//         res.status(400).json({ error: "An unknown error occurred" });
//       }
//     }
//   }
//   public async listOutgoingPayment(req: Request, res: Response) {
//     dotenv.config();
//     const walletAddressUrl = process.env.WALLET_ADDRESS_URL ?? "";
//     const privateKeyPath = process.env.PRIVATE_KEY_PATH ?? "";
//     const keyId = process.env.KEY_ID ?? "";
//     const openPaymentsService = new OpenPaymentsService(
//       walletAddressUrl,
//       privateKeyPath,
//       keyId,
//     );
//     try {
//       const outgoingPayment = await openPaymentsService.createOutgoingPayment(
//         this.quoteUrl,
//       );
//       res.status(201).json(outgoingPayment);
//     } catch (error) {
//       if (error instanceof Error) {
//         res.status(400).json({ error: error.message });
//       } else {
//         res.status(400).json({ error: "An unknown error occurred" });
//       }
//     }
//   }
// }
