const db = require('../db/queries');

module.exports = {
  indexGet: async (req, res) => {
    try {
      const items = await db.getAllItems();

      res.render('index', { items });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
