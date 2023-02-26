import Client from '../database';

type product = {
    id?: number;
    name: string;
    price: number;
    category: string;
};

class Product {
    public async index(): Promise<product[]> {
        try {
            const conn = await Client.connect();
            const query = 'SELECT * FROM products';
            const result = await conn.query(query);
            conn.release();
            return result.rows;    
        } catch (e) {
            throw Error('Could not get product index');
        }
    }

    public async show(index: number): Promise<product> {
        try {
            const conn = await Client.connect();
            const query = 'SELECT * FROM products WHERE id=$1';
            const result = await conn.query(query, [index]);
            conn.release();
            return result.rows[0];
        } catch (e) {
            throw Error('Could not find product');
        }
    }

    public async create(product: product): Promise<number> {
        try {
            const conn = await Client.connect();
            const query =
                'INSERT INTO products(name,price,category,orders_count) VALUES($1,$2,$3,$4) RETURNING id';
            const result = await conn.query(query, [
                product.name,
                product.price,
                product.category,
                0
            ]);
            conn.release();
            return result.rows[0];
        } catch (e) {
            throw new Error('Could not create product');
        }
    }

    public async show_products_by_category(category: string): Promise<product[]> {
        try {
            const conn = await Client.connect();
            const query = 'SELECT * FROM products WHERE LOWER(category) = $1';
            const result = await conn.query(query, [category.toLowerCase()]);
            conn.release();
            return result.rows;
        } catch (e) {
            throw Error('Could not get category products');
        }
    }

    public async most_popular_products(): Promise<product[]> {
        try {
            const conn = await Client.connect();
            const query = `SELECT * FROM products ORDER BY orders_count DESC LIMIT 5`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        } catch (e) {
            throw Error('Could not get popular products');
        }
    }
}

export default Product;
