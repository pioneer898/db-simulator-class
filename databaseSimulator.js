class DatabaseSimulator{
  data = {};
  transactions = [];
  constructor(data={}){
    this.data = data;
  }
  set(key,val){
    this.setTarget()[key] = val;
  }
  get(key){
    for(let d=this.transactions.length-1;d>=0;d--){
      if(typeof(this.transactions[d][key]) !== 'undefined'){
        return this.transactions[d][key];
      }
    }
    if(typeof(this.data[key]) !== 'undefined'){
      return this.data[key];
    }
    throw new Error('Key Not Found');
  }
  newTransaction(){
    this.transactions.push(Object.assign({},this.data));
  }
  count(){
    let count = 0;
    let master = {};
    Object.assign(master,this.data);
    this.transactions.forEach(e=>{
      Object.assign(master,e);
    });
    return Object.keys(master).length;
  }
  commit(){
    if(!this.isInTransaction()){
      throw new Error('No Current Transaction');
    }
    Object.assign(this.commitTarget(),this.currentTransaction());
    this.transactions.pop();
  }
  rollback(){
    if(!this.isInTransaction()){
      throw new Error('No Current Transaction');
    }
    this.transactions.pop();
  }


  currentTransaction(){
    return this.transactions[this.transactions.length-1];
  }
  isInTransaction(){
    return this.transactions.length !== 0;
  }
  commitTarget(){
    if(this.transactions.length === 1){
      return this.data;
    }
    return this.transactions[this.transactions.length-2];
  }
  setTarget(){
    if(this.transactions.length === 0){
      return this.data;
    }
    return this.currentTransaction();
  }
}

module.exports = DatabaseSimulator;
