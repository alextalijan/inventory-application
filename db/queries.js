const pool = require('./pool');

module.exports = {
  getAllItems: async (req, res) => {
    const { rows } = await pool.query(
      'SELECT items.name AS name, categories.name AS category, price, imageurl FROM items LEFT JOIN categories ON items.category_id = categories.id',
    );
    return rows;
  },
};
