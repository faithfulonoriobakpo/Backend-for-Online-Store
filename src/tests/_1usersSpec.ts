import supertest from "supertest";
import { app } from "../server";

const request = supertest(app);

describe("Test all user endpoints for correct data input", async () => {

    let token:string;

    beforeAll(async () => {
        const res = await request.post('/authentication/generatetoken')
                                  .send({username:process.env.AUTH_USERNAME,password:process.env.AUTH_PASSWORD});
        token = res.body.token;
    });

    it("Expects user to be successfully created", async () => {
        const user = {firstname:"faithful",lastname:"onoriobakpo",password:"hashedPassword"};
        const response = await request.post('/api/users/create')
                                      .set('Authorization', `Bearer ${token}`)
                                      .send(user);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User created successfully');
        expect(response.body.data).toEqual(jasmine.objectContaining({
            id:jasmine.any(Number)
        }));
    });

    it("Expects message in json response to be 'users index retrieved successfully.'", async () => {
        const response = await request.get('/api/users/index')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('users index retrieved successfully.');
    });

    it("Expects message in data to contain id,firstname and lastname", async () => {
        //this test requires a user with id 1 to exist in the database to run successfully
        const response = await request.get('/api/users/show/1')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('user retrieved successfully');
        expect(response.body.data).toEqual(jasmine.objectContaining({
            id:jasmine.any(Number),
            firstname:jasmine.any(String),
            lastname:jasmine.any(String)
        }));
    });
});


describe("Test all user endpoints for error handling", async () => {

    let token:string;

    beforeAll(async () => {
        const res = await request.post('/authentication/generatetoken')
                                  .send({username:process.env.AUTH_USERNAME,password:process.env.AUTH_PASSWORD});
        token = res.body.token;
    });

    it("Expects endpoint to return error with message 'Access Denied. No Token Provided.'", async () => {
        const user = {firstname:"faithful",lastname:"onoriobakpo",password:"hashedPassword"};
        const response = await request.post('/api/users/create')
                                      .send(user);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Access Denied. No Token Provided.');
    });

    it("Expects endpoint to retun error with message firstname, lastname and password must be provided", async () => {
        const user = {firstname:"faithful",lastname:"onoriobakpo"};
        const response = await request.post('/api/users/create')
                                      .set('Authorization', `Bearer ${token}`)
                                      .send(user);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('firstname, lastname and password must be provided');
    });

    it("Expects endpoint to return error with message User Id must be a number and cannot be null", async () => {
        const response = await request.get('/api/users/show/one')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('User Id must be a number and cannot null.');
    });

    it("Expects endpoint to return error with message user with id 1200 does not exist", async () => {
        //this test requires a user with id in the case 1200 not to exist in the data to run successfully
        const response = await request.get('/api/users/show/1200')
                                      .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('user with id 1200 does not exist');
    });
});
