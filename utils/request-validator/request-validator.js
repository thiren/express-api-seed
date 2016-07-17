'use strict';

const Ajv = require('ajv');
let ajv = new Ajv();

module.exports = {
    init: init,
    addSchema: addSchema,
    validate: validate
};

function init(schemaList) {
    for (var key in schemaList) {
        if (schemaList.hasOwnProperty(key)) {
            addSchema(require(schemaList[key]), key);
        }
    }
}

function addSchema(schema, schemaName) {
    ajv.addSchema(schema, schemaName);
}

function validate(schemaName) {
    return validateRequestAgainstSchema;

    function validateRequestAgainstSchema(req, res, next) {
        var valid = ajv.validate(schemaName, req.body);
        if (!valid) {
            return next(ajv.errors)
        }
        next();
    }
}
