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
            message:"Something went wrong internally"
        });
    }
});

productRoute.get('/show/:index', async (req:Request, res:Response) => {
    try{
        const index = Number(req.params.index);
        if(isNaN(index)) throw new TypeError("index must be a number");
        const product_instance = new Product();
        const product = await product_instance.show(index);
        res.status(product.status).json(product);
    }catch(e){
        if (e instanceof TypeError){
            res.status(400).json({
                status: 400,
                message: e.message
            });
        }else{
            res.status(500).json({
                status: 500,
                message: "Something went wrong internally"
            });
        }
    }
})

productRoute.post('/create', async (req:Request, res:Response) => {
    try{
        if(req.body.name && req.body.price && req.body.category){
            const product = {
                name: req.body.name,
                price: Number(req.body.price),
                category:req.body.category
            };
            if(isNaN(product.price)) throw new TypeError("Price must be a number");
            const product_instance = new Product();
            const response = await product_instance.create(product);
            res.status(response.status).json(response);
        }else{
            res.status(400).json({
                status: 400,
                message: "name, price and category cannot be empty"
            });
        }
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({
                status:400,
                message: e.message
            });
        }else if(e instanceof Error){
            res.json({
                status:500,
                message:e.message ?? "Something went wrong internally"
            })
        }
    }
});

export default productRoute;
