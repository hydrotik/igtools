'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Followers = {};
const htmlToJson = require("html-to-json");
const db = require('../config/db.json');
const _ = require('lodash');

function FollowerModel () {

    Mongoose.connect(db.server, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });


    this.schema = new Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        fullName: {
            type: String,
            default: ''
        },
        href: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
        dateFollowed: {
            type: Date,
            default: Date.now
        },
        dateUnfollowed: {
            type: Date
        },
        updated: { 
            type: Date,
            default: Date.now
        }
    });

    this.schema.pre('save', function(next) {
        if (this.fullName === null) {
            this.fullName = '';
        }

        if (this.active === null) {
            this.active = true;
        }

        if (this.dateFollowed === null) {
            this.dateFollowed = new Date();
        }

        if (this.updated === null) {
            this.updated = new Date();
        }

        next();
    });

    this.model = Mongoose.model('Follower', this.schema);


    //load database

    this.db = Mongoose.connection;
    this.db.on('error', console.error.bind(console, 'connection error'));
    this.db.once('open', function callback() {
        console.log('Connection with database succeeded.');
    });
}

FollowerModel.prototype = {
  getSchema,
  getModel
};

module.exports = FollowerModel;

// 
function getSchema () {
  return this.schema;
};

function getModel () {
  return this.model;
};