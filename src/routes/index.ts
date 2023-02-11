import express from 'express';
import productRoute from './api/products';

const routes = express.Router();

routes.use('/api', productRoute);

export default routes;
