var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products')
const slugify = require('slugify');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    // Read all: không cần truy vấn từ client
    let result = await productModel.find({
      isDeleted: false
    });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await productModel.findOne({
      _id: id,
      isDeleted: false
    });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: 'ID NOT FOUND' });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.post('/', async function(req, res, next) {
  try {
    let newProduct = new productModel({
      title: req.body.title,
      slug: slugify(req.body.title || '', {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
      }),
      price: req.body.price,
      description: req.body.description,
      images: req.body.images,
      category: req.body.category
    });
    await newProduct.save();
    res.send(newProduct);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let data = { ...req.body };

    if (data.title) {
      data.slug = slugify(data.title, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
      });
    }

    let updatedItem = await productModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    );

    if (updatedItem) {
      res.send(updatedItem);
    } else {
      res.status(404).send({ message: 'ID NOT FOUND' });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await productModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (updatedItem) {
      res.send(updatedItem);
    } else {
      res.status(404).send({ message: 'ID NOT FOUND' });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
