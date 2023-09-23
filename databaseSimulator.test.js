const DatabaseSimulator = require('./databaseSimulator');

test('Basic Set & Get',()=>{
  const db = new DatabaseSimulator();
  db.set('TestKey',1234);
  
  expect(db.get('TestKey')).toBe(1234);
});

test('No Transaction Errors',()=>{
  const db = new DatabaseSimulator();
  expect(()=>{db.commit()}).toThrow('No Current Transaction');
  expect(()=>{db.rollback()}).toThrow('No Current Transaction');
  expect(()=>{db.get('somekey')}).toThrow('Key Not Found');
});

test('Create New Transaction, then Set & Get',()=>{
  const db = new DatabaseSimulator();
  db.newTransaction();
  db.set('TestKey',1234);
  expect(db.get('TestKey')).toBe(1234);
});


test('Set Base Key, then Create New Transaction, then Set & Get',()=>{
  const db = new DatabaseSimulator();
  db.set('TestKey',1234);
  db.newTransaction();
  db.set('TestKey2',2345);
  expect(db.get('TestKey')).toBe(1234);
  expect(db.get('TestKey2')).toBe(2345);
});

test('Test Commit',()=>{
  const db = new DatabaseSimulator();
  db.set('TestKey',1234);
  db.newTransaction();
  db.set('TestKey2',2345);
  db.commit();
  expect(db.get('TestKey')).toBe(1234);
  expect(db.get('TestKey2')).toBe(2345);
  expect(()=>{db.commit()}).toThrow('No Current Transaction');
});

test('Test Rollback',()=>{
  const db = new DatabaseSimulator();
  db.set('TestKey',1234);
  db.set('TestKey2',2345);
  db.newTransaction();
  db.set('TestKey2',3456);
  expect(db.get('TestKey')).toBe(1234);
  expect(db.get('TestKey2')).toBe(3456);
  db.rollback();
  expect(db.get('TestKey')).toBe(1234);
  expect(db.get('TestKey2')).toBe(2345);
  expect(()=>{db.commit()}).toThrow('No Current Transaction');
});

test('Base Count',()=>{
  const db = new DatabaseSimulator();
  db.set('TestKey',1234);
  expect(db.count()).toBe(1);
});

test('Transactional Count',()=>{
  const db = new DatabaseSimulator();
  db.set('TestKey',1234);
  db.newTransaction();
  db.set('TestKey2',2345);
  expect(db.count()).toBe(2);
});


function addJohnHammond(db){
  db.set('John Hammond','Richard Attenborough');
  db.set('John','Richard');
}


test('Test Series',()=>{
  const db = new DatabaseSimulator();
  db.set('John Hammond','Richard Attenborough');
  expect(db.get('John Hammond')).toBe('Richard Attenborough');
  expect(db.count()).toBe(1);
  expect(()=>{db.commit()}).toThrow('No Current Transaction');

  db.newTransaction();
  db.set('Alan Grant','Sam Niell');
  db.set('Ellie Sattler','Laura Dern');
  expect(db.get('John Hammond')).toBe('Richard Attenborough');
  expect(db.get('Alan Grant')).toBe('Sam Niell');
  expect(db.get('Ellie Sattler')).toBe('Laura Dern');
  expect(db.count()).toBe(3);

  db.newTransaction();
  db.set('Sarah Harding','Julianne Moore');
  db.set('Nick Van Owen','Vince Vauhgn');
  expect(db.get('John Hammond')).toBe('Richard Attenborough');
  expect(db.get('Alan Grant')).toBe('Sam Niell');
  expect(db.get('Ellie Sattler')).toBe('Laura Dern');
  expect(db.get('Sarah Harding')).toBe('Julianne Moore');
  expect(db.get('Nick Van Owen')).toBe('Vince Vauhgn');
  expect(db.count()).toBe(5);

  db.newTransaction();
  db.set('Nick Van Owen','Vince Vaughn');
  expect(db.get('Nick Van Owen')).toBe('Vince Vaughn');
  db.commit()
  expect(db.get('Nick Van Owen')).toBe('Vince Vaughn');

  db.newTransaction();
  db.set('Owen Grady','Chris');
  expect(db.get('Owen Grady')).toBe('Chris');
  db.rollback();
  expect(()=>{db.get('Owen Grady')}).toThrow('Key Not Found');
  expect(db.count()).toBe(5);

  db.newTransaction();
  db.set('Owen Grady','Chris Pratt');
  expect(db.get('Owen Grady')).toBe('Chris Pratt');
  db.commit();
  expect(db.get('Owen Grady')).toBe('Chris Pratt');
  expect(db.count()).toBe(6);

  
  db.commit();
  db.commit();
  expect(()=>{db.commit()}).toThrow('No Current Transaction');
  expect(db.count()).toBe(6);
});