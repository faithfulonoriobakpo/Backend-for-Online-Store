import express, {Request, Response} from "express";
import {order, Order} from "../../models/Orders";
import { authenticate } from "../../middlewares/auth";

const orderRouter = express.Router();

orderRouter.post('/create', authenticate, async (req:Request,res:Response) => {
    try{
        const user_id = req.body.user_id;
        if(!(user_id && Number.isInteger(user_id))){
            throw new TypeError("user_id must be a number and cannot be null");
        }
        const orderInstance = new Order();
        const createdOrder = await orderInstance.createOrder(user_id);
        if(createdOrder){
            res.status(200).json({
                message:"order created successfully",
                data:createdOrder
            });
        }else{
            throw new Error("could not create order");
        }
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({status:400, message: e.message});
        }else if(e instanceof Error){
            res.status(500).json({status:500, message: e.message?? "Could not create order"});
        }
    }
});

orderRouter.delete('/delete/:order_id', authenticate, async (req:Request,res:Response) => {
    try{
        const order_id = Number(req.params.order_id);
        if(!(order_id && Number.isInteger(order_id))){
            throw new TypeError("order_id must be a number and cannot be null");
        }
        const orderInstance = new Order();
        const deletedOrder = await orderInstance.deleteOrder(order_id);
        if(deletedOrder){
            res.status(200).json({
                message:"order deleted successfully",
                data:deletedOrder
            });
        }else{
            throw new Error("could not delete order");
        }
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({status:400, message: e.message});
        }else if(e instanceof Error){
            res.status(500).json({status:500, message: e.message?? "Could not create order"});
        }
    }
});

orderRouter.put('/addproduct', authenticate, async (req:Request,res:Response) => {
    try{
        const {product_id, order_id, price} = req.body;
        if(!(product_id && order_id && price)) throw new TypeError("product_id, order_id or price cannot be null");
        if(isNaN(product_id || isNaN(order_id) || isNaN(price))) throw new TypeError("product_id, order_id and price must be numbers");
        const orderInstance = new Order();
        const addedProduct = await orderInstance.addProduct(product_id,order_id,price);
        if(addedProduct){
            res.status(200).json(addedProduct);
        }else{
            throw new Error("Internal server error");
        }
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({message: e.message});
        }else if(e instanceof Error){
            res.status(500).json({message: e.message ?? "Could not add product"});
        }
    }
});

orderRouter.delete('/removeproduct', authenticate, async (req:Request,res:Response) => {
    try{
        const {product_id, order_id, price} = req.body;
        if(!(product_id && order_id && price)) throw new TypeError("product_id, order_id or price cannot be null");
        if(isNaN(product_id || isNaN(order_id) || isNaN(price))) throw new TypeError("product_id, order_id and price must be numbers");
        const orderInstance = new Order();
        const removedProduct = await orderInstance.removeProduct(product_id,order_id,price);
        if(removedProduct){
            res.status(200).json(removedProduct);
        }else{
            throw new Error("Internal server error");
        }
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({message: e.message});
        }else if(e instanceof Error){
            res.status(500).json({message: e.message ?? "Could not remove product"});
        }
    }
});

orderRouter.patch('/complete/:order_id', authenticate, async (req:Request,res:Response) => {
    try{
        const order_id = Number(req.params.order_id);
        if(!(order_id && !isNaN(order_id))) throw new TypeError("order_id must be a number and cannot be null");
        const orderInstance = new Order();
        const completedOrder = await orderInstance.completeOrder(order_id); 
        res.status(200).json({
            message:"order completed successfully",
            data:completedOrder
        });
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({message: e.message});
        }else if(e instanceof Error){
            res.status(500).json({message: e.message ?? "Could not complete order"});
        }
    }
});

orderRouter.patch('/cancel/:order_id', authenticate, async (req:Request,res:Response) => {
    try{
        const order_id = Number(req.params.order_id);
        if(!(order_id && !isNaN(order_id))) throw new TypeError("order_id must be a number and cannot be null");
        const orderInstance = new Order();
        const canceledOrder = await orderInstance.cancelOrder(order_id); 
        res.status(200).json({
            message:"order canceled successfully",
            data:canceledOrder
        });
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({status:400, message: e.message});
        }else if(e instanceof Error){
            res.json({message: e.message});
        }
    }
});

orderRouter.get('/currentorders/:userId', authenticate, async (req:Request, res:Response) => {
    try{
        const userId = Number(req.params.userId);
        if(!(userId && !isNaN(userId))) throw new TypeError("user_id must be a number and cannot be null");
        const orderInstance = new Order();
        const result = await orderInstance.currentOrders(userId);
        if(result && result.length > 0){
            res.status(200).json({
                message: "current orders fetched successfully",
                data: result
            });
        }else {
            res.status(200).json({
                message: "no active order with products was found for user",
                data: result
            });
        }
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({status:400, message: e.message});
        }else if(e instanceof Error){
            res.json({message: e.message ?? "Could not fetch current orders for user"});
        }
    }
});

orderRouter.get('/completedorders/:userId', authenticate, async (req:Request, res:Response) => {
    try{
        const userId = Number(req.params.userId);
        if(!(userId && !isNaN(userId))) throw new TypeError("user_id must be a number and cannot be null");
        const orderInstance = new Order();
        const result = await orderInstance.completedOrders(userId);
        if(result && result.length > 0){
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

orderRouter.get('/canceledorders/:userId', authenticate, async (req:Request, res:Response) => {
    try{
        const userId = Number(req.params.userId);
        if(!(userId && !isNaN(userId))) throw new TypeError("user_id must be a number and cannot be null");
        const orderInstance = new Order();
        const result = await orderInstance.canceledOrders(userId);
        if(result && result.length > 0 ){
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