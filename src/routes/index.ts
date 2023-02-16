import express from 'express';
import productRoute from './api/products';
import userRouter from './api/users';
import orderRouter from './api/orders';

const routes = express.Router();

routes.use('/products', productRoute);
routes.use('/users', userRouter);
routes.use('/orders', orderRouter);

export default routes;
