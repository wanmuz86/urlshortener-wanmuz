const express = require('express')
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
let Url = require('./url')
mongoose.connect("mongodb+srv://apiuser:abcd1234@cluster0.agh0w.mongodb.net/rest-api?retryWrites=true&w=majority")
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());


var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', (req,res)=>{
	res.json({message:"hooray welcome to my API"});
})

/// 1) SHould not hardcode to 1 -> Need to manage the shortenUrl Id
// 2) google.com -> 1, facebook.com -> 2, anak2u.com.my - > 3, google.com ->1, 
//commonroom.com.my -> 4, facebook.com -> 2, utem.edu.my -> 5
//

// 3) Error handling (as per recommendation use dns core module)
router.post('/shorturl/new',(req,res)=>{
	let newUrl = new Url({
		longUrl:req.body.full_url,
		shortenUrl:1
	});
	newUrl.save().then(doc=>{
		console.log(doc)
		res.json({message:"Route created"})
	})
	.catch(err=>{
		console.log(err)
		res.json({message:"Error"})
	})
	
})

//4) WHen it is retrieved, add redirection to the saved url (Express redirection)
// 5) If the :id given does not exist -> error handling
router.get('/shorturl/:id',(req,res)=>{
	// find() will return an Array -> If we are expecting an Array , multiple Results
	//findOne() will return an Object -> if we are expevtion One result
	// findById()
	Url.findOne({shortenUrl:req.params.id})
	.then(doc=>{
		console.log(doc)
		res.json({longUrl:doc.longUrl})
	})
	.catch(err =>{
		console.log(err);
		res.json({message:"Error"})
	})
	
})
app.use('/api',router);

app.listen(port);

console.log('Magic happens on port '+port)
