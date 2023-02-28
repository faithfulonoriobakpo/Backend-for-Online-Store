import supertest from "supertest";
import { app } from "../server";

const request = supertest(app);

describe("Test all product endpoints for correct data input", async () => {

    let token:string;

    beforeAll(async () => {
        const res = await request.post('/authentication/generatetoken')
                                  .send({username:process.env.AUTH_USERNAME,password:process.env.AUTH_PASSWORD});
        token = res.body.token;
    });

    it("Expects response message for create product to be 'product created successfully'", async () => {
        const product = {
            name: "Laws of Power",
            price: 700,
            category: "Education"
        };
        const response = await request.post('/api/products/create')
                                      .set('Authorization', `Bearer ${token}`)
                                      .send(product);
        expect(response.status).toBe(200)
        expect(response.body.message).toBe('product created successfully');
        expect(response.body.data).toEqual(jasmine.objectContaining({
            id:jasmine.any(Number),
        }));
    });

    it("Expects response message for products index to be 'products index retrieved successfully'", async () => {
        const response = await request.get('/api/products/index');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('products index retrieved successfully');
        expect(response.body).toEqual(jasmine.objectContaining({
            status:jasmine.any(Number),
            message:jasmine.any(String),
            data:jasmine.any(Array)
        }));
    });

    it("Expects response message for product show to be 'product retrieved successfully'", async () => {
        const response = await request.get('/api/products/show/1');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('product retrieved successfully');
        expect(response.body.data).toEqual(jasmine.objectContaining({
            id:jasmine.any(Number),
            name:jasmine.any(String),
            price:jasmine.any(String),
            category:jasmine.any(String),
            orders_count:jasmine.any(Number)
        }));
    });

    it("Expects response message for product category to be 'products retrieved successfully", async () => {
        const response = await request.get('/api/products/category')
                                      .query({category:"Education"});
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('products retrieved successfully');
        expect(response.body.data).toEqual(jasmine.arrayContaining([{
            id:jasmine.any(Number),
            name:jasmine.any(String),
            price:jasmine.any(String),
            category:jasmine.any(String),
            orders_count:jasmine.any(Number)
        }]));
    });

    it("Expects response message for popular products to be 'products retrieved successfully", async () => {
        const response = await request.get('/api/products/popular');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('products retrieved successfully');
        expect(response.body.data).toEqual(jasmine.arrayContaining([{
            id:jasmine.any(Number),
            name:jasmine.any(String),
            price:jasmine.any(String),
            category:jasmine.any(String),
            orders_count:jasmine.any(Number)
        }]));
    });
});


describe("Test all product endpoints for error handling", async () => {

    let token:string;

    beforeAll(async () => {
        const res = await request.post('/authentication/generatetoken')
                                  .send({username:process.env.AUTH_USERNAME,password:process.env.AUTH_PASSWORD});
        token = res.body.token;
    });

    //product id not in database is provided to test endpoint
    it("Expects response message for product show to be 'No product found for id given' when id not in db given", async () => {
        const response = await request.get('/api/products/show/245');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No product found for id given');
    });

    it("Expects response message for product show to be 'product id must be a number' when NaN given", async () => {
        const response = await request.get('/api/products/show/seven');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('product id must be a number');
    });
    
    it("Expects response message for create product to be 'name, price and category cannot be empty' when data is not provided", async () => {
        const response = await request.post('/api/products/create')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('name, price and category cannot be empty');
    });

    it("Expects response message for create product to be 'Price must be a number' when string is provided instead of number", async () => {
        const product = {
            name: "Laws of Power",
            price: "seven hundred",
            category: "Education"
        };
        const response = await request.post('/api/products/create')
                                      .set('Authorization', `Bearer ${token}`)
                                      .send(product);
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Price must be a number');
    });
});
