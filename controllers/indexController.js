const db = require('../db/queries');

module.exports = {
  indexGet: async (req, res) => {
    try {
      const { rows } = await db.getAllItems();

      res.render('index', { items: rows });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
