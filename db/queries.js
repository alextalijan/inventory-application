const pool = require('./pool');

module.exports = {
  getAllItems: async () => {
    const { rows } = await pool.query(
      'SELECT items.name AS name, categories.name AS category, price, imageurl FROM items LEFT JOIN categories ON items.category_id = categories.id',
    );
    return rows;
  },
  getItemsByCategory: async (category) => {
    const { rows } = await pool.query(
      'SELECT items.name AS name, price, imageurl FROM items LEFT JOIN categories ON items.category_id = categories.id WHERE categories.name = $1',
      [category],
    );
    return rows;
  },
};
