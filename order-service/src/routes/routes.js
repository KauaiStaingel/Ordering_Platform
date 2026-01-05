import express from 'express';
import newOrderController from '../controllers/newOrderController.js';
import getOrderController from '../controllers/getOrderController.js';

const router = express.Router();

router
.route('/newOrder')
.post((req,res)=>newOrderController.newOrder(req,res));

router
.route('/orders/:id')
.get((req,res)=>getOrderController.newOrder(req,res));


export default router;