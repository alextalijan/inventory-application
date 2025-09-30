const { Router } = require('express');

const router = Router();
const controller = require('../controllers/indexController');

router.get('/', controller.itemsGet);
router.get('/items/new', controller.newItemGet);
router.post('/items/new', controller.newItemPost);
router.get('/items/:item', controller.itemGet);
router.post('/items/:item', controller.modifyItem);
router.get('/items/:item/delete', controller.deleteItemGet);
router.post('/items/:item/delete', controller.deleteItemPost);
router.get('/categories', controller.categoriesGet);
router.post('/categories', controller.modifyCategories);
router.get('/categories/new', controller.newCategoryGet);
router.post('/categories/new', controller.newCategoryPost);
router.get('/categories/:category', controller.categoryItemsGet);
router.get('/categories/:category/delete', controller.deleteCategoryGet);
router.post('/categories/:category/delete', controller.deleteCategoryPost);
router.get('/stores/:store', controller.storeItemsGet);

module.exports = router;
