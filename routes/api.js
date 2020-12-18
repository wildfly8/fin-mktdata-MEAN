const express = require('express')
const router = express.Router()
const Sales = require('../models/Sales.js')
const Vendors = require('../models/vendors.js')
const OrderStatusTypes = require('../models/order-status-types.js')

// list Vendors
router.get('/vendors', async (req, res) => {
    try {
        const allVendors = await Vendors.find()
        res.json(allVendors.map((s) => s.vendorName))
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

// list order-status-types
router.get('/order-status-types', async (req, res) => {
    try {
        const allTypes = await OrderStatusTypes.find()
        res.json(allTypes.map((s) => s.value))
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

// list data
router.get('/sales', async (req, res) => {
    try {
        const allSales = await Sales.find();
        res.json(allSales);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

// item sales report
router.get('/itemsales',  (req, res, next) => {
    Sales.aggregate([
        {
            $group: { 
                _id: { itemId: '$itemId', itemName: '$itemName' }, 
                totalPrice: {
                    $sum: "$totalPrice"
                }
            }
        },
        { $sort: {totalPrice: 1} }
    ], (err, sales) => {
        if (err) return next(err);
        res.json(sales);
    });
});

// get data by id
router.get('/sales/:id', (req, res, next) => {
    Sales.findById(req.params.id, (err, sales) => {
        if (err) return next(err);
        res.json(sales);
    });
});


// post data
router.post('/sales', (req, res, next) => {
    Sales.create(req.body, (err, sales) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(sales);
    });
});
  
// put data
router.put('/sales/:id', (req, res, next) => {
    Sales.findByIdAndUpdate(req.params.id, req.body, (err, sales) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(sales);
    });
});
  
// delete data by id
router.delete('/sales/:id', (req, res, next) => {
    Sales.findByIdAndRemove(req.params.id, req.body, (err, sales) => {
        if (err) return next(err);
        res.json(sales);
    });
});

module.exports = router;