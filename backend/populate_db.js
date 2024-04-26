const { DB } = require("./database");

async function addRobots() {
    DB.add_new_robot();
    DB.add_new_robot();
}

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
    await DB.add_new_product(
        "Pasta",
        "Our pasta noodles offer a delightful blend of firmness and texture that pairs perfectly with your favorite sauces and ingredients",
        "https://www.realsimple.com/thmb/Q9AoEkcxo5p4R4bF7jyea69GwAU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/types-of-pasta-noodles-linguine-92e6a63f388e4c0e98325629086cf646.jpg",
        5.99,
        3,
        50
    );
    await DB.add_new_product(
        "Broccoli",
        "Our broccoli stands out with its fresh, crisp texture and vibrant green color, making it a versatile and nutritious addition to any meal",
        "https://purepng.com/public/uploads/large/purepng.com-broccolivegetables-broccoli-941524725896rn80y.png",
        1.85,
        1.1,
        40
    );
    await DB.add_new_product(
        "Brown Eggs",
        "Our brown eggs offer a classic choice for your breakfast table, featuring a rich flavor and firm texture that's perfect for any cooking style",
        "https://img1.exportersindia.com/product_images/bc-full/2021/12/9665693/brown-eggs-1640669879-6133575.jpeg",
        5.99,
        6,
        20
    );
    await DB.add_new_product(
        "White Eggs",
        "Our white eggs offer a classic choice for any meal, prized for their versatility and protein-packed goodness",
        "https://oexmarkets.com/wp-content/uploads/2020/03/white-egg.jpg",
        5.50,
        6,
        30
    );
    await DB.add_new_product(
        "Beef",
        "Our beef is a culinary cornerstone, renowned for its rich flavor and juicy tenderness that transforms any meal into a savory delight",
        "https://thumbs.dreamstime.com/b/shin-beef-meat-isolated-white-studio-background-uncooked-organic-48190235.jpg",
        12.99,
        5,
        20
    );
    await DB.add_new_product(
        "Pork Chop",
        "Our pork chops are a culinary delight, prized for their tender texture and succulent flavor that promises to elevate any meal",
        "https://shop.kootenay.coop/cdn/shop/products/Boneless-Pork-Chops_dccd6c20-5cba-42d1-a55e-3e7178edb53e.jpg?v=1613857324",
        6.99,
        4,
        25
    );
    await DB.add_new_product(
        "Chicken Breast",
        "Our chicken breasts are a kitchen staple, prized for their lean protein and versatility in countless recipes",
        "https://png.pngtree.com/png-clipart/20231018/original/pngtree-isolated-white-background-with-raw-chicken-breast-a-key-photo-png-image_13345132.png",
        4.99,
        4,
        25
    );
    await DB.add_new_product(
        "Milk",
        "Our milk is sourced from trusted dairy farms and delivered fresh to your table for a delightful drinking experience",
        "https://target.scene7.com/is/image/Target/GUEST_419f1169-a698-45a1-8d89-ad28136ba841?wid=488&hei=488&fmt=pjpeg",
        5.99,
        5,
        30
    );
    await DB.add_new_product(
        "Corn",
        "Our corn offers sweet, golden kernels bursting with flavor, perfect for adding a touch of summer to your meals",
        "https://static.vecteezy.com/system/resources/previews/001/410/232/large_2x/fresh-corn-isolated-on-white-background-free-photo.jpg",
        2.99,
        7,
        30
    );
    await DB.add_new_product(
        "Onions",
        "Our onions bring a burst of flavor and aromatic richness to your dishes, enhancing every culinary creation with their savory sweetness",
        "https://storage.googleapis.com/images-fol-prd-83dd8b8.fol.prd.v8.commerce.mi9cloud.com/product-images/detail/4663.jpg",
        3.99,
        7,
        20
    );
    await DB.add_new_product(
        "Potatoes",
        "Our potatoes boast a hearty texture and rich flavor, perfect for adding depth to any dish",
        "https://img.freepik.com/premium-photo/potato-isolated-white_362171-1296.jpg",
        3.99,
        10,
        50
    );
    await DB.add_new_product(
        "Bell Peppers",
        "Our bell peppers offer a burst of vibrant color and crisp, sweet flavor, perfect for adding a pop of freshness to your recipes",
        "https://thumbs.dreamstime.com/b/red-green-yellow-bell-pepper-isolated-white-background-red-green-yellow-bell-pepper-isolated-white-background-147139427.jpg",
        3.99,
        5,
        27
    );
    await DB.add_new_product(
        "Green Beans",
        "Our green beans bring a fresh, crisp texture and vibrant color to your dishes, adding a nutritious touch to any meal",
        "https://e-xportmorocco.com/storage/produits/1645112683.jpeg",
        4.99,
        3,
        15
    );
}

async function addCategories() {
    await DB.add_new_category("Dairy & Eggs");
    await DB.add_new_category("Vegetables");
    await DB.add_new_category("Fruits");
    await DB.add_new_category("Meat");
    await DB.add_new_category("Seafood");
    await DB.add_new_category("Protein");
    await DB.add_new_category("Drinks");
    await DB.add_new_category("Frozen");
}

async function setProductCategories() {
    // product_id (int), category_ids (list of ints)
    await DB.set_product_categories(1, [3]);
    await DB.set_product_categories(2, [3]);
    await DB.set_product_categories(3, [5, 6, 8]);
    await DB.set_product_categories(5, [3]);
    await DB.set_product_categories(6, [7]);
    await DB.set_product_categories(7, [7]);
    await DB.set_product_categories(9, [2]);
    await DB.set_product_categories(10, [1, 6]);
    await DB.set_product_categories(11, [1, 6]);
    await DB.set_product_categories(12, [4, 6]);
    await DB.set_product_categories(13, [4, 6]);
    await DB.set_product_categories(14, [4, 6, 8]);
    await DB.set_product_categories(15, [1, 7]);
    await DB.set_product_categories(16, [2]);
    await DB.set_product_categories(17, [2]);
    await DB.set_product_categories(18, [2]);
    await DB.set_product_categories(19, [2]);
    await DB.set_product_categories(20, [2]);
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
    await addCategories();
    await setProductCategories();
    await addProducts();
    await addRobots();
    // await addOrders();
})();
