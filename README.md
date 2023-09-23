# db-simulator-class
Class for simulating a database store with nested transaction support.

This is my my answer to a prompt that I encountered on a coding test.

## Usage
```js
const DatabaseSimulator = require('./databaseSimulator.js');
const db = new DatabaseSimulator();

// Store Value
db.set('MyKey','MyValue');

// Get Value
db.get('MyKey'); // 'MyValue'

// Start Transaction and Commit
db.newTransaction();
db.set('AnotherKey','AnotherValue');
db.get('AnotherKey'); // 'AnotherValue'
db.commit();
db.get('AnotherKey'); // 'AnotherValue'


// Start Transaction and Rollback
db.newTransaction();
db.set('YetAnotherKey','YetAnotherValue');
db.get('YetAnotherKey'); // 'YetAnotherValue'
db.rollback();
db.get('YetAnotherKey'); // Not Found Error
```
