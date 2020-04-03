'use strict';

const fs = require('fs');
const Path = require('path');
const Pckge = require('../package.json');
const Confg = require('../config/manifest.json');
const htmlToJson = require("html-to-json");
const moment = require('moment');
const mock = require('../config/mock_follower.js');
const mongoose = require('mongoose');
const Controller = require('../controller/followers.js');

exports.plugin = {
    name: 'Followers API',
    version: '1.0.0',
    register: async function(server, options) {


    	const cf = new Controller();
        
        server.route({
        	config: {
		        payload: {
		            parse: true,
		            maxBytes: Number.MAX_SAFE_INTEGER
		        }
		    },
            method: 'POST',
            path: '/api/{action}',
            handler: function(request, h) {

                if(request.params.action == "parse"){

	                var content = (!request.payload.code || request.payload.code == undefined || request.payload.code == "") ? mock : request.payload.code;

		                return htmlToJson.parse(content, {
		                    user: htmlToJson.createMethod(['.wo9IH', {
		                        'username': function($dx) {
		                            return $dx.find('.FPmhX').text().trim();
		                        },
		                        'fullname': function($dx) {
		                            return $dx.find('.wFPL8').text().trim();
		                        },
		                        'href': function($dx) {
		                            return $dx.find('.FPmhX').attr('href');
		                        }
		                    }])
		                }).then(function(result) {
		                    if(result.user && Array.isArray(result.user)) console.log(result.user.length);


		                    return new Promise(function(resolve, reject) {
						            fs.writeFile('./data/json/' + moment().format("M-D-YYYY-h-mm-ss") + '.json', JSON.stringify(result, null, 4), function(err) {
						               if (err) console.log(err);
						               else  resolve(cf.checkAll(result.user)); //resolve(cf.putAll(result.user));
						            });
						    });
		                    
		                })
	            }


	            if(request.params.action == "compare"){
	            	var bucket = [];
	            	return new Promise((resolve, reject) => {
		            	var promises = ['./data/json/'+request.payload.file1+'.json', './data/json/'+request.payload.file2+'.json'].map(function(_path){
						    return new Promise(function(_path, resolve, reject){
						        fs.readFile(_path, 'utf8', function(err, data){
						            if(err){
						               console.log(err);
						               resolve("");
						            }else{
						               	resolve(data);
						            }
						        });
						    }.bind(this, _path)).then(function(data){
						    	bucket.push(JSON.parse(data));
							}).finally(function(){			
								if(bucket.length == 2){

									//TODO Account for conditions where:
									// Follow happens
									// Follow and Unfollow happens

									// If file is in second position that is before first
									// It will think it's a follow
									// Must limit second file to be later than first.

									console.log("File 1:");
									console.log(bucket[0].user.length);
									console.log("File 2:");
									console.log(bucket[1].user.length);

									if(bucket[0].user.length < bucket[1].user.length){
										console.log("Followed");
									}else if(bucket[0].user.length > bucket[1].user.length){
										console.log("Unfollowed");
									}else{
										console.log("No Change");
									}


									var result = [bucket[0].user, bucket[1].user].sort((a,b)=> b.length - a.length).reduce((a,b)=>a.filter(o => !b.some(v => v.username === o.username)));
									resolve(result);
								}

							});
						});

					});

	            }
	            
            }
        });


		server.route({
            method: 'GET',
            path: '/api/{action}',
            handler: function(request, h) {

            	if(request.params.action == "files"){

					function promiseAllP(items, block) {
					    var promises = [];
					    items.forEach(function(item,index) {
					        promises.push( function(item,i) {
					            return new Promise(function(resolve, reject) {
					                return block.apply(this,[item,index,resolve,reject]);
					            });
					        }(item,index))
					    });
					    return Promise.all(promises);
					}

					function readFiles(dirname) {
					    return new Promise((resolve, reject) => {
					        fs.readdir(dirname, function(err, filenames) {
					            if (err) return reject(err);
					            promiseAllP(filenames,
					            (filename,index,resolve,reject) =>  {
					                fs.readFile(Path.resolve(dirname, filename), 'utf-8', function(err, content) {
					                    if (err) return reject(err);
					                    return resolve({value: filename});
					                });
					            })
					            .then(results => {
					                return resolve(results);
					            })
					            .catch(error => {
					                return reject(error);
					            });
					        });
					  });
					}

					return new Promise((resolve, reject) => {
		            	var f = [];
		            	var p = readFiles('./data/json/')
						.then(files => {
						    files.forEach( (item, index) => {
						        f.push(item);
						    });
						})
						.catch( error => {
						    console.log( error );
						}).finally(function(){
							return resolve(f);
						});
					});
	            }

	            if(request.params.action == "all"){
	            	return cf.getAll();
		        }
            }
        });
    }
};



