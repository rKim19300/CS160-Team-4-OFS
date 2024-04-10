const { DB } = require("../database");

const store = { 
    lat: 37.33518596879412, 
    lng: -121.88107208071463
};

// Tests robot DB functions
async function robot_tests() {

    try {
        // Create robot and get it's data
        await DB.add_new_robot();
        let robot_data = await DB.get_robot_data(); // This data will be in an array
        console.log(JSON.stringify(robot_data) + ":");
        console.log(`robot lat is store's?: ${robot_data[0].latitude === store.lat}`);
        console.log(`robot lng is store's?: ${robot_data[0].longitude === store.lng}`);

        // Check other details
        let has_route = await DB.has_route(robot_data.robot_id);
        console.log(`Robot doesn't have route?: ${!has_route}`);
        let route = await DB.get_route(robot_data.robot_id);
        console.log(`Robot route is null?: ${route === undefined}`);

    }
    catch (err) {
        console.error(`ROBOT TEST FAILED: ${err}`);
    }

}

// Tests routing function
async function route_tests() {

    try {
        await DB.create_route(25); // Adds order of id 25 to a new route
        await DB.add_order_to_route(1, 27); // Add Order to route 1
        let weight_orders = await DB.get_route_weight_and_order_num(route_id=1);
        console.log(`Weight is 8.4: ${weight_orders.total_weight === 8.4}  Actual = ${weight_orders.total_weight}`);
        console.log(`Orders num is 2: ${weight_orders.order_num === 2} Actual = ${weight_orders.order_num}`);
        await DB.set_route_to_robot(route_id=1, robot_id=1);
        console.log("point 5");
        let has_route = await DB.has_route(robot_id=1);
        console.log(`Robots has route?: ${has_route}`);
        let route_orders = await DB.get_route_orders(route_id=1);
        console.log(`The route orders are: ${JSON.stringify(route_orders)}`)
    }
    catch (err) {
        console.error(`ROUTE TEST FAILED: ${err}`);
    }

}

(async () => {
    // await robot_tests();
    await route_tests();
})();

