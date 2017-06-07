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
  req.checkBody('stock_plu', 'PLU is required').notEmpty();
  console.log('post req.body: ', req.body)
  // Set validation errors (express method)
  //const uniqueErrors = req.stockSchema();
  const errors = req.validationErrors();
  // Check for PLU errors
  //if (uniqueErrors) { console.log('Unique PLU errors: ', uniqueErrors)

    // res.render('index', {
    //   uniqueErrors: uniqueErrors,
    // });

  // Check for validation errors
  if (errors) { 
    console.log('errors: ', errors)
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
      
      res.render('saleStock', {
        title: 'Stocks',
        stock: stocks,
        lastitem: res.locals.lastitem
      })
    })
});

router.get('/stock/:id/sell', (req,res) => {
  Stock.findOne({ _id: req.params.id})
    .then(stock => {
      res.render('saleStock', {stock: stock})
    })
});

//router.post('/saleStock', (req, res) => {
  // router.post('/stock/:id/sell', (req, res) => {
  // console.log('saleStock req.body: ', req.body)
  //  Stock.findOne({ plu: req.body.stock_plu}//, {
router.post('/stock/:id/sale', (req, res) => {
  console.log('saleStock req.body: ', req.body)
   Stock.findOneAndUpdate({ _id: req.params.id }, req.body, {
     new: true // returns new sale
  })
  .then(stock => {
     console.log("before", stock);
     stock.qtyOnHand -= req.body.qty_sold;
     stock.checkoutValue = req.body.qty_sold * req.body.sellprice
     stock.save()
        .then( (stock) => {
          console.log("saved stock", stock);
          //res.render('checkout', {stock: stock})
          res.redirect('/')
        });
  });
});


router.get('/stock/:id/receipt', (req,res) => {
  Stock.findOne({ _id: req.params.id})
    .then(stock => {
      res.render('receiptStock', {stock: stock})
    })
});

router.post('/stock/:id/receipt', (req, res) => {
  console.log('saleStock req.body: ', req.body)
   Stock.findOneAndUpdate({ _id: req.params.id }, req.body, {
     new: true // returns new sale
  })
  .then(stock => {
     console.log("before", stock);
     stock.qtyOnHand += req.body.qty_sold;
     stock.checkoutValue = req.body.qty_sold * req.body.sellprice
     stock.save()
        .then( (stock) => {
          console.log("saved stock", stock);
          //res.render('checkout', {stock: stock})
          res.redirect('/')
        });
  });
});

router.get('/stock/:id/take', (req,res) => {
  Stock.findOne({ _id: req.params.id})
    .then(stock => {
      res.render('saleStock', {stock: stock})
    })
});

router.post('/stock/:id/take', (req, res) => {
  console.log('saleStock req.body: ', req.body)
   Stock.findOneAndUpdate({ _id: req.params.id }, req.body, {
     new: true // returns new sale
  })
  .then(stock => {
     console.log("before", stock);
     stock.qtyOnHand -= req.body.qty_sold;
     stock.checkoutValue = req.body.qty_sold * req.body.sellprice
     stock.save()
        .then( (stock) => {
          console.log("saved stock", stock);
          //res.render('checkout', {stock: stock})
          res.redirect('/')
        });
  });
});
module.exports = router;
