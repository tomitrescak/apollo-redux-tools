"use strict";
function ioSchema(body) {
    return "\n  type " + body.replace(/\$Input/g, '') + "\n  input " + body.replace(/\$Input/g, 'Input') + "\n  ";
}
exports.ioSchema = ioSchema;
function modificationSchema() {
    return "\n    createdById: String\n    createdBy: String\n    createdAt: Date\n    updatedById: String\n    updatedBy: String\n    updatedAt: Date\n  ";
}
exports.modificationSchema = modificationSchema;
