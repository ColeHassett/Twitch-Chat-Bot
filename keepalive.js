module.exports.start = () => {
    const http = require('http');
    const express = require('express');
    const app = express();
    app.get("/", (request, response) => response.sendStatus(200));
    app.listen(process.env.PORT);
};
