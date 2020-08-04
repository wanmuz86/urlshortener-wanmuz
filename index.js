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

// 1) Error handling (as per recommendation use dns core module) (KIV - look for the answer)
router.post('/shorturl/new',(req,res)=>{
	// Query (findOne, if result is there return the ID else add new)
	Url.findOne({longUrl:req.body.full_url}, (err,doc)=>{
		console.log(doc)
		if(doc){
			res.json({longUrl:doc.longUrl, shortenUrl:doc.shortenUrl})
		}
		else {
			Url.count({}, (err,count)=>{
				let number = count+1
				let newUrl = new Url({
					longUrl:req.body.full_url,
					shortenUrl:number
				});
				newUrl.save().then(doc=>{
					console.log(doc)
					res.json({longUrl:doc.longUrl, shortenUrl:doc.shortenUrl})
				})
				.catch(err=>{
					console.log(err)
					res.json({message:"Error"})
				})
			})
		}
	})
})


router.get('/shorturl/:id',(req,res)=>{

	Url.findOne({shortenUrl:req.params.id})
	.then(doc=>{
		console.log(doc)
		res.redirect('https://'+doc.longUrl);
	})
	.catch(err =>{
		console.log(err);
		res.json({message:"Error, url not found"})
	})
	
})
app.use('/api',router);

app.listen(port);

console.log('Magic happens on port '+port)
