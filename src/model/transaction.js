const db = require("./lib.js");

function transactions() {
  this.getTransaction = function() {
    return db.execute(
      "select transaction_id,to_char(transaction_date, 'DD Mon YYYY - HH:MI') as transaction_date,transaction_price,staff_id from transaction;"
    );
  };

  this.createTransaction = async function(requestBody) {
    const { cart, transaction_price, staff } = requestBody;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const transaction = await db.executeWithParam(
        "insert into transaction (transaction_price,staff_id) values ($1,$2) returning transaction_id,to_char(transaction_date, 'DD Mon YYYY - HH:MI') as transaction_date,transaction_price,staff_id;",
        [transaction_price, staff.staff_id]
      );
      const productsOfTransaction = cart.reduce(
        (productInTransaction, cartItem) => {
          return productInTransaction.concat([
            transaction.rows[0].transaction_id,
            cartItem.product.product_id,
            cartItem.quantity
          ]);
        },
        []
      );
      const productsInTransaction = await db.executeWithParam(
        `insert into products_in_transaction (transaction_id,product_id,quantity) values ${db.createPlaceholder(
          cart.length,
          3
        )} returning *;`,
        productsOfTransaction
      );
      await client.query("COMMIT");
      return {
        transaction: transaction.rows[0],
        productsInTransaction: productsInTransaction.rows
      };
    } catch (e) {
      await client.query("ROLLBACK");
      Promise.reject(e);
    } finally {
      client.release();
    }
  };
}

module.exports = new transactions();
