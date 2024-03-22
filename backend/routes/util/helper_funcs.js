const { DB } = require("../../database");

class HelperFuncs {
    static async check_cart_will_be_below_weight_limit(cart_id, product_id, quantity, MAX_CART_WEIGHT) {
        let { productInfo, errMsg } = await DB.get_product_info(product_id);
        if (errMsg) return [false, errMsg];
        let cart_weight = await DB.get_cart_weight(cart_id);
        let cart_item_quantity = await DB.get_cart_item_quantity(cart_id, product_id);
        if (cart_weight + (productInfo.weight*(quantity-cart_item_quantity)) > MAX_CART_WEIGHT) {
            return [false, `Exceeded max cart weight (${MAX_CART_WEIGHT}lbs)`];
        }
        return [true, "all good"];
    }

    static async check_quantity_lte_inventory_amt(quantity, product_id) {
        let { productInfo, errMsg } = await DB.get_product_info(product_id);
        if (errMsg) return [false, errMsg];
        if (quantity > productInfo.quantity) {
            return [false, `Maximum quantity allowed in cart: ${productInfo.quantity}`];
        }
        return [true, "all good"];
    }

    static async check_cart_quantity_will_be_lte_inventory_amt(cart_id, product_id, quantity) {
        let cart_item_quantity = await DB.get_cart_item_quantity(cart_id, product_id);
        let { productInfo, errMsg } = await DB.get_product_info(product_id);
        if (errMsg) return [false, errMsg];
        if (cart_item_quantity + quantity > productInfo.quantity) {
            return [false, `Maximum quantity allowed in cart: ${productInfo.quantity}`];
        }
        return [true, "all good"];
    }
}

module.exports = { HelperFuncs };
