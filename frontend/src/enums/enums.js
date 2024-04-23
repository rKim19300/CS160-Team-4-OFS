
const UserType = Object.freeze({ 
    CUSTOMER: 0, 
    EMPLOYEE: 1, 
    MANAGER: 2
}); 

const OrderStatus = Object.freeze({ 
    PROCESSING: 0, 
    EN_ROUTE: 1, 
    DELIVERED: 2
}); 


module.exports = { UserType, OrderStatus };