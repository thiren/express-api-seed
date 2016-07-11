'use strict';

var Ajv = require('ajv');
var ajv = new Ajv();

module.exports = {
    init: init,
    addSchema: addSchema,
    validate: validate
};

function init(schemaIndex) {
    for (var key in schemaIndex) {
        if (schemaIndex.hasOwnProperty(key)) {
            ajv.addSchema(require(schemaIndex[key]), key);
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
