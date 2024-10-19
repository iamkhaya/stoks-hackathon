import express from 'express';
import OpenPaymentsGrantController from '../controllers/grant-controller'; // Assuming this is the correct path

const router = express.Router();
const grantController = new OpenPaymentsGrantController();  // Create an instance of the controller

// Route to handle the grant creation
router.post('/make-payment', (req, res) => grantController.createGrant(req, res));

export default router;
