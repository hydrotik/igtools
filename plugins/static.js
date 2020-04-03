'use strict';

const Path = require('path');
const Inert = require('@hapi/inert');

exports.plugin = {
    name: 'Static',
    version: '1.0.0',
    dependencies: '@hapi/inert',
    register: async function (server, options) {

        // Create a route for example


        await server.register(Inert);

        server.route({
            method: 'GET',
            path: '/js/{filename}',
            handler: {
                directory: {
                    path: './public/js/'
                }
            }
        });

        server.route({
            method: 'GET',
            path: '/css/{filename}',
            handler: {
                directory: {
                    path: './public/css/'
                }
            }
        });

        server.route({
            method: 'GET',
            path: '/images/{filename}',
            handler: {
                directory: {
                    path: './public/images/'
                }
            }
        });

    }
};