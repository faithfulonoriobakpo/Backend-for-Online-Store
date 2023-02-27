import express, {Request, Response} from "express";
import {order, Order} from "../../models/Orders";
import { authenticate } from "../../middlewares/auth";

const orderRouter = express.Router();

orderRouter.post('/create', authenticate, async (req:Request,res:Response) => {
    try{
        const order:order = req.body.order;
        if(!(order.id_of_products && order.quantity_of_each_product && order.user_id)){
            throw new TypeError("All parameters must have valid values");
        }
        if(!(Array.isArray(order.id_of_products) && Array.isArray(order.quantity_of_each_product) && Number.isInteger(order.user_id))){
            throw new TypeError("user_id must be a number, id of products and quantity of products must be arrays");
        }
        const orderInstance = new Order();
        const createdOrder = await orderInstance.createOrder(order);
        if(createdOrder){
            res.status(200).json({
                message:"order created successfully",
                data:createdOrder
            });
        }else{
            throw new Error("could not create user");
        }
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({status:400, message: "Could not create order:" + e.message});
        }else if(e instanceof Error){
            res.json({message: e.message?? "Could not create order"});
        }
    }
});

orderRouter.put('/complete/:orderId', authenticate, async (req:Request,res:Response) => {
    try{
        const orderId = Number(req.params.orderId);
        if(!(orderId && !isNaN(orderId))) throw new TypeError("orderId must be a number and cannot be null");
        const orderInstance = new Order();
        const completedOrder = await orderInstance.completeOrder(orderId); 
        res.status(200).json({
            message:"order completed successfully",
            data:completedOrder
        });
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({message:"Could not complete order:" + e.message});
        }else if(e instanceof Error){
            res.json({message: e.message ?? "Could not complete order"});
        }
    }
});

orderRouter.put('/cancel/:orderId', authenticate, async (req:Request,res:Response) => {
    try{
        const orderId = Number(req.params.orderId);
        if(!(orderId && !isNaN(orderId))) throw new TypeError("orderId must be a number and cannot be null");
        const orderInstance = new Order();
        const canceledOrder = await orderInstance.cancelOrder(orderId); 
        res.status(200).json({
            message:"order completed successfully",
            data:canceledOrder
        });
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({status:400, message: "Could not cancel order:" + e.message});
        }else if(e instanceof Error){
            res.json({message: "Could not cancel order:" + e.message});
        }
    }
});

orderRouter.get('/currentorders/:userId', authenticate, async (req:Request, res:Response) => {
    try{
        const userId = Number(req.params.userId);
        if(!(userId && !isNaN(userId))) throw new TypeError("userId must be a number and cannot be null");
        const orderInstance = new Order();
        const result = await orderInstance.currentOrders(userId);
        if(result.length > 0){
            res.status(200).json({
                message: "current orders fetched successfully",
                data: result
            });
        }else{
            res.status(200).json({
                message: "no active order was found for user",
                data: result
            });
        }
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({status:400, message:e.message});
        }else if(e instanceof Error){
            res.json({message: e.message ?? "Could not fetch current orders for user"});
        }
    }
});

orderRouter.get('/completedOrders/:userId', authenticate, async (req:Request, res:Response) => {
    try{
        const userId = Number(req.params.userId);
        if(!(userId && !isNaN(userId))) throw new TypeError("userId must be a number and cannot be null");
        const orderInstance = new Order();
        const result = await orderInstance.completedOrders(userId);
        if(result.length > 0){
            res.status(200).json({
                message: "completed orders fetched successfully",
                data: result
            });
        }else{
            res.status(200).json({
                message: "no completed order found for user",
                data:null
            });
        }
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({status:400, message: e.message});
        }else if(e instanceof Error){
            res.json({message: e.message ?? "Could not fetch completed orders"});
        }
    }
});

orderRouter.get('/canceledOrders/:userId', authenticate, async (req:Request, res:Response) => {
    try{
        const userId = Number(req.params.userId);
        if(!(userId && !isNaN(userId))) throw new TypeError("userId must be a number and cannot be null");
        const orderInstance = new Order();
        const result = await orderInstance.canceledOrders(userId);
        if(result.length > 0 ){
            res.status(200).json({
                message: "canceled orders fetched successfully",
                data: result
            });
        }else{
            res.status(200).json({
                message: "no canceled order found for user",
                data:null
            });
        }
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({status:400, message: e.message});
        }else if(e instanceof Error){
            res.json({error: e.message ?? "Could not fetch canceled orders"});
        }
    }
});

export default orderRouter;