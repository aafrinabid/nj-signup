var express = require('express');
var path = require('path'); 
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var crypto = require('crypto');
const { MongoClient } = require("mongodb");

var app = express();
var new_db = "mongodb://localhost:27017/game";

MongoClient.connect(new_db, function(err, client) {
    const db=client.db
  if (err) throw err;
  console.log("Database created!");
});

var getHash = ( pass , phone ) => {

    var hmac = crypto.createHmac('sha512', phone);

    //passing the data to be hashed
    data = hmac.update(pass);
    //Creating the hmac in the required format
    gen_hmac= data.digest('hex');
    //Printing the output on the console
    console.log("hmac : " + gen_hmac);
    return gen_hmac;
}




//routes

app.get('/',function(req,res){
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/public/index.html');
}).listen(3000);

console.log("Server listening at : 3000");
app.use('/public', express.static(__dirname + '/public'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));



app.post('/sign_up' ,async function(req,res){
	var name = req.body.name;
	var email= req.body.email;
	var pass = req.body.password;
	var phone = req.body.phone;
	var password = getHash( pass , phone ); 				


	var data = {
		"name":name,
		"email":email,
		"password": password, 
		"phone" : phone
	}

    // await client.connect();
    // await client.db("admin").command({ ping: 1 });
    // console.log("Connected successfully to server");
	MongoClient.connect(new_db,function(error , client){
        const db=client.db('game')
		if (error){
			throw error;
		}
		console.log("connected to database successfully");
		//CREATING A COLLECTION IN MONGODB USING NODE.JS
        db.collection('details').insertOne(data, (err , collection) => {
			if(err) throw err;
			console.log("Record inserted successfully");
			console.log(collection);
		});
	});

	console.log("DATA is " + JSON.stringify(data) );
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/public/success.html');  

});

