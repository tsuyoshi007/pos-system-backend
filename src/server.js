require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const productsModel = require("./model/products");
const transactionModel = require("./model/transaction");
const categoriesModel = require("./model/categories");

const app = express();

const whitelist = ["http://localhost:3001"];
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(passport.initialize());
app.use(passport.session());

app.get("/success", (req, res) =>
  res.send("Welcome " + req.query.username + "!!")
);
app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    console.log(username);
    if (username != "vikran") {
      return done(null, false);
    }
    if (password != "123") {
      return done(null, false);
    }
    return done(null, { id: "1", username: "vikran", password: "123" });
  })
);

// app.use(express.static(__dirname + "/public"));

// app.get("/", function(req, res) {
//   res.sendFile(__dirname + "/public/index.html");
// });

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/error" }),
  function(req, res) {
    console.log("Authenticated");
  }
);

/**
 * /api/initial
 *
 * @returns {Object} { products: Array,categories: Array,transaction: Array }
 */
app.get("/api/initial", async (req, res) => {
  const products = await productsModel.getProducts().catch(err => {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err
    });
  });
  const categories = await categoriesModel.getCategories().catch(err => {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err
    });
  });
  const transaction = await transactionModel.getTransaction().catch(err => {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err
    });
  });
  const responseData = {
    products: products.rows,
    categories: categories.rows,
    transaction: transaction.rows
  };
  res.status(200).json(responseData);
});

/**
 * /api/products
 *
 * @returns {Array} products
 */
app.get("/api/products", async (req, res) => {
  await productsModel
    .getProducts()
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err
      });
    });
});

/**
 * /api/products
 *
 * @param {String} product_name
 * @param {String} product_details
 * @param {String} product_wholesale_price
 * @param {String} product_retail_price
 * @param {String} product_quantity
 * @param {String} category_id
 *
 * @returns {Array} insertedProduct
 */
app.post("/api/products", (req, res) => {
  productsModel
    .insertProduct(req.body)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err
      });
    });
});

/**
 * /api/products
 *
 * @param {String} product_id
 * @param {String} product_name
 * @param {String} product_details
 * @param {String} product_wholesale_price
 * @param {String} product_retail_price
 * @param {String} product_quantity
 * @param {String} category_id
 *
 * @returns {Array} updatedProduct
 */
app.put("/api/products", (req, res) => {
  productsModel
    .updateProduct(req.body)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err
      });
    });
});

/**
 * /api/products
 *
 * @param {String} product_id
 *
 * @returns {Array} deletedProduct
 */
app.delete("/api/products", (req, res) => {
  productsModel
    .deleteProduct(req.body)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err
      });
    });
});

/**
 * /api/categories
 *
 * @returns {Array} categories
 */
app.get("/api/categories", (req, res) => {
  categoriesModel
    .insertCategory(req.body)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err
      });
    });
});

/**
 * /api/categories
 *
 * @param {String} category_name
 * @param {String} category_details
 *
 * @returns {Array} insertedCategory
 */
app.post("/api/categories", (req, res) => {
  transactionModel
    .createTransaction(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err
      });
    });
});

/**
 * /api/transaction
 *
 * @param {Array} cart array of product
 * @param {String} transaction_price total price of transaction
 * @param {String} staff object of staff
 * @returns {Object} {transaction: Array,productsInTransaction: Array}
 */
app.post("/api/transaction", (req, res) => {
  transactionModel
    .createTransaction(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: err });
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`);
});
