import { query } from "express";
import Client from "../database";
import { Product } from "./Products";

type order = {
    id:number,
    user_id: number,
    status?:string
};

type orders = {
    id:number,
    product_id:number,
    quantity:number,
    price:number
};

class Order{

    private async userExists(user_id:number):Promise<boolean>{
        try{
            const conn = await Client.connect();
            const result = await conn.query("SELECT * FROM users WHERE id=$1",[user_id]);
            conn.release();
            if(result.rowCount > 0) return true;
            return false;
        }catch(e){
            if(e instanceof Error) throw new Error(e.message);
            throw new Error('Error occurred while confirming if user exists');
        }
    }

    private async orderNotEmpty(order_id:number):Promise<boolean>{
        try{
            const conn = await Client.connect();
            const result = await conn.query("SELECT * FROM order_items WHERE order_id=$1",[order_id]);
            conn.release();
            if(result && result.rowCount > 0) return true;
            return false;
        }catch(e){
            if(e instanceof Error) throw new Error(e.message);
            throw new Error("Error occurred while confirming if order is empty");
        }
    }

    private async isOrderActive(order_id:number):Promise<boolean>{
        try{
            const conn = await Client.connect();
            const checkQuery = "SELECT status FROM orders WHERE id=$1";
            const result = await conn.query(checkQuery, [order_id]);
            if(result.rowCount > 0){
                const status = result.rows[0].status;
                if(status && status == 'active'){
                    conn.release();
                    return true;
                }
                conn.release();
                return false;
            }
            conn.release();
            return false;
        }catch(e){
            if(e instanceof Error) throw new Error(e.message);
            throw new Error('Error occurred while confirming if order is active');
        }
    }

    private async fetchOrders(user_id:number,type:string){
        try{
            const conn = await Client.connect();
            const OrderIds = await conn.query("SELECT id FROM orders WHERE user_id=$1 AND status=$2",[user_id,type]);
            if(OrderIds.rowCount > 0){
                let orders = await Promise.all(OrderIds.rows.map(async (item:order) => {
                let order = await conn.query("SELECT * FROM order_items WHERE order_id=$1", [item.id]);
                return order.rows;
                }));
                conn.release();
                return orders.filter(item => item.length > 0 );
            }else{
                conn.release();
                return null;
            }
        }catch(e){
            if(e instanceof Error) throw new Error(e.message);
            throw new Error('Error occurred while fetching orders');
        }
    }

    public async createOrder(user_id:number): Promise<order>{
        try{
            if(!(await this.userExists(user_id))) throw new TypeError(`user with id ${user_id} does not exist!`);
            const conn = await Client.connect();
            const query = "INSERT INTO orders(user_id,status) VALUES($1,$2) RETURNING id";
            const createdorder = await conn.query(query, [user_id,"active"]);
            conn.release();
            return createdorder.rows[0];
        }catch(e){
            if(e instanceof TypeError) throw new TypeError(e.message);
            throw new Error("Could not create order");
        }
    }

    public async addProduct(product_id:number, order_id:number, price:number){
        try{
            if(await this.isOrderActive(order_id) != true) throw new TypeError("order does not exist or no longer active");
            if(!(await new Product().productExists(product_id))) throw new TypeError(`product with id ${product_id} does not exist`);
            const conn = await Client.connect();
            const checkIfProductExistForOrderQuery = "SELECT * FROM order_items WHERE product_id=$1 AND order_id=$2";
            const checkIfProductExistForOrderQueryResult = await conn.query(checkIfProductExistForOrderQuery,[product_id,order_id]);
            if(checkIfProductExistForOrderQueryResult.rowCount > 0){
                const result = await conn.query(`UPDATE order_items SET quantity=$1,price=$2 WHERE product_id=$3 AND order_id=$4 RETURNING *`,
                                [(checkIfProductExistForOrderQueryResult.rows[0].quantity + 1),(checkIfProductExistForOrderQueryResult.rows[0].quantity
                                + 1)*price,product_id,order_id]);
                conn.release();
                return {
                    message:"product increased successfully",
                    data:result.rows[0]
                };
            }else{
                const result = await conn.query("INSERT INTO order_items(order_id,product_id,price,quantity) VALUES($1,$2,$3,$4)",
                                [order_id,product_id,price,1]);
                conn.release();
                return {
                    message:"product added successfully",
                    data:result.rows[0]
                };
            }
        }catch(e){
            if(e instanceof TypeError){
                throw new TypeError(e.message)
            }else if(e instanceof Error){
                throw new Error(e.message);
            }
        }
    }

    public async removeProduct(product_id:number, order_id:number, price:number){
        try{
            if(await this.isOrderActive(order_id) != true) throw new TypeError("order does not exist or no longer active");
            const conn = await Client.connect();
            const checkIfProductExistForOrderQuery = await conn.query("SELECT * FROM order_items WHERE product_id=$1 AND order_id=$2",
                                                                        [product_id,order_id]);
            if(checkIfProductExistForOrderQuery.rowCount > 0 && checkIfProductExistForOrderQuery.rows[0].quantity > 1){
                const result = await conn.query(`UPDATE order_items SET quantity=$1,price=$2 WHERE product_id=$3 AND order_id=$4 RETURNING *`,
                                [(checkIfProductExistForOrderQuery.rows[0].quantity - 1),(checkIfProductExistForOrderQuery.rows[0].quantity
                                - 1)*price,product_id,order_id]);
                conn.release();
                return {
                    message:"product reduced successfully",
                    data:result.rows[0]
                };
            }else if(checkIfProductExistForOrderQuery.rowCount > 0 && checkIfProductExistForOrderQuery.rows[0].quantity == 1){
                await conn.query("DELETE FROM order_items WHERE id=$1",[checkIfProductExistForOrderQuery.rows[0].id]);
                conn.release();
                return {
                    message:"product removed successfully",
                    data:null
                }
            }
            conn.release();
            throw new TypeError("product is not part or no longer part of order");
        }catch(e){
            if(e instanceof TypeError){
                throw new TypeError(e.message)
            }else if(e instanceof Error){
                throw new Error(e.message);
            }
        }
    }

    public async completeOrder(order_id:number): Promise<order>{
        try{
            if(await this.isOrderActive(order_id) != true) throw new TypeError('order does not exist or no longer active');
            if(await this.orderNotEmpty(order_id) != true) throw new TypeError('order is empty! Please cancel order instead.');
            const conn = await Client.connect();
            const query = "UPDATE orders SET status='completed' WHERE id=$1 RETURNING *";
            const completedorder = await conn.query(query, [order_id]);
            conn.release();
            return completedorder.rows[0];
        }catch(e){
            if(e instanceof TypeError){
                throw new TypeError(e.message);
            }else{
                throw new Error("Unxpected Error " + e);
            }
        }
    }

    public async cancelOrder(order_id:number): Promise<order>{
        try{
            if(await this.isOrderActive(order_id) != true){
                throw new TypeError('order does not exist or no longer active');
            }
            const conn = await Client.connect();
            const query = "UPDATE orders SET status='canceled' WHERE id=$1 AND status='active' RETURNING *";
            const canceledorder = await conn.query(query, [order_id]);
            conn.release();
            return canceledorder.rows[0];
        }catch(e){
            if(e instanceof TypeError){
                throw new TypeError(e.message);
            }else{
                throw new Error("Unxpected Error " + e);
            }
        }
    }

    public async deleteOrder(order_id:number):Promise<order>{
        try{
            if(await this.isOrderActive(order_id) != true) throw new TypeError("order does not exist or no longer active");
            const conn = await Client.connect();
            await conn.query("DELETE FROM order_items WHERE order_id=$1",[order_id]);
            const deletedOrder = await conn.query("DELETE FROM orders WHERE id=$1 RETURNING id,user_id",[order_id]);
            conn.release();
            return deletedOrder.rows[0];
        }catch(e){
            if(e instanceof TypeError){
                throw new TypeError(e.message);
            }else{
                throw new Error("Unxpected Error " + e);
            }
        }
    }

    public async currentOrders(user_id:number): Promise<orders[][]|null>{
        try{
            return this.fetchOrders(user_id,'active');
        }catch(e){
            if(e instanceof Error){
                throw new Error(e.message);
            }else{
                throw new Error("could not fetch orders");
            }
        }
    }

    public async completedOrders(user_id:number): Promise<orders[][]|null>{
        try{
            return this.fetchOrders(user_id,'completed');
        }catch(e){
            if(e instanceof Error){
                throw new Error(e.message);
            }else{
                throw new Error("could not fetch orders");
            }
        }
    }

    public async canceledOrders(user_id:number): Promise<orders[][]|null> {
        try{
            return this.fetchOrders(user_id,'canceled');
        }catch(e){
            if(e instanceof Error){
                throw new Error(e.message);
            }else{
                throw new Error("could not fetch orders");
            }
        }
    }
}

export {order, Order};
