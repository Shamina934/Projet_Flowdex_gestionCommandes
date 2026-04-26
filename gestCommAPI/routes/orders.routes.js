const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const Client  = require('../models/Client');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Client,  as: 'client' },
        { model: Product, as: 'products' },
      ]
    });
    res.json(orders);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Client,  as: 'client' },
        { model: Product, as: 'products' },
      ]
    });
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    res.json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { client_id, date, total, product_ids } = req.body;
    const order = await Order.create({ client_id, date, total });
    if (product_ids && product_ids.length > 0) {
      const products = await Product.findAll({ where: { id: product_ids } });
      await order.setProducts(products);
    }
    res.status(201).json(order);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    await order.setProducts([]);
    await order.destroy();
    res.json({ message: 'Commande supprimée' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;