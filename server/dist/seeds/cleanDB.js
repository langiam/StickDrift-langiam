"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../models/index.js");
const cleanDB = async () => {
    try {
        await index_js_1.Profile.deleteMany({});
        console.log('Profile collection cleaned.');
    }
    catch (err) {
        console.error('Error cleaning collections:', err);
        process.exit(1);
    }
};
exports.default = cleanDB;
