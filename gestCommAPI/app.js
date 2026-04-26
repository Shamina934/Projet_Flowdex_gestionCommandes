const express   = require('express');
const cors      = require('cors');
const db        = require('./config/db');

const productsRoutes  = require('./routes/products.routes');
const clientsRoutes   = require('./routes/clients.routes');
const ordersRoutes    = require('./routes/orders.routes');
const purchasesRoutes = require('./routes/purchases.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products',  productsRoutes);
app.use('/api/clients',   clientsRoutes);
app.use('/api/orders',    ordersRoutes);
app.use('/api/purchases', purchasesRoutes);

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  try {
    await db.authenticate();
    console.log('Connexion à MySQL réussie');
  } catch (e) {
    console.error('Erreur MySQL :', e.message);
  }
});