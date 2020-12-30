const hbs = require('hbs')
const wax = require('wax-on')

function setupHBS() {
    // setup template inheritance
    wax.on(hbs.handlebars);
    wax.setLayoutPath('./views/layouts');

    // handlebar helpers
    var helpers = require("handlebars-helpers")({
        handlebars: hbs.handlebars
    });
}

module.exports = {
    setupHBS
}