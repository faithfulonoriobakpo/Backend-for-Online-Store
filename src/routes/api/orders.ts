import express, {Request, Response} from "express";
import {order, Order} from "../../models/Orders";

const orderRouter = express.Router();

orderRouter.post('/create', async (req:Request,res:Response) => {
    try{
        const order:order = req.body.order;
        if(!(order.id && order.id_of_products && order.quantity_of_each_product && order.user_id)){
            throw new Error("All parameters must have valid values");
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
            res.json({error: e.message ?? "Could not complete order:"});
        }
    }
});

orderRouter.post('/cancel/:orderId', async (req:Request,res:Response) => {
    try{
        const orderId = Number(req.params.orderId);
        if(!(orderId && !isNaN(orderId))) throw new Error("orderId must be a number and cannot be null");
        const orderInstance = new Order();
        const canceledOrder = await orderInstance.cancelOrder(orderId); 
        res.status(200).json({
            message:"order completed successfully",
            data:canceledOrder
        });
    }catch(e){
        if(e instanceof Error){
            res.json({error: e.message ?? "Could not complete order:"});
        }
    }
});

orderRouter.get('/currentorders/:userId', async (req:Request, res:Response) => {
    try{
        const userId = Number(req.params.userId);
        if(!(userId && !isNaN(userId))) throw new Error("userId must be a number and cannot be null");
        const orderInstance = new Order();
        const result = await orderInstance.currentOrders(userId);
        res.status(200).json({
            message: "current orders fetched successfully",
            data: result
        });
    }catch(e){
        if(e instanceof Error){
            res.json({error: e.message ?? "Could not complete order:"});
        }
    }
});

orderRouter.get('/completedOrders/:userId', async (req:Request, res:Response) => {
    try{
        const userId = Number(req.params.userId);
        if(!(userId && !isNaN(userId))) throw new Error("userId must be a number and cannot be null");
        const orderInstance = new Order();
        const result = await orderInstance.completedOrders(userId);
        res.status(200).json({
            message: "completed orders fetched successfully",
            data: result
        });
    }catch(e){
        if(e instanceof Error){
            res.json({error: e.message ?? "Could not fecth complete order:"});
        }
    }
});

orderRouter.get('/canceledOrders/:userId', async (req:Request, res:Response) => {
    try{
        const userId = Number(req.params.userId);
        if(!(userId && !isNaN(userId))) throw new Error("userId must be a number and cannot be null");
        const orderInstance = new Order();
        const result = await orderInstance.canceledOrders(userId);
        res.status(200).json({
            message: "canceled orders fetched successfully",
            data: result
        });
    }catch(e){
        if(e instanceof Error){
            res.json({error: e.message ?? "Could not fetch canceled orde:"});
        }
    }
});

export default orderRouter;