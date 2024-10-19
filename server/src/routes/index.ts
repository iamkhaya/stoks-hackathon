import express from 'express';
import OpenPaymentsGrantController from '../controllers/grant-controller'; // Assuming this is the correct path
import PaymentsFlowController from '../action/make-payment'; // Assuming this is the correct path

const router = express.Router();
const paymentFlowController = new PaymentsFlowController();  // Create an instance of the controller
// Route to handle the grant creation
router.post('/make-payment', (req, res) => paymentFlowController.makePayment(req, res));

export default router;
