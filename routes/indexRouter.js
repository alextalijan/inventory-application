const { Router } = require('express');

const router = Router();
const controller = require('../controllers/indexController');

router.get('/', controller.itemsGet);
router.get('/items/:item', controller.itemGet);
router.get('/categories/:category', controller.categoryItemsGet);
router.get('/stores/:store', controller.storeItemsGet);
router.get('/newitem', controller.newItemGet);
router.post('/newitem', controller.newItemPost);
router.get('/newcategory', controller.newCategoryGet);
router.post('/newcategory', controller.newCategoryPost);

module.exports = router;
