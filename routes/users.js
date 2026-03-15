var express = require('express');
var router = express.Router();
let userModel = require('../schemas/User');

router.get('/', async function (req, res, next) {
  try {
    let result = await userModel.find({ isDeleted: false }).populate('role');
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel
      .findOne({ _id: id, isDeleted: false })
      .populate('role');

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
    let newUser = new userModel(req.body);
    await newUser.save();
    let result = await userModel.findById(newUser._id).populate('role');
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, req.body, {
        new: true,
        runValidators: true
      })
      .populate('role');

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
    let updatedItem = await userModel.findOneAndUpdate(
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

router.post('/enable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let user = await userModel.findOneAndUpdate(
      {
        email: email,
        username: username,
        isDeleted: false
      },
      {
        status: true
      },
      {
        new: true
      }
    );

    if (!user) {
      return res.status(404).send({ message: 'USER NOT FOUND OR INFO INVALID' });
    }

    res.send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post('/disable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let user = await userModel.findOneAndUpdate(
      {
        email: email,
        username: username,
        isDeleted: false
      },
      {
        status: false
      },
      {
        new: true
      }
    );

    if (!user) {
      return res.status(404).send({ message: 'USER NOT FOUND OR INFO INVALID' });
    }

    res.send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
