"use strict";
exports.handler = async (event = {}) => {
    console.log('Hello World-js!');
    const response = 'Hello World-js!' + JSON.stringify(event, null, 2);
    return response;
};

console.log('whatup-thar-js!');
