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
  getAllCategories: async () => {
    const { rows } = await pool.query('SELECT name FROM categories');
    return rows;
  },
  getItemsByStore: async (store) => {
    const { rows } = await pool.query(
      `SELECT i.name, c.name AS category, price, imageurl, amount
        FROM items i JOIN categories c ON i.category_id = c.id
        JOIN item_availability ia ON i.id = ia.item_id
        JOIN stores s ON ia.store_id = s.id
        WHERE s.name = $1`,
      [store],
    );
    return rows;
  },
  getAllStores: async () => {
    const { rows } = await pool.query('SELECT name FROM stores');
    return rows;
  },
};
