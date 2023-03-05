import supertest from "supertest";
import { app } from "../server";

const request = supertest(app);

describe("Test all order endpoints for correct data input", () => {

    let token:string;

    beforeAll(async () => {
        const res = await request.post('/authentication/generatetoken')
                                  .send({username:process.env.AUTH_USERNAME,password:process.env.AUTH_PASSWORD});
        token = res.body.token;
    });

    //looped test 3 times because 3 order ids are needed
    for(let i=0;i<3;i++){
        it("Expect response message from create order to be 'order created successfully'", async () => {
            const body = {
                "user_id":1
            };
            const response = await request.post('/api/orders/create')
                                    .set('Authorization', `Bearer ${token}`)
                                    .send(body);
            expect(response.body.message).toBe("order created successfully");
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(jasmine.objectContaining({
                id:jasmine.any(Number)
            }));
        });
    }

    //looped test multiple times because multiple products are needed in order_items
    for(let i=0;i<10;i++){
        it(`Expect response message from add product to be ${(i==0 || i==4 || i == 7)?'product added successfully':'product increased successfully'} `, async () => {
            const body = {
                "order_id":i > 3?(i > 6? 3 : 2): 1,
                "product_id":1,
                "price":500
            };
            const response = await request.put('/api/orders/addproduct')
                                    .set('Authorization', `Bearer ${token}`)
                                    .send(body);
            (i==0 || i==4 || i == 7)? expect(response.body.message).toBe("product added successfully")
            :expect(response.body.message).toBe("product increased successfully");
            expect(response.status).toBe(200);
        });
    }

    it("Expect response message from reduce product to be 'product reduced successfully'", async () => {
        const body = {
            "order_id":1,
            "product_id":1,
            "price":500
        };
        const response = await request.delete('/api/orders/removeproduct')
                                .set('Authorization', `Bearer ${token}`)
                                .send(body);
        expect(response.body.message).toBe("product reduced successfully");
        expect(response.status).toBe(200);
    });

    //order for testing must have an active status
    it("Expect response message from complete order to be 'order completed successfully'", async () => {
        const response = await request.patch('/api/orders/complete/1')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("order completed successfully");
    });

    //order for testing must have an active status
    it("Expect response message from cancel order to be 'order canceled successfully'", async () => {
        const response = await request.patch('/api/orders/cancel/2')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("order canceled successfully");
    });

    //user id for testing must have a current order to work
    it("Expect response message from current orders to be 'current orders fetched successfully'", async () => {
        const response = await request.get('/api/orders/currentorders/1')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("current orders fetched successfully");
    });

    //user id for testing must have a completed order to work
    it("Expect response message from completed orders to be 'completed orders fetched successfully'", async () => {
        const response = await request.get('/api/orders/completedorders/1')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("completed orders fetched successfully");
    });

    //user id for testing must have a canceled order to work
    it("Expect response message from canceled orders to be 'canceled orders fetched successfully'", async () => {
        const response = await request.get('/api/orders/canceledorders/1')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("canceled orders fetched successfully");
    });

    //this test was added here because we need orders to test for popularity
    it("Expects response message for popular products to be 'products retrieved successfully", async () => {
        const response = await request.get('/api/products/popular');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('products retrieved successfully');
        expect(response.body.data).toEqual(jasmine.arrayContaining([{
            id:jasmine.any(Number),
            name:jasmine.any(String),
            price:jasmine.any(String),
            category:jasmine.any(String)
        }]));
    });
});


describe("Test all order endpoints for error handling", async () => {

    let token:string;

    beforeAll(async () => {
        const res = await request.post('/authentication/generatetoken')
                                  .send({username:process.env.AUTH_USERNAME,password:process.env.AUTH_PASSWORD});
        token = res.body.token;
    });

    //case when order data isn't provided for creation
    it("Expect response message from create order to be 'user_id must be a number and cannot be null'", async () => {

        const response = await request.post('/api/orders/create')
                                .set('Authorization', `Bearer ${token}`);
        expect(response.body.message).toBe("user_id must be a number and cannot be null");
        expect(response.status).toBe(400);
    });

    //case where wrong data type is given as order id for complete order endpoint
    it("Expect response message from complete order to be 'order_id must be a number and cannot be null'", async () => {
        const response = await request.patch('/api/orders/complete/three')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("order_id must be a number and cannot be null");
    });

    //case where inactive order id is given for complete
    it("Expect response message from complete order to be 'order does not exist or no longer active'", async () => {
        const response = await request.patch('/api/orders/complete/1')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("order does not exist or no longer active");
    });

    //case where wrong data type is given as order id for cancel order endpoint
    it("Expect response message from cancel order to be 'orderId must be a number and cannot be null'", async () => {
        const response = await request.patch('/api/orders/cancel/three')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("order_id must be a number and cannot be null");
    });

    //case where inactive order id is given for cancel order endpoint
    it("Expect response message from cancel order to be 'order does not exist or no longer active'", async () => {
        const response = await request.patch('/api/orders/cancel/2')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("order does not exist or no longer active");
    });

    //case where wrong data type is given as user id for current orders
    it("Expect response message from current orders to be 'user_id must be a number and cannot be null'", async () => {
        const response = await request.get('/api/orders/currentorders/three')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("user_id must be a number and cannot be null");
    });
    
    //case where wrong data type is given as user id for completed orders
    it("Expect response message from completed orders to be 'user_id must be a number and cannot be null'", async () => {
        const response = await request.get('/api/orders/completedorders/three')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("user_id must be a number and cannot be null");
    });

    //case where wrong data type is given as user id for canceled orders
    it("Expect response message from canceled orders to be 'user_id must be a number and cannot be null'", async () => {
        const response = await request.get('/api/orders/canceledorders/three')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("user_id must be a number and cannot be null");
    });

    //case where user with no canceled order is given for canceledorders order endpoint
    it("Expect response message from canceled orders to be 'no canceled order was found for user'", async () => {
        const response = await request.get('/api/orders/canceledorders/8')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("no canceled order found for user");
    });
    //case where user with no completed order is given for completedorders order endpoint
    it("Expect response message from completed orders to be 'no active order was found for user'", async () => {
        const response = await request.get('/api/orders/completedorders/8')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("no completed order found for user");
    });
    //case where user with no current order is given for canceledorders order endpoint
    it("Expect response message from current orders to be 'no active order with products was found for user'", async () => {
        const response = await request.get('/api/orders/currentorders/8')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("no active order with products was found for user");
    });
});
