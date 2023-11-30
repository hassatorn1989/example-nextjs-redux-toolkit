const Product = require('../models/product');
const { Op } = require('sequelize');

const getAllProducts = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = '', sortBy = 'id', sortOrder = 'ASC' } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const offset = (page - 1) * limit;


        const products = await Product.findAndCountAll({
            where: {
                name: {
                    [Op.like]: `%${search}%`,
                }
            },
            order: [[sortBy, sortOrder]],
            offset: offset,
            limit: limit,
        });

        const totalPages = Math.ceil(products.count / limit);

        res.json({
            totalItems: products.count,
            totalPages: totalPages,
            currentPage: +page,
            pageSize: +limit,
            products: products.rows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, quantity } = req.body;
        const newProduct = await Product.create({ name, description, price, quantity });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllProducts, createProduct };
