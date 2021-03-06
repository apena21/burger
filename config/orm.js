// Import MySQL connection.
const connection = require("../config/connection.js");

//create the methods that will execute the necessary MySQL commands in the controllers. 
//These are the methods you will need to use in order to retrieve and store data in your database.
//selectAll()
//insertOne()
//updateOne()
/*
const tableName = "burger";
const sql = {
  create  : `INSERT INTO ${burger} (text) VALUES (?)`,
  read    : `SELECT * FROM ${burger}`,
  update  : `UPDATE ${burger} SET text=?, complete=? WHERE id=?`,
  delete  : `DELETE FROM ${burger} WHERE id = ?`
};

const cb ={
 // Callback (cb) to ensure data is returned after the query is complete.
 addTodo: (todo, cb) => 
 cnn.query(sql.create, [todo.text], cb),
getTodos: cb => 
 cnn.query(sql.read,cb),
editTodo: (todo, cb) => 
 cnn.query(sql.update, [todo.text,todo.complete === 'false' ? 0 : 1,todo.id], cb),
deleteTodo: (id, cb) => 
 cnn.query(sql.delete, [id], cb)
};

// Export the orm object for the model (burger.js).
module.exports = orm;
*/

// Helper function for SQL syntax.
// Let's say we want to pass 3 values into the mySQL query.
// In order to write the query, we need 3 question marks.
// The above helper function loops through and creates an array of question marks - ["?", "?", "?"] - and turns it into a string.
// ["?", "?", "?"].toString() => "?,?,?";
function printQuestionMarks(num) {
  let arr = [];

  for (var i = 0; i < num; i++) {
    arr.push("?");
  }

  return arr.toString();
}

// Helper function to convert object key/value pairs to SQL syntax
function objToSql(ob) {
  let arr = [];

  // loop through the keys and push the key/value as a string int arr
  for (let key in ob) {
    let value = ob[key];
    // check to skip hidden properties
    if (Object.hasOwnProperty.call(ob, key)) {
      // if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
      if (typeof value === "string" && value.indexOf(" ") >= 0) {
        value = "'" + value + "'";
      }
      // e.g. {name: 'Big Burger'} => ["name='Big Burger'"]
      // e.g. {devour: true} => ["devour=true"]
      arr.push(key + "=" + value);
    }
  }

  // translate array of strings to a single comma-separated string
  return arr.toString();
}

// Object for all our SQL statement functions.
const orm = {
  all: function(tableInput, cb) {
    const queryString = "SELECT * FROM " + tableInput + ";";
    connection.query(queryString, function(err, result) {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },
  create: function(table, cols, vals, cb) {
    let queryString = "INSERT INTO " + table;

    queryString += " (";
    queryString += cols.toString();
    queryString += ") ";
    queryString += "VALUES (";
    queryString += printQuestionMarks(vals.length);
    queryString += ") ";

    console.log(queryString);

    connection.query(queryString, vals, function(err, result) {
      if (err) {
        throw err;
      }

      cb(result);
    });
  },
  // An example of objColVals would be {name: Bacon Burger, Devour It: true}
  update: function(table, objColVals, condition, cb) {
    let queryString = "UPDATE " + table;

    queryString += " SET ";
    queryString += objToSql(objColVals);
    queryString += " WHERE ";
    queryString += condition;

    console.log(queryString);
    connection.query(queryString, function(err, result) {
      if (err) {
        throw err;
      }

      cb(result);
    });
  }
};

// Export the orm object for the model (burger.js).
module.exports = orm;