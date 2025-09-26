const { Client } = require('pg');
require('dotenv').config();

const createTables = `
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories (id),
    name VARCHAR(100) NOT NULL,
    price NUMERIC(5, 2) NOT NULL CHECK (price > 0),
    imageurl TEXT NOT NULL DEFAULT '/public/img/products/no-image-product.jpg'
);

CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS item_availability (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items (id),
    store_id INTEGER REFERENCES stores (id),
    amount INTEGER NOT NULL CHECK (amount >= 0)
);
`;

const populateCategories = `
INSERT INTO categories(name)
VALUES
    ('fruits'),
    ('vegetables'),
    ('dairy'),
    ('meat & poultry'),
    ('seafood'),
    ('bakery'),
    ('pantry staples'),
    ('beverages'),
    ('snacks'),
    ('frozen foods');
`;

const populateItems = `
INSERT INTO items(category_id, name, price, imageurl)
VALUES
    -- fruits (category_id = 1)
    (1, 'apples', 1.20, '/public/img/products/apples.jpg'),
    (1, 'bananas', 0.60, '/public/img/products/bananas.jpg'),
    (1, 'oranges', 1.10, '/public/img/products/oranges.jpg'),
    (1, 'grapes', 2.50, '/public/img/products/grapes.jpg'),
    (1, 'strawberries', 3.00, '/public/img/products/strawberries.jpg'),
    (1, 'blueberries', 3.50, '/public/img/products/blueberries.jpg'),
    (1, 'mangoes', 2.00, '/public/img/products/mangoes.jpg'),
    (1, 'pineapples', 2.80, '/public/img/products/pineapples.jpg'),

    -- vegetables (category_id = 2)
    (2, 'tomatoes', 1.50, '/public/img/products/tomatoes.jpg'),
    (2, 'potatoes', 0.90, '/public/img/products/potatoes.jpg'),
    (2, 'carrots', 1.20, '/public/img/products/carrots.jpg'),
    (2, 'onions', 1.00, '/public/img/products/onions.jpg'),
    (2, 'broccoli', 2.00, '/public/img/products/broccoli.jpg'),
    (2, 'spinach', 1.80, '/public/img/products/spinach.jpg'),
    (2, 'cucumbers', 1.00, '/public/img/products/cucumbers.jpg'),
    (2, 'bell peppers', 2.20, '/public/img/products/bell-peppers.jpg'),
    (2, 'garlic', 0.70, '/public/img/products/garlic.jpg'),
    (2, 'lettuce', 1.30, '/public/img/products/lettuce.jpg'),

    -- dairy (category_id = 3)
    (3, 'milk', 1.50, '/public/img/products/milk.jpg'),
    (3, 'butter', 2.80, '/public/img/products/butter.jpg'),
    (3, 'yogurt', 1.20, '/public/img/products/yogurt.jpg'),
    (3, 'cheese cheddar', 4.50, '/public/img/products/cheese-cheddar.jpg'),
    (3, 'cheese mozzarella', 4.20, '/public/img/products/cheese-mozzarella.jpg'),
    (3, 'cream', 2.50, '/public/img/products/cream.jpg'),
    (3, 'sour cream', 2.00, '/public/img/products/sour-cream.jpg'),
    (3, 'cottage cheese', 3.00, '/public/img/products/cottage-cheese.jpg'),

    -- meat & poultry (category_id = 4)
    (4, 'chicken breast', 6.50, '/public/img/products/chicken-breast.jpg'),
    (4, 'chicken thighs', 5.00, '/public/img/products/chicken-thighs.jpg'),
    (4, 'ground beef', 7.00, '/public/img/products/ground-beef.jpg'),
    (4, 'pork chops', 6.00, '/public/img/products/pork-chops.jpg'),
    (4, 'bacon', 5.50, '/public/img/products/bacon.jpg'),
    (4, 'sausages', 4.50, '/public/img/products/sausages.jpg'),
    (4, 'turkey breast', 6.80, '/public/img/products/turkey-breast.jpg'),
    (4, 'steak', 12.00, '/public/img/products/steak.jpg'),

    -- seafood (category_id = 5)
    (5, 'salmon', 10.00, '/public/img/products/salmon.jpg'),
    (5, 'shrimp', 9.00, '/public/img/products/shrimp.jpg'),
    (5, 'tuna', 8.50, '/public/img/products/tuna.jpg'),
    (5, 'cod', 7.00, '/public/img/products/cod.jpg'),
    (5, 'crab', 12.00, '/public/img/products/crab.jpg'),
    (5, 'tilapia', 6.50, '/public/img/products/tilapia.jpg'),
    (5, 'sardines', 3.00, '/public/img/products/sardines.jpg'),

    -- bakery (category_id = 6)
    (6, 'white bread', 2.00, '/public/img/products/white-bread.jpg'),
    (6, 'whole wheat bread', 2.50, '/public/img/products/whole-wheat-bread.jpg'),
    (6, 'bagels', 3.00, '/public/img/products/bagels.jpg'),
    (6, 'croissants', 3.50, '/public/img/products/croissants.jpg'),
    (6, 'baguette', 2.80, '/public/img/products/baguette.jpg'),
    (6, 'muffins', 3.20, '/public/img/products/muffins.jpg'),
    (6, 'donuts', 2.50, '/public/img/products/donuts.jpg'),
    (6, 'tortillas', 2.20, '/public/img/products/tortillas.jpg'),

    -- pantry staples (category_id = 7)
    (7, 'rice', 1.50, '/public/img/products/rice.jpg'),
    (7, 'pasta', 1.80, '/public/img/products/pasta.jpg'),
    (7, 'flour', 1.20, '/public/img/products/flour.jpg'),
    (7, 'sugar', 1.00, '/public/img/products/sugar.jpg'),
    (7, 'salt', 0.70, '/public/img/products/salt.jpg'),
    (7, 'black pepper', 2.50, '/public/img/products/black-pepper.jpg'),
    (7, 'olive oil', 6.00, '/public/img/products/olive-oil.jpg'),
    (7, 'vegetable oil', 4.00, '/public/img/products/vegetable-oil.jpg'),
    (7, 'peanut butter', 3.50, '/public/img/products/peanut-butter.jpg'),
    (7, 'jam', 3.00, '/public/img/products/jam.jpg'),

    -- beverages (category_id = 8)
    (8, 'coffee', 5.00, '/public/img/products/coffee.jpg'),
    (8, 'tea', 3.50, '/public/img/products/tea.jpg'),
    (8, 'orange juice', 4.00, '/public/img/products/orange-juice.jpg'),
    (8, 'apple juice', 3.80, '/public/img/products/apple-juice.jpg'),
    (8, 'soda', 1.50, '/public/img/products/soda.jpg'),
    (8, 'bottled water', 1.00, '/public/img/products/bottled-water.jpg'),
    (8, 'sparkling water', 1.50, '/public/img/products/sparkling-water.jpg'),
    (8, 'beer', 2.50, '/public/img/products/beer.jpg'),
    (8, 'wine', 10.00, '/public/img/products/wine.jpg'),
    (8, 'milk alternatives', 3.50, '/public/img/products/milk-alternatives.jpg'),

    -- snacks (category_id = 9)
    (9, 'potato chips', 2.00, '/public/img/products/potato-chips.jpg'),
    (9, 'pretzels', 2.20, '/public/img/products/pretzels.jpg'),
    (9, 'popcorn', 2.50, '/public/img/products/popcorn.jpg'),
    (9, 'chocolate bar', 1.50, '/public/img/products/chocolate-bar.jpg'),
    (9, 'granola bars', 3.00, '/public/img/products/granola-bars.jpg'),
    (9, 'crackers', 2.50, '/public/img/products/crackers.jpg'),
    (9, 'nuts almonds', 4.00, '/public/img/products/nuts-almonds.jpg'),
    (9, 'nuts cashews', 5.00, '/public/img/products/nuts-cashews.jpg'),
    (9, 'trail mix', 4.50, '/public/img/products/trail-mix.jpg'),

    -- frozen foods (category_id = 10)
    (10, 'frozen pizza', 5.50, '/public/img/products/frozen-pizza.jpg'),
    (10, 'frozen vegetables', 3.00, '/public/img/products/frozen-vegetables.jpg'),
    (10, 'ice cream', 4.00, '/public/img/products/ice-cream.jpg'),
    (10, 'frozen berries', 4.50, '/public/img/products/frozen-berries.jpg'),
    (10, 'frozen french fries', 3.50, '/public/img/products/frozen-french-fries.jpg'),
    (10, 'frozen chicken nuggets', 5.00, '/public/img/products/frozen-chicken-nuggets.jpg'),
    (10, 'frozen fish fillets', 6.00, '/public/img/products/frozen-fish-fillets.jpg');
`;

const populateStores = `
INSERT INTO stores(name)
VALUES
    ('FreshMart'),
    ('Green Valley Market'),
    ('UrbanGrocer'),
    ('Daily Harvest Foods'),
    ('Prime Pantry'),
    ('Ocean & Farm Market'),
    ('QuickCart'),
    ('MetroFoods'),
    ('Family Choice Market'),
    ('Budget Basket');
`;

const populateAvailability = `
-- Store 1 (FreshMart)
INSERT INTO item_availability(item_id, store_id, amount)
VALUES
  (1,1,50),(2,1,75),(3,1,60),(4,1,40),(5,1,30),(6,1,20),(7,1,25),(8,1,15),(9,1,80),(10,1,100),
  (11,1,60),(12,1,70),(13,1,35),(14,1,0),(15,1,50),(16,1,40),(17,1,10),(18,1,45),(19,1,90),(20,1,50),
  (21,1,50),(22,1,40),(23,1,60),(24,1,70),(25,1,55),(26,1,65),(27,1,35),(28,1,50),(29,1,0),(30,1,40),
  (31,1,20),(32,1,15),(33,1,10),(34,1,25),(35,1,20),(36,1,30),(37,1,15),(38,1,10),(39,1,50),(40,1,60),
  (41,1,20),(42,1,25),(43,1,0),(44,1,15),(45,1,50),(46,1,40),(47,1,35),(48,1,45),(49,1,30),(50,1,60),
  (51,1,25),(52,1,30),(53,1,20),(54,1,15),(55,1,25),(56,1,30),(57,1,0),(58,1,15),(59,1,25),(60,1,20),
  (61,1,10),(62,1,15),(63,1,20),(64,1,15),(65,1,10),(66,1,15),(67,1,20),(68,1,15),(69,1,0),(70,1,15),
  (71,1,25),(72,1,20),(73,1,15),(74,1,25),(75,1,20),(76,1,15),(77,1,25),(78,1,20),(79,1,15),(80,1,10),
  (81,1,20),(82,1,15),(83,1,25),(84,1,20),(85,1,15);

-- Store 2 (Green Valley Market)
INSERT INTO item_availability(item_id, store_id, amount)
VALUES
  (1,2,40),(2,2,60),(3,2,70),(4,2,30),(5,2,25),(6,2,15),(7,2,20),(8,2,0),(9,2,50),(10,2,80),
  (11,2,65),(12,2,55),(13,2,40),(14,2,25),(15,2,60),(16,2,35),(17,2,15),(18,2,30),(19,2,85),(20,2,60),
  (21,2,55),(22,2,50),(23,2,60),(24,2,70),(25,2,0),(26,2,65),(27,2,40),(28,2,55),(29,2,45),(30,2,50),
  (31,2,20),(32,2,25),(33,2,15),(34,2,30),(35,2,25),(36,2,35),(37,2,20),(38,2,15),(39,2,0),(40,2,60),
  (41,2,25),(42,2,30),(43,2,20),(44,2,15),(45,2,25),(46,2,30),(47,2,0),(48,2,15),(49,2,25),(50,2,20),
  (51,2,15),(52,2,20),(53,2,10),(54,2,15),(55,2,20),(56,2,25),(57,2,15),(58,2,10),(59,2,25),(60,2,0),
  (61,2,15),(62,2,10),(63,2,20),(64,2,15),(65,2,10),(66,2,15),(67,2,20),(68,2,15),(69,2,10),(70,2,15),
  (71,2,25),(72,2,20),(73,2,15),(74,2,0),(75,2,20),(76,2,15),(77,2,25),(78,2,20),(79,2,15),(80,2,10),
  (81,2,20),(82,2,15),(83,2,25),(84,2,20),(85,2,15);

-- Store 3 (UrbanGrocer)
INSERT INTO item_availability(item_id, store_id, amount)
VALUES
  (1,3,60),(2,3,50),(3,3,55),(4,3,40),(5,3,30),(6,3,20),(7,3,25),(8,3,10),(9,3,90),(10,3,100),
  (11,3,45),(12,3,50),(13,3,35),(14,3,25),(15,3,60),(16,3,40),(17,3,0),(18,3,35),(19,3,95),(20,3,70),
  (21,3,55),(22,3,45),(23,3,60),(24,3,70),(25,3,55),(26,3,65),(27,3,40),(28,3,55),(29,3,0),(30,3,50),
  (31,3,25),(32,3,20),(33,3,15),(34,3,30),(35,3,25),(36,3,35),(37,3,20),(38,3,15),(39,3,55),(40,3,60),
  (41,3,25),(42,3,30),(43,3,20),(44,3,15),(45,3,25),(46,3,30),(47,3,0),(48,3,15),(49,3,25),(50,3,20),
  (51,3,15),(52,3,20),(53,3,10),(54,3,15),(55,3,20),(56,3,25),(57,3,15),(58,3,10),(59,3,25),(60,3,20),
  (61,3,0),(62,3,10),(63,3,20),(64,3,15),(65,3,10),(66,3,15),(67,3,20),(68,3,15),(69,3,10),(70,3,15),
  (71,3,20),(72,3,15),(73,3,10),(74,3,20),(75,3,15),(76,3,0),(77,3,25),(78,3,20),(79,3,15),(80,3,10),
  (81,3,20),(82,3,15),(83,3,10),(84,3,15),(85,3,0);

-- Store 4 (Daily Harvest Foods)
INSERT INTO item_availability(item_id, store_id, amount)
VALUES
  (1,4,55),(2,4,65),(3,4,60),(4,4,35),(5,4,30),(6,4,25),(7,4,30),(8,4,15),(9,4,85),(10,4,90),
  (11,4,50),(12,4,55),(13,4,40),(14,4,0),(15,4,65),(16,4,45),(17,4,20),(18,4,35),(19,4,90),(20,4,60),
  (21,4,55),(22,4,45),(23,4,65),(24,4,70),(25,4,60),(26,4,0),(27,4,45),(28,4,60),(29,4,50),(30,4,55),
  (31,4,25),(32,4,20),(33,4,15),(34,4,30),(35,4,25),(36,4,35),(37,4,20),(38,4,15),(39,4,55),(40,4,60),
  (41,4,30),(42,4,35),(43,4,20),(44,4,15),(45,4,0),(46,4,30),(47,4,20),(48,4,15),(49,4,25),(50,4,20),
  (51,4,15),(52,4,20),(53,4,10),(54,4,15),(55,4,20),(56,4,0),(57,4,15),(58,4,10),(59,4,25),(60,4,20),
  (61,4,15),(62,4,10),(63,4,20),(64,4,15),(65,4,10),(66,4,15),(67,4,20),(68,4,0),(69,4,10),(70,4,15),
  (71,4,20),(72,4,15),(73,4,10),(74,4,20),(75,4,15),(76,4,10),(77,4,0),(78,4,15),(79,4,10),(80,4,15),
  (81,4,20),(82,4,15),(83,4,0),(84,4,15),(85,4,10);

-- Store 5 (Prime Pantry)
INSERT INTO item_availability(item_id, store_id, amount)
VALUES
  (1,5,60),(2,5,70),(3,5,65),(4,5,40),(5,5,35),(6,5,25),(7,5,30),(8,5,20),(9,5,90),(10,5,95),
  (11,5,55),(12,5,60),(13,5,45),(14,5,35),(15,5,70),(16,5,50),(17,5,25),(18,5,0),(19,5,95),(20,5,65),
  (21,5,60),(22,5,50),(23,5,70),(24,5,75),(25,5,65),(26,5,70),(27,5,50),(28,5,65),(29,5,55),(30,5,60),
  (31,5,30),(32,5,25),(33,5,20),(34,5,35),(35,5,0),(36,5,40),(37,5,25),(38,5,20),(39,5,60),(40,5,65),
  (41,5,30),(42,5,35),(43,5,25),(44,5,20),(45,5,30),(46,5,35),(47,5,25),(48,5,20),(49,5,0),(50,5,25),
  (51,5,20),(52,5,25),(53,5,15),(54,5,20),(55,5,25),(56,5,30),(57,5,20),(58,5,0),(59,5,30),(60,5,25),
  (61,5,20),(62,5,15),(63,5,25),(64,5,20),(65,5,15),(66,5,20),(67,5,25),(68,5,20),(69,5,15),(70,5,20),
  (71,5,25),(72,5,20),(73,5,15),(74,5,25),(75,5,20),(76,5,15),(77,5,25),(78,5,0),(79,5,15),(80,5,20),
  (81,5,25),(82,5,20),(83,5,15),(84,5,20),(85,5,15);

-- Store 6 (Ocean & Farm Market)
INSERT INTO item_availability(item_id, store_id, amount)
VALUES
  (1,6,55),(2,6,65),(3,6,60),(4,6,35),(5,6,0),(6,6,25),(7,6,30),(8,6,15),(9,6,85),(10,6,90),
  (11,6,50),(12,6,55),(13,6,40),(14,6,30),(15,6,65),(16,6,45),(17,6,20),(18,6,35),(19,6,90),(20,6,60),
  (21,6,55),(22,6,45),(23,6,65),(24,6,70),(25,6,60),(26,6,0),(27,6,45),(28,6,60),(29,6,50),(30,6,55),
  (31,6,25),(32,6,20),(33,6,15),(34,6,30),(35,6,25),(36,6,35),(37,6,20),(38,6,15),(39,6,55),(40,6,60),
  (41,6,30),(42,6,35),(43,6,20),(44,6,15),(45,6,25),(46,6,30),(47,6,0),(48,6,15),(49,6,25),(50,6,20),
  (51,6,15),(52,6,20),(53,6,10),(54,6,15),(55,6,20),(56,6,25),(57,6,15),(58,6,10),(59,6,25),(60,6,20),
  (61,6,15),(62,6,10),(63,6,20),(64,6,15),(65,6,10),(66,6,15),(67,6,20),(68,6,15),(69,6,10),(70,6,15),
  (71,6,20),(72,6,15),(73,6,10),(74,6,20),(75,6,15),(76,6,10),(77,6,20),(78,6,15),(79,6,10),(80,6,15),
  (81,6,20),(82,6,15),(83,6,10),(84,6,15),(85,6,10);

-- Store 7 (QuickCart)
INSERT INTO item_availability(item_id, store_id, amount)
VALUES
  (1,7,60),(2,7,70),(3,7,65),(4,7,40),(5,7,35),(6,7,25),(7,7,30),(8,7,20),(9,7,90),(10,7,95),
  (11,7,55),(12,7,60),(13,7,45),(14,7,35),(15,7,70),(16,7,50),(17,7,25),(18,7,40),(19,7,95),(20,7,65),
  (21,7,60),(22,7,50),(23,7,70),(24,7,75),(25,7,65),(26,7,70),(27,7,50),(28,7,65),(29,7,55),(30,7,60),
  (31,7,30),(32,7,25),(33,7,20),(34,7,35),(35,7,0),(36,7,40),(37,7,25),(38,7,20),(39,7,60),(40,7,65),
  (41,7,30),(42,7,35),(43,7,25),(44,7,20),(45,7,30),(46,7,35),(47,7,25),(48,7,20),(49,7,0),(50,7,25),
  (51,7,20),(52,7,25),(53,7,15),(54,7,20),(55,7,25),(56,7,30),(57,7,20),(58,7,0),(59,7,30),(60,7,25),
  (61,7,20),(62,7,15),(63,7,25),(64,7,20),(65,7,15),(66,7,20),(67,7,25),(68,7,20),(69,7,15),(70,7,20),
  (71,7,25),(72,7,20),(73,7,15),(74,7,25),(75,7,20),(76,7,15),(77,7,25),(78,7,0),(79,7,15),(80,7,20),
  (81,7,25),(82,7,20),(83,7,15),(84,7,20),(85,7,15);

-- Store 8 (MetroFoods)
INSERT INTO item_availability(item_id, store_id, amount)
VALUES
  (1,8,55),(2,8,65),(3,8,60),(4,8,35),(5,8,30),(6,8,25),(7,8,30),(8,8,15),(9,8,85),(10,8,90),
  (11,8,50),(12,8,55),(13,8,40),(14,8,0),(15,8,65),(16,8,45),(17,8,20),(18,8,35),(19,8,90),(20,8,60),
  (21,8,55),(22,8,45),(23,8,65),(24,8,70),(25,8,60),(26,8,0),(27,8,45),(28,8,60),(29,8,50),(30,8,55),
  (31,8,25),(32,8,20),(33,8,15),(34,8,30),(35,8,25),(36,8,35),(37,8,20),(38,8,15),(39,8,55),(40,8,60),
  (41,8,30),(42,8,35),(43,8,20),(44,8,15),(45,8,25),(46,8,30),(47,8,0),(48,8,15),(49,8,25),(50,8,20),
  (51,8,15),(52,8,20),(53,8,10),(54,8,15),(55,8,20),(56,8,25),(57,8,15),(58,8,10),(59,8,25),(60,8,20),
  (61,8,15),(62,8,10),(63,8,20),(64,8,15),(65,8,10),(66,8,15),(67,8,20),(68,8,0),(69,8,10),(70,8,15),
  (71,8,20),(72,8,15),(73,8,10),(74,8,20),(75,8,15),(76,8,10),(77,8,20),(78,8,15),(79,8,10),(80,8,15),
  (81,8,20),(82,8,15),(83,8,0),(84,8,15),(85,8,10);

-- Store 9 (Family Choice Market)
INSERT INTO item_availability(item_id, store_id, amount)
VALUES
  (1,9,60),(2,9,70),(3,9,65),(4,9,40),(5,9,35),(6,9,25),(7,9,30),(8,9,20),(9,9,90),(10,9,95),
  (11,9,55),(12,9,60),(13,9,45),(14,9,35),(15,9,70),(16,9,50),(17,9,25),(18,9,0),(19,9,95),(20,9,65),
  (21,9,60),(22,9,50),(23,9,70),(24,9,75),(25,9,65),(26,9,70),(27,9,50),(28,9,65),(29,9,55),(30,9,60),
  (31,9,30),(32,9,25),(33,9,20),(34,9,35),(35,9,0),(36,9,40),(37,9,25),(38,9,20),(39,9,60),(40,9,65),
  (41,9,30),(42,9,35),(43,9,25),(44,9,20),(45,9,30),(46,9,35),(47,9,25),(48,9,20),(49,9,0),(50,9,25),
  (51,9,20),(52,9,25),(53,9,15),(54,9,20),(55,9,25),(56,9,30),(57,9,20),(58,9,0),(59,9,30),(60,9,25),
  (61,9,20),(62,9,15),(63,9,25),(64,9,20),(65,9,15),(66,9,20),(67,9,25),(68,9,20),(69,9,15),(70,9,20),
  (71,9,25),(72,9,20),(73,9,15),(74,9,25),(75,9,20),(76,9,15),(77,9,25),(78,9,0),(79,9,15),(80,9,20),
  (81,9,25),(82,9,20),(83,9,15),(84,9,20),(85,9,15);

-- Store 10 (Budget Basket)
INSERT INTO item_availability(item_id, store_id, amount)
VALUES
  (1,10,55),(2,10,65),(3,10,60),(4,10,35),(5,10,0),(6,10,25),(7,10,30),(8,10,15),(9,10,85),(10,10,90),
  (11,10,50),(12,10,55),(13,10,40),(14,10,30),(15,10,65),(16,10,45),(17,10,20),(18,10,35),(19,10,90),(20,10,60),
  (21,10,55),(22,10,45),(23,10,65),(24,10,70),(25,10,60),(26,10,0),(27,10,45),(28,10,60),(29,10,50),(30,10,55),
  (31,10,25),(32,10,20),(33,10,15),(34,10,30),(35,10,25),(36,10,35),(37,10,20),(38,10,15),(39,10,55),(40,10,60),
  (41,10,30),(42,10,35),(43,10,20),(44,10,15),(45,10,25),(46,10,30),(47,10,0),(48,10,15),(49,10,25),(50,10,20),
  (51,10,15),(52,10,20),(53,10,10),(54,10,15),(55,10,20),(56,10,25),(57,10,15),(58,10,10),(59,10,25),(60,10,20),
  (61,10,15),(62,10,10),(63,10,20),(64,10,15),(65,10,10),(66,10,15),(67,10,20),(68,10,0),(69,10,10),(70,10,15),
  (71,10,20),(72,10,15),(73,10,10),(74,10,20),(75,10,15),(76,10,10),(77,10,20),(78,10,15),(79,10,10),(80,10,15),
  (81,10,20),(82,10,15),(83,10,0),(84,10,15),(85,10,10);
`;

async function main() {
  const client = new Client({
    connectionString: process.env.DB_URI,
    multipleStatements: true,
  });
  console.log('Connecting to the database...');
  await client.connect();
  console.log('Connected. Creating tables...');
  await client.query(createTables);
  console.log('Tables have been created. Inserting categories...');
  await client.query(populateCategories);
  console.log('Categories have been created. Inserting data into items...');
  await client.query(populateItems);
  console.log(
    'Items have been inserted. Inserting stores into the database...',
  );
  await client.query(populateStores);
  console.log(
    'Stores have been populated. Generating availability for each store...',
  );
  await client.query(populateAvailability);
  console.log('All data has been inserted.');
  await client.end();
  console.log('Disconnected from the database.');
}

main();
