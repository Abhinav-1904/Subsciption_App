"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
const port = 3000;
router.use(express_1.default.json());
let subscription = [];
function calculateDiscount(price, discount) {
    if (discount.isPercentage) {
        return price - (price * discount.value / 100);
    }
    else {
        return price - discount.value;
    }
}
router.post('/', (req, res) => {
    try {
        const { typeOf, price, discount } = req.body;
        if (!typeOf || !price || !discount) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        ;
        var discountValue = 0;
        if (typeOf == 'monthly') {
            discountValue = calculateDiscount(price.monthly, discount);
        }
        if (typeOf == 'yearly') {
            discountValue = calculateDiscount(price.yearly, discount);
        }
        const new_subscription = {
            id: subscription.length + 1,
            typeOf: typeOf,
            price: discountValue,
            discount: discount
        };
        subscription.push(new_subscription);
        res.status(201).json({ message: 'Subscription created successfully', subscription: new_subscription });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/', (req, res) => {
    res.json(subscription);
});
router.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
