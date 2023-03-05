import Client from '../database';

type product = {
    id?: number;
    name: string;
    price: number;
    category: string;
};

class Product {

    public async productExists(product_id:number):Promise<boolean>{
        try{
            const conn = await Client.connect();
            const result = await conn.query("SELECT * FROM products WHERE id=$1", [product_id]);
            conn.release();
            if(result.rowCount > 0) return true;
            return false;
        }catch(e){
            if(e instanceof Error) throw new Error(e.message);
            throw new Error("Error occured checking if product exists");
        }
    }

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

    public async show(id: number): Promise<product> {
        try {
            if(!(await this.productExists(id))) throw new TypeError(`product with id ${id} does not exist`);
            const conn = await Client.connect();
            const query = 'SELECT * FROM products WHERE id=$1';
            const result = await conn.query(query, [id]);
            conn.release();
            return result.rows[0];
        } catch (e) {
            if (e instanceof TypeError) throw new TypeError(e.message);
            throw Error('Could not find product');
        }
    }

    public async create(product: product): Promise<number> {
        try {
            const conn = await Client.connect();
            const query =
                'INSERT INTO products(name,price,category) VALUES($1,$2,$3) RETURNING id';
            const result = await conn.query(query, [
                product.name,
                product.price,
                product.category
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
            const query = `WITH popular_products AS 
                                (SELECT product_id, COUNT(quantity) as count FROM order_items 
                                GROUP BY product_id ORDER BY count DESC LIMIT 5)
                            SELECT products.id, products.name, products.price, products.category
                            FROM products JOIN popular_products ON products.id = popular_products.product_id`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        } catch (e) {
            throw Error('Could not get popular products');
        }
    }
}

export {product, Product};
