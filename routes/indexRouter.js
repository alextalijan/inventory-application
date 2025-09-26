const { Router } = require('express');

const router = Router();
const controller = require('../controllers/indexController');

router.get('/', controller.itemsGet);
router.get('/:category', controller.categoryItemsGet);

module.exports = router;
