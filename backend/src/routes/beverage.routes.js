const express = require('express');
const router = express.Router();
const { getBeverages, getCategories } = require('../controllers/beverageController');

router.get('/', getBeverages);
router.get('/categories', getCategories);

module.exports = router;
