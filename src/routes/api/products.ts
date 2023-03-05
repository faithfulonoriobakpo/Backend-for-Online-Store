import express, { Request, Response } from 'express';
import {Product} from '../../models/Products';
import { authenticate } from '../../middlewares/auth';

const productRoute = express.Router();

productRoute.get('/index', async (req: Request, res: Response) => {
    try {
        const product_instance = new Product();
        const index = await product_instance.index();
        if (index.length > 0) {
            res.status(200).json({
                status: 200,
                message: "products index retrieved successfully",
                data:index
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'products not found'
            });
        }
    } catch(e){
        res.status(500).json({
            status:500,
            message:"Something went wrong internally"
        });
    }
});

productRoute.get('/show/:id', async (req:Request, res:Response) => {
    try{
        const id = Number(req.params.id);
        if(isNaN(id)) throw new TypeError("product id must be a number");
        const product_instance = new Product();
        const product = await product_instance.show(id);
        if(product){
            res.status(200).json({
                status: 200,
                message: "product retrieved successfully",
                data: product
            });
        }else{
            res.status(404).json({
                status: 404,
                message: 'No product found for id given'
            });
        }
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

productRoute.post('/create', authenticate, async (req:Request, res:Response) => {
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
            if(response){
                res.status(200).json({
                    status: 200,
                    message: "product created successfully",
                    data: response
                });
            }else{
                res.status(500).json({
                    status: 500,
                    message: 'Could not create product'
                });
            }
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

productRoute.get('/category', async (req:Request, res:Response) => {
    try{
        const category:string = req.query.category as string;
        const product_instance = new Product();
        const result = await product_instance.show_products_by_category(category);
        if (result.length > 0){
            res.status(200).json({
                status: 200,
                message: "products retrieved successfully",
                data: result
            });
        }else{
            res.status(404).json({
                status: 404,
                message: 'product category not found'
            });
        }
    }catch(e){
        if(e instanceof Error){
            res.json({
                status:500,
                message:e.message ?? "Something went wrong internally"
            })
        }
    }
})

productRoute.get('/popular', async (req:Request, res:Response) => {
    try{
        const product_instance = new Product();
        const result = await product_instance.most_popular_products();
        if(result.length > 0) {
            res.status(200).json({
                status: 200,
                message: "products retrieved successfully",
                data: result
            });
        }else{
            res.status(404).json({
                status: 404,
                message: 'products not found'
            });
        }
    }catch(e){
        if(e instanceof Error){
            res.json({
                status:500,
                message:e.message ?? "Something went wrong internally"
            })
        }
    }
})

export default productRoute;
