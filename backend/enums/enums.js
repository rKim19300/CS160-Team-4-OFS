
const UserType = Object.freeze({ 
    CUSTOMER: 0, 
    EMPLOYEE: 1, 
    MANAGER: 2
}); 

const SocketRoom = Object.freeze({ 
    STAFF_ROOM: 'staff-room', 
    CUSTOMER_ROOM: 'customer-room'
});

const OrderStatus = Object.freeze({ 
    ORDER_PLACED: 0, 
    ON_THE_WAY: 1,
    DELIVERED: 2
});

const RobotStatus = Object.freeze({ 
    IDLE: 0, 
    ON_ROUTE: 1
});

module.exports = { UserType, SocketRoom, OrderStatus, RobotStatus };