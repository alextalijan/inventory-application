const db = require('../db/queries');

module.exports = {
  itemsGet: async (req, res) => {
    try {
      const items = await db.getAllItems();
      const categories = await db.getAllCategories();

      res.render('index', { title: 'All Items', items, categories });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  categoryItemsGet: async (req, res) => {
    try {
      const items = await db.getItemsByCategory(req.params.category);
      const categories = await db.getAllCategories();

      res.render('index', { title: req.params.category, items, categories });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
