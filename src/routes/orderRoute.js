import express from 'express';
import { order as orderModel} from '../models/orderModel.js';

const router = express.Router();

router.route('/').get(async (req, res) => {
    const order = await orderModel.aggregate([
        {
            $project: {
                _id: 1,
                name:1
            }
        }
    ]);
    res.send(order);
}).post(async (req, res) => {
    const order = await orderModel.create(req.body);
    res.send(order);
});

export {router};