const db = require('../db/queries');

module.exports = {
  itemsGet: async (req, res) => {
    try {
      const items = await db.getAllItems();
      const categories = await db.getAllCategories();
      const stores = await db.getAllStores();

      res.render('index', { title: 'All Items', items, categories, stores });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  categoryItemsGet: async (req, res) => {
    try {
      const items = await db.getItemsByCategory(req.params.category);
      const categories = await db.getAllCategories();
      const stores = await db.getAllStores();

      res.render('index', {
        title: req.params.category,
        items,
        categories,
        stores,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  storeItemsGet: async (req, res) => {
    try {
      const items = await db.getItemsByStore(req.params.store);
      const categories = await db.getAllCategories();
      const stores = await db.getAllStores();

      res.render('index', {
        title: req.params.store,
        items,
        categories,
        stores,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
