const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.all('/:service*', function(req, res, end) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    const router = tryFindRouter(req.params.service);

    req.url = req.url.slice(`/${req.params.service}`.length);

    if(req.url === '')
        req.url = '/';

    router.handle(req, res, end);
});

app.listen(port, function () {
    console.log(`Services listening on port ${port}`);
});

const services = {};

function tryFindRouter(service) {
    return services[service] || (services[service] = tryRequire(`./services/${service}/index`));
}

function tryRequire(module) {
    try {
        return require(module);
    } catch(ex) {}
}