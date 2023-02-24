import Client from "../database";

type user = {
    id?:number
    firstname:string,
    lastname:string,
    password?:string
}

class User {
    public async index(): Promise<user[]> {
        try{
            const conn = await Client.connect();
            const query = "SELECT id, firstname, lastname FROM users";
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        }catch(e){
            throw new Error("Could not get index");
        }
    }

    public async show(userid:number): Promise<user>{
        try{
            const conn = await Client.connect();
            const query = "SELECT id, firstname, lastname FROM users WHERE id=$1";
            const result = await conn.query(query, [userid]);
            conn.release();
            return result.rows[0];
        }catch(e){
            throw new Error("Could not get user");
        }
    }

    public async create(user:user): Promise<{"id":number}>{
        try{
            const conn = await Client.connect();
            const query = "INSERT INTO users(firstname, lastname, password) VALUES($1,$2,$3) RETURNING id";
            const result = await conn.query(query, [user.firstname, user.lastname, user.password]);
            conn.release();
            return result.rows[0];
        }catch(e){
            throw new Error("Could not create user");
        }
    }

    public async authenticate(userId:string): Promise<user> {
        try {
            const conn = await Client.connect();
            const query = 'SELECT * FROM users WHERE LOWER(username) = $1';
            const result = await conn.query(query, [userId.toLowerCase()]);
            conn.release();
            return result.rows[0];

        } catch(err){
            throw new Error(`Could not fetch user: ${err}`);
        }
    }
}

export default User;
