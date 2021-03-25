const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

// adminUser
const uri =
	'mongodb+srv://adminUser:adminUser@cluster0.2ctf2.mongodb.net/organicdb?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// Show Data Ui
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

client.connect((err) => {
	const productCollection = client.db('organicdb').collection('products');
	app.get('/products', (req, res) => {
		console.log(req);
		productCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});
	// Single Product Update function

	app.get('/product/:id', (req, res) => {
		productCollection
			.find({ _id: ObjectId(req.params.id) })
			.toArray((err, documents) => {
				res.send(documents[0]);
			});
	});

	// Send Product Database And Show Ui
	app.post('/addProduct', (req, res) => {
		const product = req.body;
		productCollection.insertOne(product).then((result) => {
			console.log('Product Added');
			res.redirect('/');
		});
	});

	// Update Path
	app.patch('/update/:id', (req, res) => {
		productCollection
			.updateOne(
				{ _id: ObjectId(req.params.id) },
				{
					$set: { price: req.body.price, quantity: req.body.quantity },
				}
			)
			.then((result) => {
				res.send(result.modifiedCount > 0);
			});
	});

	//Delete Path
	app.delete('/delete/:id', (req, res) => {
		productCollection
			.deleteOne({ _id: ObjectId(req.params.id) })
			.then((result) => {
				res.send(result.deletedCount > 0);
			});
	});
});

app.listen(4000);
