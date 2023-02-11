import express, { Request, Response } from 'express';
import Product from '../../models/Products';

const productRoute = express.Router();

productRoute.get('/index/:productName', async (req: Request, res: Response) => {
    try {
        const productName: string = req.params.productName;
        const product_instance = new Product();
        const index = await product_instance.index(productName);
        res.status(index.status).json(index);
    } catch(e){
        res.status(500).json({
            status:500,
            message:"An unexpected error occurred"
        });
    }
});

export default productRoute;
