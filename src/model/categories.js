const db = require("./lib.js");
function categories() {
  this.getCategories = function() {
    return db.executeWithParam("select * from categories;");
  };
  this.insertCategory = function(requestBody) {
    const { category_name, category_details } = requestBody;
    return db.executeWithParam(
      "insert into categories (category_name,category_details) values ($1,$2) returning *;",
      [category_name, category_details]
    );
  };
}
module.exports = new categories();
