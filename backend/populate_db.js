const { DB } = require("./database");

async function addProducts() {
  // name, description, image_url, price, weight, quantity

  // make sure that the images you add either have transparent background (preferable) or a white background
  await DB.add_new_product(
    "Apple",
    "Our apples offer a delightful blend of crispness and sweetness, making them perfect for snacking or enhancing your favorite recipes",
    "https://static.wikia.nocookie.net/the-snack-encyclopedia/images/7/7d/Apple.png",
    0.5,
    1.2,
    50
  );
  await DB.add_new_product(
    "Banana",
    "Our ripe bananas deliver a tropical burst of flavor and creamy texture, perfect for enjoying on their own or adding to desserts",
    "https://www.freeiconspng.com/thumbs/banana-png/banana-png-32.png",
    0.75,
    2,
    30
  );
  await DB.add_new_product(
    "Salmon Fillet",
    "Our fresh salmon boasts a succulent texture and rich flavor, ideal for grilling, baking, or pan-searing to perfection",
    "https://images.freshop.com/6839750/d74665b036d858350ec55ad1437b5f90_large.png",
    5,
    2.8,
    25
  );
  await DB.add_new_product(
    "Brown Rice",
    "Our whole grain brown rice offers a hearty texture and nutty flavor, perfect for nourishing meals or as a side dish",
    "https://png.pngtree.com/png-clipart/20240212/original/pngtree-top-view-raw-rice-inside-plate-on-dark-desk-png-image_14296379.png",
    7,
    5,
    15
  );
  await DB.add_new_product(
    "Orange",
    "Our vibrant oranges burst with juicy sweetness and refreshing citrus flavor, perfect for a healthy snack or a tasty addition to salads and desserts",
    "https://5.imimg.com/data5/EE/ER/MY-27568370/fresh-orange-500x500.png",
    1.99,
    1,
    45
  );
  await DB.add_new_product(
    "Orange Juice",
    "Our freshly squeezed orange juice delivers a vibrant burst of citrus goodness, brimming with natural sweetness and tangy zest",
    "https://target.scene7.com/is/image/Target/GUEST_2b7f75ea-fbb8-4767-8b1f-6bb809bfe214?wid=488&hei=488&fmt=pjpeg",
    3.99,
    2,
    25
  );
  await DB.add_new_product(
    "Apple Juice",
    "Our crisp apple juice embodies the essence of orchard-fresh sweetness, offering a refreshing burst of flavor with every sip",
    "https://s3.amazonaws.com/grocery-project/product_images/great-value-100-juice-apple-561635-9182579.jpg",
    3.99,
    2,
    25
  );
}

async function addCategories() {
  // TODO: write DB functions for categories
}

async function addUsers() {
  // email, username, hashedPw, userType (optional, will default to 0 which is a customer)
  await DB.insert_new_user(
    "admin@admin.com",
    "admin",
    "$2b$10$s0fAwcKr.0OPl2SfJ5aaguCwLADLz8MiwK4A8.hcuD0QhXnbtjFpe", // admin
    2
  );

  await DB.insert_new_user(
    "employee@employee.com",
    "employee",
    "$2b$10$84LBu57ijcWLdBbgvw6ThuXlSV8nDoKmkocC2YbEwmdJapB3hD7FS", // employee
    1
  );

  await DB.insert_new_user(
    "johndoe@gmail.com",
    "John Doe",
    "$2b$10$QYUq3SW27qdwMOHwqpZATewirLwpOTT0UaUg/C8WEKNKzfT8UpdTi", // password
    2
  );
}

// To help test Analytics page
async function addOrders() {
  // user_id, cost, weight, address, delivery_fee, created_at, cart_id

  /* Week */
  await DB.add_new_order(
    (user_id = 1),
    (cost = 43.28),
    (weight = 4.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2024-03-12 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 57.28),
    (weight = 6.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2024-03-11 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 68.28),
    (weight = 8.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2024-03-10 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 89.28),
    (weight = 10.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2024-03-09 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 38.28),
    (weight = 5.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2024-03-08 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 27.28),
    (weight = 5.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2024-03-07 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 16.28),
    (weight = 2.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2024-03-06 01:15:00"),
    (cart_id = 1)
  );

  /* Month */
  await DB.add_new_order(
    (user_id = 1),
    (cost = 11.28),
    (weight = 2.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2024-02-06 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 21.28),
    (weight = 2.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2024-01-06 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 98.28),
    (weight = 2.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2023-12-06 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 100.28),
    (weight = 2.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2023-11-06 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 62.28),
    (weight = 2.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2023-10-06 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 92.28),
    (weight = 2.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2023-09-06 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 98.28),
    (weight = 2.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2023-08-06 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 98.28),
    (weight = 2.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2023-07-06 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 98.28),
    (weight = 2.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2023-06-06 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 98.28),
    (weight = 2.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2023-05-06 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 98.28),
    (weight = 2.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2023-04-06 01:15:00"),
    (cart_id = 1)
  );

  await DB.add_new_order(
    (user_id = 1),
    (cost = 98.28),
    (weight = 2.75),
    (address = "1 Washington Sq, San Jose, CA 95192"),
    (delivery_fee = 6.58),
    (created_at = "2022-04-06 01:15:00"),
    (cart_id = 1)
  );
}

(async () => {
  await addUsers();
  await addProducts();
  await addOrders();
})();
