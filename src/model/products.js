const db = require("./lib.js");
function products() {
  this.getProducts = function() {
    return db.execute("select * from products;");
  };

  this.insertProduct = function(requestBody) {
    const {
      product_name,
      product_details,
      product_wholesale_price,
      product_retail_price,
      product_quantity,
      category_id
    } = requestBody;
    return db.executeWithParam(
      "insert into products (product_name,product_details,product_wholesale_price,product_retail_price,product_quantity,category_id) values ($1,$2,$3,$4,$5,$6) returning *;",
      [
        product_name,
        product_details,
        product_wholesale_price,
        product_retail_price,
        product_quantity,
        category_id
      ]
    );
  };
  this.updateProduct = function(requestBody) {
    const {
      product_id,
      product_name,
      product_details,
      product_wholesale_price,
      product_retail_price,
      product_quantity,
      category_id
    } = requestBody;
    return db.executeWithParam(
      "update products set product_name=$2,product_details=$3,product_wholesale_price=$4,product_retail_price=$5,product_quantity=$6,category_id=$7 where product_id=$1 returning *;",
      [
        product_id,
        product_name,
        product_details,
        product_wholesale_price,
        product_retail_price,
        product_quantity,
        category_id
      ]
    );
  };
  this.deleteProduct = function(requestBody) {
    const { product_id } = requestBody;
    return db.executeWithParam(
      "delete from products where product_id = $1 returning *;",
      [product_id]
    );
  };
}

module.exports = new products();
