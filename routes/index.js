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
      res.render('index2', {
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
    new: true // returns new ingredient
  })
  .then(stock => {
    res.redirect('/stock')
  });
});


module.exports = router;
