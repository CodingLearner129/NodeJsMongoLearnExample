import express from 'express';
import { product as productModel} from '../models/productModel.js';

const router = express.Router();

router.route('/').get(async (req, res) => {
    const product = await productModel.aggregate([
        {
            $project: {
                _id: 1,
                name:1
            }
        }
    ]);
    res.send(product);
}).post(async (req, res) => {
    const product = await productModel.create(req.body);
    res.send(product);
});

export {router};