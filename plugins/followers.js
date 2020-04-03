'use strict';

const Pckge = require('../package.json');
const Confg = require('../config/manifest.json');

exports.plugin = {
    name: 'Followers Page',
    version: '1.0.0',
    dependencies: '@hapi/vision',
    register: async function (server, options) {

        // Create a route for example

        server.route({
            method: 'GET',
            path: '/',
            handler: function (request, h) {
                return h.view('index', { title: Pckge.name });
            }
        });

    }
};