const { getItemByName } = require('../db/queries');
const db = require('../db/queries');
const {
  body,
  valdiationResult,
  validationResult,
} = require('express-validator');
const CustomError = require('../errors/CustomError');
const { getCategoryByName } = require('../db/queries');

const newItemValidations = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('The product must have a name.')
    .isLength({ max: 25 })
    .withMessage('Name of the product must not be longer than 25 characters.'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category cannot be blank.')
    .isLength({ max: 20 })
    .withMessage('Category cannot be longer than 20 characters.'),
  body('price')
    .trim()
    .notEmpty()
    .withMessage('Product must have a price.')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number.'),
];

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
  newItemGet: async (req, res) => {
    const categories = await db.getAllCategories();

    res.render('newItemForm', { categories });
  },
  newItemPost: [
    newItemValidations,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('newItemForm', { errors: errors.array() });
      }

      // If the item already exists, stop the person from inputing it again
      const [item] = await db.getItemByName(req.body.name);

      if (item) {
        return next(
          new CustomError('This item already exists in the database.', 500),
        );
      }

      // If the category doesn't exist, stop the user from choosing it
      const [category] = await db.getCategoryByName(req.body.category);

      if (!category) {
        return next(
          new CustomError(
            'This category does not exist. If you want to add it, go to the link below.',
            500,
            '/newcategory',
          ),
        );
      }

      const refinedName = req.body.name.trim().toLowerCase();
      const refinedCategory = req.body.category.trim().toLowerCase();
      const refinedPrice = Number(req.body.price.trim()).toFixed(2);

      // Insert data into the database
      await db.insertItem(refinedName, refinedCategory, refinedPrice);

      // Generate randomly availability of this item in stores
      const stores = await db.getAllStores();
      stores.forEach(async (store) => {
        const randomAmount = Math.floor(Math.random() * 51);
        await db.insertAvailability(store.name, refinedName, randomAmount);
      });

      res.redirect(`/categories/${refinedCategory}`);
    },
  ],
};
