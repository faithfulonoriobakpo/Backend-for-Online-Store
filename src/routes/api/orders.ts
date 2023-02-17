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
        res.json({
            message:"order created successfully",
            data:createdOrder
        });
    }catch(e){
        if(e instanceof Error){
            res.json({error: "Could not create order:" + e.message});
        }
    }
});

export default orderRouter;