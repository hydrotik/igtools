'use strict';

const Path = require('path');
const Hapi = require('@hapi/hapi');
const Hoek = require('@hapi/hoek');
const Glue = require('@hapi/glue');
const Vision = require('@hapi/vision'); 
const Inert = require('@hapi/inert');

//const AdminBroPlugin = require('admin-bro-hapijs');
//const db = require('./config/db.json');

const init = async () => {
    var config = require('./config/manifest.json');

    const options = {
        relativeTo: __dirname
    };

    const webServer = await Glue.compose(config, options);

    await webServer.register(Vision);
    await webServer.register(Inert);

    /*
	const ADMIN = {
	  email: 'text@example.com',
	  password: 'password',
	}

	const adminBroOptions = {
	  resources: ['Follower'],

	  auth: {
	    authenticate: (email, password) => {
	      if (ADMIN.email === email && ADMIN.password === password) {
	        return ADMIN
	      }
	      return null
	    },
	    strategy: 'session',
	    cookieName: 'adminBroCookie',
	    cookiePassword: process.env.COOKIE_PASSWORD || 'makesurepasswordissecure',
	    isSecure: true, //only https requests
	  },
	}


    await webServer.register({
	    plugin: AdminBroPlugin,
	    options: adminBroOptions,
	  })
	*/

    webServer.views({
        engines: {
            html: {
	            module: require('handlebars'),
	            compileMode: 'sync'
	        }
        },
        relativeTo: __dirname,
        path: 'templates'
    });


    await webServer.start();

    console.log('Web server started.');
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();