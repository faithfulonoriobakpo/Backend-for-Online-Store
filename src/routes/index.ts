import express from 'express';
import productRoute from './api/products';
import userRouter from './api/users';

const routes = express.Router();

routes.use('/products', productRoute);
routes.use('/users', userRouter);

export default routes;
