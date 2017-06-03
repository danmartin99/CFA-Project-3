const express = require('express');
const router = express.Router();
const Stock = require('../models/stock')

function ensureAuthenticated(req, res, next) {
  // Express authentication method
  if (req.isAuthenticated()) {
    // Keep going
    next();
  } else {
    // If not authenticated, redirect to login page
    // req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}

// Get Homepage
// Ensure user is authenticated before rendering index
router.get('/', ensureAuthenticated, (req, res) => {
  Stock.find()
    .then(stocks => {
      res.render('index', { 
          title: 'Stocks',
            stock: stocks,
            lastitem: res.locals.lastitem 
       })     
    })
});


// /* GET home page. */
// router.getIndex('/',  (req, res) => {
//   res.redirect("/stock");
// });

router.get('/stock', (req,res) => {
  Stock.find()
    .then(stocks => {
      res.render('index', {
        title: 'Stocks',
        stock: stocks,
        lastitem: res.locals.lastitem
      })
    })
});

router.post('/stock', (req, res) => {
  console.log('req.body: ', req.body)
  const name = req.body.stock_name;
  const plu = req.body.stock_plu;
  const costprice = req.body.stock_costprice;
  const sellprice = req.body.stock_sellprice;
  const category = req.body.stock_category;
  const qtyOnHand = req.body.stock_qtyOnHand;
  const reorderLevel = req.body.stock_reorderLevel

  // Validate values from the form
  req.checkBody('stock_name', 'Name is required').notEmpty();

  // Set validation errors (express method)
  const errors = req.validationErrors();
// Check for validation errors
  if (errors) {
    res.render('index', {
      errors: errors,
    });


  } else {
  let stock = new Stock();
  stock.name = name;
  stock.plu = plu;
  stock.costprice = costprice;
  stock.sellprice = sellprice;
  stock.category = category;
  stock.qtyOnHand =  qtyOnHand;
  stock.reorderLevel = reorderLevel;
  stock.save()
    .then(() => {
      res.redirect('/')
    })
    }
});

router.get('/stock/:id/edit', (req,res) => {
  Stock.findOne({ _id: req.params.id})
    .then(stock => {
      res.render('editStock', {stock: stock})
    })
});

router.post('/stock/:id/edit', (req, res) => {
  console.log('edit req.body: ', req.body)
  Stock.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true // returns new stock
  })
  .then(stock => {
    res.redirect('/')
  });
});


router.get('/stock/:id/delete', function(req, res){
  Stock.findByIdAndRemove({_id: req.params.id},
     function(err){
    if(err) res.json(err);
    else    res.redirect('/');
  });
});
 
router.get('/saleStock', (req,res) => {
  Stock.find()
    .then(stocks => {
      res.render('index', {
        title: 'Stocks',
        stock: stocks,
        lastitem: res.locals.lastitem
      })
    })
});

module.exports = router;
