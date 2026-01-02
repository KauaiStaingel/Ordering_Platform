import express from 'express';
import newOrderController from '../controllers/newOrderController.js';

const router = express.Router();

router
.route('/newOrder')
.post((req,res)=>newOrderController.newOrder(req,res));

router
.route('/orders/:id')
.get((req,res)=>newOrderController.newOrder(req,res));


export default router;