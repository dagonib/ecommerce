import express from 'express';
import Product from '../models/productModel.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

//URL del backend para acceder a la información de un producto.
productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    // Envía data al fronend.
    res.send(product);
  } else {
    // Aquí se ponen los mensaje de error.
    res.status(404).send({ message: 'Product Not Found' });
  }
});

//URL del backend para obtener un producto en función del id.
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    // Envía data al fronend.
    res.send(product);
  } else {
    // Aquí se ponen los mensaje de error.
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default productRouter;
