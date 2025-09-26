const db = require('../db/queries');

module.exports = {
  itemsGet: async (req, res) => {
    try {
      const items = await db.getAllItems();

      res.render('index', { title: 'All Items', items });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  categoryItemsGet: async (req, res) => {
    try {
      const items = await db.getItemsByCategory(req.params.category);

      res.render('index', { title: req.params.category, items });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
