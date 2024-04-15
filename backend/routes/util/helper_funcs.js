const { DB } = require("../../database");

class HelperFuncs {
    ///////
    // CART STUFF
    ///////
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
        if (productInfo.quantity === 0) return [false, "Out of stock"];
        if (quantity > productInfo.quantity) {
            return [false, `Maximum quantity allowed in cart: ${productInfo.quantity}`];
        }
        return [true, "all good"];
    }

    static async check_cart_quantity_will_be_lte_inventory_amt(cart_id, product_id, quantity) {
        let cart_item_quantity = await DB.get_cart_item_quantity(cart_id, product_id);
        let { productInfo, errMsg } = await DB.get_product_info(product_id);
        if (errMsg) return [false, errMsg];
        if (productInfo.quantity === 0) return [false, "Out of stock"];
        if (cart_item_quantity + quantity > productInfo.quantity) {
            return [false, `Maximum quantity allowed in cart: ${productInfo.quantity}`];
        }
        return [true, "all good"];
    }

    static async get_cart_summary(cart_id) {
        let cartWeight = await DB.get_cart_weight(cart_id);
        let subtotal_cost = await DB.get_cart_subtotal_cost(cart_id);
        let deliveryFee = cartWeight < 20 ? 0 : 10;
        let taxAmount = subtotal_cost / 100;
        let ordered_at = await DB.get_current_time(); 
        return { cartWeight, subtotal_cost, deliveryFee, taxAmount, ordered_at };
    }

    static async check_all_cart_items_availability(cart_items) {
        let errMsgs = [];
        for (let cart_item of cart_items) {
            let { product_id, quantity: cartQuantity, name } = cart_item;
            let [isValidCartQuantity, errMsg] = await this.check_quantity_lte_inventory_amt(cartQuantity, product_id);
            if (!isValidCartQuantity) errMsgs.push(`${name} -> ${errMsg}`);
        }
        return errMsgs;
    }
}

module.exports = { HelperFuncs };
