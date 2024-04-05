
const UserType = Object.freeze({ 
    CUSTOMER: 0, 
    EMPLOYEE: 1, 
    MANAGER: 2
}); 

const SocketRoom = Object.freeze({ 
    STAFF_ROOM: 'staff-room', 
    CUSTOMER_ROOM: 'customer-room'
});

module.exports = { UserType, SocketRoom };