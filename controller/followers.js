'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Followers = {};
const htmlToJson = require("html-to-json");
const db = require('../config/db.json');
const _ = require('lodash');

const FollowerModel = require('../model/followers.js');

function FollowersController () {
    this.FollowerModel = new FollowerModel().getModel();
}

FollowersController.prototype = {
  getAll,
  putAll,
  checkAll
};

module.exports = FollowersController;


// 
function getAll (request, reply) {

    let query = this.FollowerModel.find(null, null);
    let promise = query.exec();


  return promise;
};

function checkAll(followers) {
    let active = _.unionBy(followers, 'username').map(a => a.username);
    const query = { username: { $nin: active } };
    const update = { 
        $set: { active:false, dateUnfollowed: new Date(), lastUpdated: new Date()}
    };
    const options = { "upsert": false }


    let activeCount = this.FollowerModel.count({active:true});

    console.log(activeCount);
    
    return this.FollowerModel.updateMany(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        console.log(`Successfully matched ${matchedCount} and modified ${modifiedCount} items.`)
      }).then(result => {
        return this.FollowerModel.find({active:false}, null);
      })
      .catch(err => console.error(`Failed to update items: ${err}`))

      /*
      { 
        "_id" : ObjectId("5e3320a1053022ef02862412"), 
        "username" : "josefinehoemke", 
        "fullname" : "Fine", 
        "href" : "/josefinehoemke/", 
        "active" : false, 
        "dateFollowed" : ISODate("2020-01-30T19:17:42.789Z"), 
        "updated" : ISODate("2020-01-30T19:17:58.518Z"), 
        "dateUnfollowed" : ISODate("2020-01-31T19:52:38.567Z") 
    }
    */

      /*
      // Aggregation Pipeline
      // { a: "Hello", b: "World" }
        // { a: "Olleh", b: "Dlrow" }
        db.collection.update(
          {},
          [ { $set: { active: { $eq: [ "$a", "Hello" ] } } } ],
          { multi: true }
        )
        // { a: "Hello", b: "World", active: true  }
        // { a: "Olleh", b: "Dlrow", active: false }
    */
};

function putAll (payload) {


    

    // const query = {};
    // const update = { $set: { active: true, dateFollowed: new Date(), updated: new Date()} };
    // const options = { "upsert": true }
    
    // return this.FollowerModel.updateMany(query, update, options)
    //   .then(result => {
    //     const { matchedCount, modifiedCount } = result;
    //     console.log(`Successfully matched ${matchedCount} and modified ${modifiedCount} items.`)
    //   }).then(result => {
    //     return this.FollowerModel.find({active:true}, null);
    //   })
    //   .catch(err => console.error(`Failed to update items: ${err}`))
};




// If User is in scrape, but not in DB, then user is Follow
function checkForFollow(){

}

// If User is in DB but not in scrape, then user is Unfollow
function checkForUnfollow(){
    
}

// Return Object of all users in scrape
function getScrape(){
    
}

// Return Array of Strings of all users in scrape
function getScrapeUsernames(){
    
}

// Compare current scrape with contents of DB
function compareScrape(){
    
}





/*

// Conditional Promise chaining

function myPromiseFunction() {
    //Change the resolved value to take a different path
    return Promise.resolve(true);
}

function conditionalChaining(value) {
    if (value) {
        //do something
        return doSomething().then(doSomethingMore).then(doEvenSomethingMore);
    } else {
        //do something else
        return doSomeOtherThing().then(doSomethingMore).then(doEvenSomethingMore);
    }
}

function doSomething() {
    console.log("Inside doSomething function");
    return Promise.resolve("This message comes from doSomeThing function");
}

function doSomeOtherThing() {
    console.log("Inside doSomeOtherthing function");
    return Promise.resolve("This message comes from doSomeOtherThing function");
}

function doSomethingMore(message) {
    console.log(message);
    return Promise.resolve("Leaving doSomethingMore");
}

function doEvenSomethingMore(message) {
    console.log("Inside doEvenSomethingMore function");
    return Promise.resolve();
}

myPromiseFunction().then(conditionalChaining).then(function () {
    console.log("All done!");
}).
catch (function (e) {

});

*/