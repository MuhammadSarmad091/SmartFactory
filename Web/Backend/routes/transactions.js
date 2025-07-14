const express = require('express');
const router  = express.Router();
const Sale    = require('../models/Sale');
const Cartons = require('../models/CartonsAddition');
const StaticData = require('../models/StaticData');
const authenticateToken = require('../middleware/auth');

// POST /tx/sale — add a sale and decrement cartons
router.post('/sale', /*authenticateToken,*/ async (req, res) => {
  const { cartons_sold, DateTime, Buyer } = req.body;
  if (typeof cartons_sold !== 'number' || !DateTime || !Buyer) {
    return res.status(400).send('Invalid fields');
  }
  try {
    const staticDoc = await StaticData.findOne();
    if (!staticDoc || staticDoc.cartons_num < cartons_sold) {
      return res.status(400).send('Insufficient cartons');
    }
    const sale = new Sale({
      cartons_sold,
      DateTime: new Date(DateTime),
      Buyer
    });
    await sale.save();

    staticDoc.cartons_num -= cartons_sold;
    await staticDoc.save();

    res.json(sale);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding sale');
  }
});

// POST /tx/cartons — add cartons and increment count
router.post('/cartons', /*authenticateToken,*/ async (req, res) => {
  const { cartons_produced, DateTime } = req.body;
  if (typeof cartons_produced !== 'number' || !DateTime) {
    return res.status(400).send('Invalid fields');
  }
  try {
    const addition = new Cartons({
      cartons_produced,
      DateTime: new Date(DateTime)
    });
    await addition.save();

    const staticDoc = await StaticData.findOneAndUpdate(
      {},
      { $inc: { cartons_num: cartons_produced } },
      { new: true, upsert: true }
    );

    res.json({ addition, cartons_num: staticDoc.cartons_num });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding cartons');
  }
});

module.exports = router;
