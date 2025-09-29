const pool = require('./pool');

module.exports = {
  getAllItems: async () => {
    const { rows } = await pool.query(
      'SELECT items.name AS name, categories.name AS category, price, imageurl FROM items LEFT JOIN categories ON items.category_id = categories.id',
    );
    return rows;
  },
  getItemByName: async (name) => {
    const { rows } = await pool.query(
      'SELECT items.name AS name, categories.name AS category, price, imageurl FROM items LEFT JOIN categories ON items.category_id = categories.id WHERE items.name = $1 LIMIT 1',
      [name],
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
  getCategoryByName: async (category) => {
    const { rows } = await pool.query(
      'SELECT * FROM categories WHERE name = $1',
      [category],
    );
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
    const { rows } = await pool.query('SELECT DISTINCT name FROM stores');
    return rows;
  },
  insertItem: async (name, category, price) => {
    await pool.query(
      'INSERT INTO items(category_id, name, price) VALUES ((SELECT id FROM categories WHERE name LIKE $1), $2, $3)',
      [category, name, price],
    );
  },
  insertCategory: async (category) => {
    await pool.query('INSERT INTO categories(name) VALUES ($1)', [category]);
  },
  insertAvailability: async (storeName, itemName, amount) => {
    await pool.query(
      `INSERT INTO item_availability(store_id, item_id, amount)
        VALUES (
          (SELECT id FROM stores WHERE name = $1 LIMIT 1),
          (SELECT id FROM items WHERE name = $2 LIMIT 1),
          $3
        )`,
      [storeName, itemName, amount],
    );
  },
  getItemAvailabilities: async (item) => {
    const { rows } = await pool.query(
      `SELECT name, amount
        FROM stores s JOIN item_availability ia
        ON s.id = ia.store_id
        WHERE item_id = (
          SELECT id FROM items
          WHERE name = $1)`,
      [item],
    );
    return rows;
  },
  changeItemName: async (newName, item) => {
    await pool.query(
      'UPDATE items SET name = $1 WHERE id = (SELECT id FROM items WHERE name = $2)',
      [newName, item],
    );
  },
  modifyCategory: async (newName, category) => {
    await pool.query(
      'UPDATE categories SET name = $1 WHERE id = (SELECT id FROM categories WHERE name = $2)',
      [newName, category],
    );
  },
};
