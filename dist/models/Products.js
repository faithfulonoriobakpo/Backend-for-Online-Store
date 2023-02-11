"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class Product {
    async index(name) {
        try {
            const conn = await database_1.default.connect();
            const query = 'SELECT id FROM products WHERE LOWER(name)=$1';
            const result = await conn.query(query, [name.toLowerCase()]);
            conn.release();
            if (result.rows.length) {
                return {
                    status: 200,
                    message: "Index retrieved successfully",
                    data: result.rows[0]
                };
            }
            else {
                return {
                    status: 400,
                    message: 'No index found for productName given'
                };
            }
        }
        catch (e) {
            throw Error('Could not get product index');
        }
    }
    async show(index) {
        try {
            const conn = await database_1.default.connect();
            const query = 'SELECT * FROM products WHERE id=$1';
            const result = await conn.query(query, [index]);
            conn.release();
            if (result.rows.length) {
                return {
                    status: 200,
                    message: "product retrieved successfully",
                    data: result.rows[0]
                };
            }
            else {
                return {
                    status: 400,
                    message: 'No product found for index given'
                };
            }
        }
        catch (e) {
            throw Error('Could not find product');
        }
    }
    async create(product) {
        try {
            const conn = await database_1.default.connect();
            const query = 'INSERT INTO products(name,price,category,orders_count) VALUES($1,$2,$3,$4) RETURNING id';
            const result = await conn.query(query, [
                product.name,
                product.price,
                product.category,
                0
            ]);
            conn.release();
            if (result.rows.length) {
                return {
                    status: 200,
                    message: "product created successfully",
                    data: result.rows[0]
                };
            }
            else {
                return {
                    status: 500,
                    message: 'Could not create product'
                };
            }
        }
        catch (e) {
            throw new Error('Could not created product');
        }
    }
    async show_products_by_category(category) {
        try {
            const conn = await database_1.default.connect();
            const query = 'SELECT * FROM products WHERE category = $1';
            const result = await conn.query(query, [category]);
            conn.release();
            return result.rows;
        }
        catch (e) {
            throw Error('Could not get category products');
        }
    }
    async most_popular_products() {
        try {
            const conn = await database_1.default.connect();
            const query = `SELECT * FROM products ORDER BY orders_count DESC LIMIT 5`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        }
        catch (e) {
            throw Error('Could not get popular products');
        }
    }
}
exports.default = Product;
