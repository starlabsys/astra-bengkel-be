import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
const db = require("../db/models");

const validate = [
    check("username", "Please enter a username").isLength({ min: 6 }),
    check("password", "Please enter a valid password").isLength({ min: 6 }),
    check('role', 'Please enter a valid role').isIn(['Admin', 'User']),
    check('name', 'Please enter a valid owner name').isLength({ min: 3 }),
    check('name_dealer', 'Please enter a valid owner address').isLength({ min: 3 }),
    check('dealer_number', 'Please enter a valid owner phone').isLength({ min: 3 }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
]

export default validate;