import express from 'express';
import { orderItem as orderItemModel} from '../models/orderItemModel.js';

const router = express.Router();

router.route('/').get(async (req, res) => {
    const orderItem = await orderItemModel.aggregate([
        {
            $project: {
                _id: 1,
                name:1
            }
        }
    ]);
    res.send(orderItem);
}).post(async (req, res) => {
    const orderItem = await orderItemModel.create(req.body);
    res.send(orderItem);
});

export {router};