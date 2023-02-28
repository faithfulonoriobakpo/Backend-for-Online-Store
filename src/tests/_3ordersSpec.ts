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
                order:{
                    "id_of_products":[1,5,3],
                    "quantity_of_each_product":[20,5,5],
                    "user_id":1
                }
            };
            const response = await request.post('/api/orders/create')
                                    .set('Authorization', `Bearer ${token}`)
                                    .send(body);
            expect(response.body.message).toBe("order created successfully");
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(jasmine.objectContaining({
                id:jasmine.any(Number),
                id_of_products:jasmine.any(Array),
                quantity_of_each_product:jasmine.any(Array),
                user_id:jasmine.any(Number),
                status:jasmine.any(String)
            }));
        });
    }

    //order for testing must have an active status
    it("Expect response message from complete order to be 'order completed successfully'", async () => {
        const response = await request.put('/api/orders/complete/1')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("order completed successfully");
        expect(response.body.data).toEqual(jasmine.objectContaining({
            id:jasmine.any(Number),
            id_of_products:jasmine.any(Array),
            quantity_of_each_product:jasmine.any(Array),
            user_id:jasmine.any(Number),
            status:jasmine.any(String)
        }));
    });

    //order for testing must have an active status
    it("Expect response message from cancel order to be 'order canceled successfully'", async () => {
        const response = await request.put('/api/orders/cancel/2')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("order canceled successfully");
        expect(response.body.data).toEqual(jasmine.objectContaining({
            id:jasmine.any(Number),
            id_of_products:jasmine.any(Array),
            quantity_of_each_product:jasmine.any(Array),
            user_id:jasmine.any(Number),
            status:jasmine.any(String)
        }));
    });

    //user id for testing must have a current order to work
    it("Expect response message from current orders to be 'current orders fetched successfully'", async () => {
        const response = await request.get('/api/orders/currentorders/1')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("current orders fetched successfully");
        expect(response.body.data[0]).toEqual(jasmine.objectContaining({
            id:jasmine.any(Number),
            id_of_products:jasmine.any(Array),
            quantity_of_each_product:jasmine.any(Array),
            user_id:jasmine.any(Number),
            status:jasmine.any(String)
        }));
    });

    //user id for testing must have a completed order to work
    it("Expect response message from completed orders to be 'completed orders fetched successfully'", async () => {
        const response = await request.get('/api/orders/completedorders/1')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("completed orders fetched successfully");
        expect(response.body.data[0]).toEqual(jasmine.objectContaining({
            id:jasmine.any(Number),
            id_of_products:jasmine.any(Array),
            quantity_of_each_product:jasmine.any(Array),
            user_id:jasmine.any(Number),
            status:jasmine.any(String)
        }));
    });

    //user id for testing must have a canceled order to work
    it("Expect response message from canceled orders to be 'canceled orders fetched successfully'", async () => {
        const response = await request.get('/api/orders/canceledorders/1')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("canceled orders fetched successfully");
        expect(response.body.data[0]).toEqual(jasmine.objectContaining({
            id:jasmine.any(Number),
            id_of_products:jasmine.any(Array),
            quantity_of_each_product:jasmine.any(Array),
            user_id:jasmine.any(Number),
            status:jasmine.any(String)
        }));
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
    it("Expect response message from create order to be 'All parameters must have valid values'", async () => {

        const response = await request.post('/api/orders/create')
                                .set('Authorization', `Bearer ${token}`);
        expect(response.body.message).toBe("All parameters must have valid values");
        expect(response.status).toBe(400);
    });

    //case where wrong order data type is provided for creation. user_id should be a number but string was given
    it("Expect response message from create order to be 'user_id must be a number, id of products and quantity of products must be arrays'", async () => {
        const body = {
            order:{
                "id_of_products":[1,5,3],
                "quantity_of_each_product":[20,5,5],
                "user_id":"five"
            }
        };
        const response = await request.post('/api/orders/create')
                                .set('Authorization', `Bearer ${token}`)
                                .send(body);
        expect(response.body.message).toBe("user_id must be a number, id of products and quantity of products must be arrays");
        expect(response.status).toBe(400);
    });

    //case where wrong data type is given as order id for complete order endpoint
    it("Expect response message from complete order to be 'orderId must be a number and cannot be null'", async () => {
        const response = await request.put('/api/orders/complete/three')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("orderId must be a number and cannot be null");
    });

    //case where inactive order id is given for complete
    it("Expect response message from complete order to be 'order is no longer active!'", async () => {
        const response = await request.put('/api/orders/complete/1')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("order is no longer active!");
    });

    //case where wrong data type is given as order id for cancel order endpoint
    it("Expect response message from cancel order to be 'orderId must be a number and cannot be null'", async () => {
        const response = await request.put('/api/orders/cancel/three')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("orderId must be a number and cannot be null");
    });

    //case where inactive order id is given for cancel order endpoint
    it("Expect response message from cancel order to be 'order is no longer active!'", async () => {
        const response = await request.put('/api/orders/cancel/2')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("order is no longer active!");
    });

    //case where wrong data type is given as user id for current orders
    it("Expect response message from current orders to be 'userId must be a number and cannot be null'", async () => {
        const response = await request.get('/api/orders/currentorders/three')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("userId must be a number and cannot be null");
    });
    
    //case where wrong data type is given as user id for completed orders
    it("Expect response message from completed orders to be 'userId must be a number and cannot be null'", async () => {
        const response = await request.get('/api/orders/completedorders/three')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("userId must be a number and cannot be null");
    });

    //case where wrong data type is given as user id for canceled orders
    it("Expect response message from canceled orders to be 'userId must be a number and cannot be null'", async () => {
        const response = await request.get('/api/orders/canceledorders/three')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(400);
        expect(response.body.message).toBe("userId must be a number and cannot be null");
    });

    //case where user with no canceled order is given for canceledorders order endpoint
    it("Expect response message from canceled orders to be 'no active order was found for user'", async () => {
        const response = await request.get('/api/orders/canceledorders/8')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("no canceled order found for user");
    });
    //case where user with no completed order is given for canceledorders order endpoint
    it("Expect response message from completed orders to be 'no active order was found for user'", async () => {
        const response = await request.get('/api/orders/completedorders/8')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("no completed order found for user");
    });
    //case where user with no current order is given for canceledorders order endpoint
    it("Expect response message from current orders to be 'no active order was found for user'", async () => {
        const response = await request.get('/api/orders/currentorders/8')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe("no active order was found for user");
    });
});
