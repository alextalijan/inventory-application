const { Router } = require('express');

const router = Router();
const controller = require('../controllers/indexController');

router.get('/', controller.itemsGet);
router.get('/categories/:category', controller.categoryItemsGet);
router.get('/stores/:store', controller.storeItemsGet);

module.exports = router;
