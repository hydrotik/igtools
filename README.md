This is a very basic and dumbed down tool designed to simply accept the html of your followers popup which you can paste into and store as a flat file in JSON format. I couldn't get instabot working with 2FA. It then allows you to compare two files and determine if anyone has unfollowed. It does not account for follows yet, so it requires a certain amount of understanding of your followers as a means to track. Obvious solution would be to manage all of this in a mongo db and flag accounts to track increments and decrements of followers.

TODO:
Finish Mongo/Mongoose to management and tracking of followers
Get AdminBro working

Terminal 1
```
mongod --dbpath /Users/dadams/Desktop/Code/igtools/data
```

Terminal 2
```
npm start
```



Mongo CLI
```
show dbs

use igtools

show collections

db.followers.find({})

db.collection.updateMany()

db.followers.updateMany( {},{ $set: { active: true} })

db.followers.updateMany( {username: "josefinehoemke"},{ $set: { active: false} })

db.followers.updateMany( {},{ $unset: {img:"" } })

db.followers.find( {username:"josefinehoemke"} )
db.followers.find( {active:false}, {username:1} )

db.followers.updateOne( {username: "josefinehoemke"},{ $set: { active: false, dateUnfollowed: new Date()}})

db.followers.updateMany( {active: false},{ $set: { active: true}, $unset: {dateUnfollowed: ""}})

db.followers.save({"username": "user_name", "fullname": "Joe", "href": "/user_name/", active:false, updated: new Date(), dateFollowed: new Date(), dateUnfollowed: new Date()})


```
