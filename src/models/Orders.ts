import Client from "../database";

type order = {
    id:number,
    id_of_products: number[],
    quantity_of_each_product: number[],
    user_id: number,
    status?:string
};

class Order{
    public async createOrder(order:order): Promise<order>{
        try{
            const conn = await Client.connect();
            const query = "INSERT INTO orders(id,id_of_products,quantity_of_each_product,user_id,status) VALUES($1,$2,$3,$4,$5) RETURNING *";
            const createdorder = await conn.query(query, [order.id,order.id_of_products,order.quantity_of_each_product,order.user_id,"active"]);
            conn.release();
            return createdorder.rows[0];
        }catch(e){
            throw new Error("Could not create order");
        }
    }

    public async completeOrder(orderId:number): Promise<order>{
        try{
            const conn = await Client.connect();
            const checkQuery = "SELECT status FROM orders WHERE id=$1";
            const result = await conn.query(checkQuery, [orderId]);
            const status = result.rows[0];
            if(status){
                if(status != 'active'){
                    conn.release();
                    throw new Error("order is no longer active!");
                }
            }else{
                conn.release();
                throw new Error("could not find order");
            }
            const query = "UPDATE orders SET status='completed' WHERE id=$1 RETURNING *";
            const completedorder = await conn.query(query, [orderId]);
            conn.release();
            return completedorder.rows[0];
        }catch(e){
            if(e instanceof Error){
                throw new Error(e.message);
            }else{
                throw new Error("Unxpected Error " + e);
            }
        }
    }

    public async cancelOrder(orderId:number): Promise<order>{
        try{
            const conn = await Client.connect();
            const checkQuery = "SELECT status FROM orders WHERE id=$1";
            const result = await conn.query(checkQuery, [orderId]);
            const status = result.rows[0];
            if(status){
                if(status != 'active'){
                    conn.release();
                    throw new Error("order is no longer active!");
                }
            }else{
                conn.release();
                throw new Error("could not find order");
            }
            const query = "UPDATE orders SET status='canceled' WHERE id=$1 AND status='active' RETURNING *";
            const canceledorder = await conn.query(query, [orderId]);
            conn.release();
            return canceledorder.rows[0];
        }catch(e){
            if(e instanceof Error){
                throw new Error(e.message);
            }else{
                throw new Error("Unxpected Error " + e);
            }
        }
    }

    public async currentOrders(userId:number): Promise<order[]>{
        try{
            const conn = await Client.connect();
            const query = "SELECT * FROM orders WHERE user_id=$1 AND status=active";
            const currentorders = await conn.query(query, [userId]);
            conn.release();
            return currentorders.rows;
        }catch(e){
            throw new Error("Could not get current orders for user");
        }
    }

    public async completedOrders(userId:number): Promise<order[]>{
        try{
            const conn = await Client.connect();
            const query = "SELECT * FROM orders WHERE user_id=$1 AND status=completed";
            const completedorders = await conn.query(query, [userId]);
            conn.release();
            return completedorders.rows;
        }catch(e){
            throw new Error("Could not get completed orders for user");
        }
    }

    public async canceledOrders(userId:number): Promise<order[]> {
        try{
            const conn = await Client.connect();
            const query = "SELECT * FROM orders WHERE user_id=$1 AND status=canceled";
            const canceledorders = await conn.query(query, [userId]);
            conn.release();
            return canceledorders.rows;
        }catch(e){
            throw new Error("Could not get canceled orders for user");
        }
    }
}

export {order, Order};
