import express, {Request, Response} from "express";
import {order, Order} from "../../models/Orders";

const orderRouter = express.Router();

orderRouter.post('/create', async (req:Request,res:Response) => {
    try{
        const order:order = req.body.order;
        if(!(order.id && order.id_of_products && order.quantity_of_each_product && order.user_id)){
            throw new Error("Any order field cannot be empty or null");
        }
        const orderInstance = new Order();
        const createdOrder = await orderInstance.createOrder(order); 
        res.status(200).json({
            message:"order created successfully",
            data:createdOrder
        });
    }catch(e){
        if(e instanceof Error){
            res.json({error: "Could not create order:" + e.message});
        }
    }
});

orderRouter.post('/complete/:orderId', async (req:Request,res:Response) => {
    try{
        const orderId = Number(req.params.orderId);
        if(!(orderId && !isNaN(orderId))) throw new Error("orderId must be a number and cannot be null");
        const orderInstance = new Order();
        const completedOrder = await orderInstance.completeOrder(orderId); 
        res.status(200).json({
            message:"order completed successfully",
            data:completedOrder
        });
    }catch(e){
        if(e instanceof Error){
            res.json({error: "Could not complete order:" + e.message});
        }
    }
});

export default orderRouter;