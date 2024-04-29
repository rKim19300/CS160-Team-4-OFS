const { DB } = require("../../database");

class HelperFuncs {
    ///////
    // CART STUFF
    ///////
    static async check_cart_will_be_below_weight_limit(cart_id, productInfo, quantity, MAX_CART_WEIGHT, action) {
        let cart_weight = await DB.get_cart_weight(cart_id);
        if (action === "ADD" && cart_weight+(productInfo.weight*quantity) > MAX_CART_WEIGHT) {
            return [false, `Exceeded max cart weight (${MAX_CART_WEIGHT}lbs)`];
        } else if (action === "MODIFY") {
            let cart_item_quantity = await DB.get_cart_item_quantity(cart_id, productInfo.product_id);
            if (cart_weight+(productInfo.weight*(quantity-cart_item_quantity)) > MAX_CART_WEIGHT) {
                return [false, `Exceeded max cart weight (${MAX_CART_WEIGHT}lbs)`];
            }
        }
        return [true, "all good"];
    }

    static async check_cart_quantity_will_be_lte_inventory_amt(cart_id, productInfo, quantity) {
        let cart_item_quantity = await DB.get_cart_item_quantity(cart_id, productInfo.product_id);
        if (cart_item_quantity + quantity > productInfo.quantity) {
            return [false, `Maximum quantity allowed in cart: ${productInfo.quantity}`];
        }
        return [true, "all good"];
    }

    static async _check_quantity_lte_inventory_amt(quantity, product_id) {
        let { productInfo, errMsg } = await DB.get_product_info(product_id);
        if (errMsg) return [false, errMsg];
        if (productInfo.quantity === 0) return [false, "Out of stock"];
        if (quantity > productInfo.quantity) {
            return [false, `Maximum quantity allowed in cart: ${productInfo.quantity}`];
        }
        return [true, "all good"];
    }

    static async check_all_cart_items_availability(cart_items) {
        let errMsgs = [];
        for (let cart_item of cart_items) {
            let { product_id, quantity: cartQuantity, name } = cart_item;
            let [isValidCartQuantity, errMsg] = await this._check_quantity_lte_inventory_amt(cartQuantity, product_id);
            if (!isValidCartQuantity) errMsgs.push(`${name} -> ${errMsg}`);
        }
        return errMsgs;
    }
}

module.exports = { HelperFuncs };
