const express  = require('express');
const router   = express.Router();
const Purchase = require('../models/Purchase');
const Product  = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [{ model: Product, as: 'product' }]
    });
    res.json(purchases);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const purchase = await Purchase.create(req.body);
    res.status(201).json(purchase);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Achat non trouvé' });
    await purchase.destroy();
    res.json({ message: 'Achat supprimé' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;