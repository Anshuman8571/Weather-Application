const Joi = require("joi");

const weatherQueryschema = Joi.object({
    city: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .pattern(/^[a-zA-Z\s]+$/)
        .messages({
            "string.base": "City must be a string",
            "string.empty": "City cannot be empty",
            "string.min": "City must contain atlease 2 characters",
            "string.max": "City must contain no more than 50 characters.",
            "string.pattern.base": "City must contain only letters",
            "any.required": "City is required"
        })
});

module.exports = { weatherQueryschema };