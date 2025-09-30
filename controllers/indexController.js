const db = require('../db/queries');
const { body, validationResult } = require('express-validator');
const CustomError = require('../errors/CustomError');

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

const newCategoryValidations = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('The category must have a name.')
    .isLength({ max: 20 })
    .withMessage('Name of the category must not be longer than 20 characters.'),
];

const renameCategoryValidations = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('The category must have a name.')
    .isLength({ max: 20 })
    .withMessage('Name of the category must not be longer than 20 characters.'),
  body('rename')
    .trim()
    .notEmpty()
    .withMessage('The category must have a name.')
    .isLength({ max: 20 })
    .withMessage('Name of the category must not be longer than 20 characters.'),
];

const renameItemValidations = [
  body('rename')
    .trim()
    .notEmpty()
    .withMessage('The item must have a name.')
    .isLength({ max: 25 })
    .withMessage('Name of the item must not be longer than 25 characters.'),
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

    res.render('newItemForm', { categories, errors: null });
  },
  newItemPost: [
    newItemValidations,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const categories = await db.getAllCategories();
        res.locals.name = req.body.name;
        res.locals.category = req.body.category;
        res.locals.price = req.body.price;
        return res.render('newItemForm', {
          categories,
          errors: errors.array(),
        });
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
        console.log('Inserted into store', store.name);
      });

      res.redirect(`/categories/${refinedCategory}`);
    },
  ],
  newCategoryGet: (req, res) => {
    res.render('newCategoryForm', { errors: null });
  },
  newCategoryPost: [
    newCategoryValidations,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.locals.name = req.body.name;
        return res.render('newCategoryForm', { errors: errors.array() });
      }

      // Check if the category already exists
      const [category] = await db.getCategoryByName(
        req.body.name.trim().toLowerCase(),
      );

      if (category) {
        return next(
          new CustomError(
            'This category already exists. Click the link below to add a new category.',
            500,
            '/categories/new',
          ),
        );
      }

      // Insert the new category into database
      await db.insertCategory(req.body.name.trim().toLowerCase());

      res.redirect('/categories');
    },
  ],
  itemGet: async (req, res, next) => {
    const [item] = await db.getItemByName(req.params.item);
    const availabilities = await db.getItemAvailabilities(req.params.item);

    if (!item) {
      return next(new CustomError('Item not found', 404));
    }

    res.render('item', { item, availabilities, errors: null });
  },
  modifyItem: [
    renameItemValidations,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const [item] = await db.getItemByName(req.params.item);
        const availabilities = await db.getItemAvailabilities(req.params.item);

        return res.render('item', {
          item,
          availabilities,
          errors: errors.array(),
        });
      }

      const [item] = await db.getItemByName(
        req.body.rename.trim().toLowerCase(),
      );

      // If the new name already exists for other item, stop the user from renaming it
      if (item) {
        return next(
          new CustomError(
            "The new name you are trying to set is already in use. Click the link below to go back to item's page.",
            500,
            `/items/${req.params.item}`,
          ),
        );
      }

      await db.changeItemName(
        req.body.rename.trim().toLowerCase(),
        req.params.item,
      );
      res.redirect(`/items/${req.body.rename.trim().toLowerCase()}`);
    },
  ],
  categoriesGet: async (req, res) => {
    const categories = await db.getAllCategories();

    res.render('categories', { categories, errors: null });
  },
  modifyCategories: [
    renameCategoryValidations,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const categories = await db.getAllCategories();
        return res.render('categories', { categories, errors: errors.array() });
      }

      const [category] = await db.getCategoryByName(
        req.body.rename.trim().toLowerCase(),
      );
      if (category) {
        console.log('Category', category, 'exists.');
        return next(
          new CustomError(
            "The name of the category you've chosen already exists. Click on the link below to go back to all categories.",
            500,
            '/categories',
          ),
        );
      }

      await db.modifyCategory(
        req.body.rename.trim().toLowerCase(),
        req.body.name.toLowerCase(),
      );

      res.redirect('/categories');
    },
  ],
  deleteItemGet: async (req, res) => {
    res.render('deleteItem', { item: req.params.item });
  },
  deleteItemPost: async (req, res) => {
    const item = req.params.item;
    await db.deleteItem(item);

    res.redirect('/');
  },
  deleteCategoryGet: async (req, res) => {
    res.render('deleteCategory', { category: req.params.category });
  },
  deleteCategoryPost: async (req, res) => {
    const category = req.params.category;
    await db.deleteCategory(category);

    res.redirect('/categories');
  },
};
