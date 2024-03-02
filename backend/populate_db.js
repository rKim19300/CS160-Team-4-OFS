const { DB } = require("./database");

async function addProducts() {
    // name, description, image_url, price, weight, quantity

    // make sure that the images you add are actual pngs (meaning the background is transparent) 
    await DB.add_new_product(
        "Apple",
        "Our apples offer a delightful blend of crispness and sweetness, making them perfect for snacking or enhancing your favorite recipes",
        "https://static.wikia.nocookie.net/the-snack-encyclopedia/images/7/7d/Apple.png",
        0.50, 1.2, 50);
    await DB.add_new_product(
        "Banana",
        "Our ripe bananas deliver a tropical burst of flavor and creamy texture, perfect for enjoying on their own or adding to desserts",
        "https://www.freeiconspng.com/thumbs/banana-png/banana-png-32.png",
        0.75, 2, 30);
    await DB.add_new_product(
        "Salmon Fillet",
        "Our fresh salmon boasts a succulent texture and rich flavor, ideal for grilling, baking, or pan-searing to perfection",
        "https://images.freshop.com/6839750/d74665b036d858350ec55ad1437b5f90_large.png",
        5, 2.8, 25);
    await DB.add_new_product(
        "Brown Rice",
        "Our whole grain brown rice offers a hearty texture and nutty flavor, perfect for nourishing meals or as a side dish",
        "https://png.pngtree.com/png-clipart/20240212/original/pngtree-top-view-raw-rice-inside-plate-on-dark-desk-png-image_14296379.png",
        7, 5, 15);
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
}


(async () => {
    await addUsers();
    await addProducts();
})();
