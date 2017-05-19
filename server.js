var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishList');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/product', function(request, response) {
  var product = new Product();
  product.title = request.body.title;
  product.price = request.body.price;
  product.save(function(err, savedProduct) {
    if (err) {
      response.status(500).send({error:"Could Not Save Product"});
    } else  {
      response.send(savedProduct);
    }
  });
});

app.get('/product', function(request, response) {
  Product.find({}, function(err, products) {
    if (err) {
      response.status(500).send({error:"Could Not Fetch Products"});
    } else  {
      response.send(products);
    }
  });
});




app.get('/wishList', function(request, response) {
  WishList.find({}).populate({path:'products', model: 'Product'}).exec(function(err, wishLists) {
    if (err) {
      response.status(500).send({error:"Could Not Fetch Wish Lists"});
    } else  {
      response.send(wishLists);
    }
  });
});
  
  
  

app.post('/wishList', function(request, response) {
  var wishList = new WishList();
  wishList.title = request.body.title;
  
  wishList.save(function(err, newWishList) {
    if (err) {
      response.status(500).send({error:"Could Not Create a Wish List"});
    } else  {
      response.send(newWishList);
    }
  });
});


app.put('/wishList/product/add', function(request, response) {
  Product.findOne({_id: request.body.productId}, function(err, product) {
    if (err) {
      response.status(500).send({error: " Could Not Add To The Wish List"});
    } else {
      WishList.update({_id:request.body.wishListId}, {$addToSet:{products: product._id}}, function(err, wishList) {
        if (err) {
          response.status(500).send({error: " Successfully added to the Wish List"});
        } else {
          response.send(wishList);
        }
      });
    }
  });
});


app.listen(3000, function() {
  console.log("Swag Shop Running on port 3000...");
});




