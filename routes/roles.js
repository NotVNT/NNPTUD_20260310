var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/Role');
let userModel = require('../schemas/User');

router.get('/', async function (req, res, next) {
  try {
    let result = await roleModel.find({ isDeleted: false });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await roleModel.findOne({ _id: id, isDeleted: false });

    if (!result) {
      return res.status(404).send({ message: 'ID NOT FOUND' });
    }

    res.send(result);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.post('/', async function (req, res, next) {
  try {
    let newRole = new roleModel(req.body);
    await newRole.save();
    res.status(201).send(newRole);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await roleModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedItem) {
      return res.status(404).send({ message: 'ID NOT FOUND' });
    }

    res.send(updatedItem);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await roleModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).send({ message: 'ID NOT FOUND' });
    }

    res.send(updatedItem);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.get('/:id/users', async function (req, res, next) {
  try {
    let id = req.params.id;

    let role = await roleModel.findOne({ _id: id, isDeleted: false });
    if (!role) {
      return res.status(404).send({ message: 'ROLE ID NOT FOUND' });
    }

    let users = await userModel.find({ role: id, isDeleted: false }).populate('role');
    res.send(users);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
