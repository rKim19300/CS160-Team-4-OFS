const { validationResult } = require('express-validator');

// sequential processing, stops running validations chain if the previous one fails
const validateReqBody = validations => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        let { msg } = errors["errors"][0];
        res.status(400).send(msg);
    };
};


const checkLoggedIn = (req, res, next) => {
    if (req.session.user) {
        // then the user is logged in
        req.user_id = req.session.user.user_id;
        next();
    } else {
        // the user is not logged in
        res.status(401).send("You are not logged in");
    }
}

const checkIsEmployee = (req, res, next) => {
    if (req.session.user && (req.session.user.user_type === 1)) {
        req.user_id = req.session.user.user_id;
        next();
    } else {
        res.status(401).send("You are not an employee");
    }

}

module.exports = { validateReqBody, checkLoggedIn, checkIsEmployee };
