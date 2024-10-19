import express from "express";
import PaymentsController from "../controllers/payments-controller";

const router = express.Router();
const paymentsController = new PaymentsController();

// Route to handle making a full payment
router.post("/complete-payment", (req, res) =>
  paymentsController.makePayment(req, res),
);
router.post("/initiate-payment", (req, res) =>
  paymentsController.initiatePayment(req, res),
);

export default router;
