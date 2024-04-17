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
        let on_route = await DB.is_on_route(1);
        console.log(`The Robot is not on route ${!on_route}`);
    }
    catch (err) {
        console.error(`ROBOT TEST FAILED: ${err}`);
    }

}

// Tests routing function
async function route_tests() {

    try {
        const route_id = await DB.create_route(21); // Adds order of id 25 to a new route

        let is_on_route = await DB.route_robot_on_route(route_id);
        console.log(`route is not associated with a robot?: ${!is_on_route}`);

        // Check shape of this function
        let all_routes = await DB.get_all_routes();
        console.log(all_routes);

        await DB.add_order_to_route(route_id, 22); // Add Order to route 1
        let weight_orders = await DB.get_route_weight_and_order_num(route_id);
        console.log(`Weight is 8.4: ${weight_orders.total_weight === 9.52}  Actual = ${weight_orders.total_weight}`);
        console.log(`Orders num is 2: ${weight_orders.order_num === 2} Actual = ${weight_orders.order_num}`);
        
        let success = await DB.set_route_to_robot(route_id, 1);
        is_on_route = await DB.route_robot_on_route(route_id);
        console.log(`Route is associated with robot but not ON_ROUTE?: ${!is_on_route}`);

        let has_route = await DB.has_route(1);
        console.log(`Robots has route?: ${has_route}`);
        let route_orders = await DB.get_route_orders(route_id);
        console.log(`The route orders are: ${JSON.stringify(route_orders)}`)
        return route_id;
    }
    catch (err) {
        console.error(`ROUTE TEST FAILED: ${err}`);
    }
}

async function populate_route(route_id) {
    try {
        let addresses = ["2044 McKee Rd, San Jose, CA 95116", "601 N 4th St, San Jose, CA 95112"];
        let polylines = ["polyline 1", "polyline 2"];
        let durations = [1234, 4345];
        let optimizedWaypointOrder = [1, 0];

        await DB.populate_route_data(route_id, addresses, polylines, durations, optimizedWaypointOrder);
        let polyline = await DB.get_route_polylines(route_id);

        // Remove each part of the route
        await DB.finish_route_leg(route_id, 0);
        await DB.finish_route_leg(route_id, 1);

        await DB.delete_route(route_id);
    }
    catch (err) {
        console.error(`POPULATE ROUTE TEST FAILED: ${err}`);
    }
}

async function get_addresses() {
    try {
        let addresses = await DB.get_route_addresses(1);
        console.log(JSON.stringify(addresses));
    }
    catch (err) {
        console.error(`ADDRESS QUERY FAILED: ${err}`);
    }
}

(async () => {
    // await robot_tests();
    //let route_id = await route_tests();
    // await populate_route(route_id);
    get_addresses();
})();

