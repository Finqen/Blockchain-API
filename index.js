// Packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const SHA256 = require('crypto-js/sha256');

// Server ALGO part1
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

// BLOCKCHAIN ALGO with three Classes: Blockchain, Transaction, Block


// Timestamp
function time(){

    var helpDate = Date(Date.now()); 
    date = helpDate.toString()
    return date;
}


// Transaction class, send this as JSON with Postman
class Transaction{
    constructor(sender, recipient, amount){
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
        }
}
    
    
    
class Block{
        constructor(timestamp, transactions, previousHash = ''){
            //this.index = index; Order given by their position in the Blockchain -> no need
            this.timestamp = timestamp;
            this.transactions = transactions;
            this.hash = this.calculateHash;
            this.previousHash = previousHash;
            this.nonce = 0;
        }
    
        calculateHash(){

            //all Data in order as a String and hashed

            return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
        }
        

        // Proof of Work ALGO
        mineBlock(difficulty) {
            while (this.hash.toString().substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
              this.nonce++;
              this.hash = this.calculateHash();
            }
        
    
          }

        hasValidTransactions(){
            for(const tx of this.transactions){
                if(!tx.isValid()){
                    return false;
                }
            }

            return true;

        }
    }
    
    
    
class Blockchain{
        constructor(){
            this.chain = [this.createGenesisBlock()];
            this.difficulty = 2; //how fast new blocks can added to the chain (2 is a low difficulty, but therefore the algo is very fast); For example: Bitcoin -> new block every 10 min
            this.pendingTransactions = []; //array where the next transactions are stored
            this.miningReward = 1; //added to pending transactions, get added with the next instance
        }
        
        //first block in every blockchain is the genesis block
        createGenesisBlock(){
            return new Block(time(), "Genesis block", "0");
            
            
        }
        //returns latest Block in the chain
        getLatestBlock(){
            return this.chain[this.chain.length - 1];
        }
    
        addBlock(newBlock){
            newBlock.previousHash = this.getLatestBlock().hash;
            newBlock.mineBlock(this.difficulty);
            this.chain.push(newBlock);
        }
    
        minePendingTransactions(miningRewardAddress){
            let block = new Block(Date.now(), this.pendingTransactions); //BC for example -> too many pending Transactions -> Miners choose which Transactions they include
            block.mineBlock(this.difficulty);
    
            this.chain.push(block);
    
            this.pendingTransactions = [
                new transactions(null, miningRewardAddress, this.miningReward)  // peer to peer network -> ingores you when you try to change the mining reward
            ];
        }
    
        addTransaction(transaction){

            if(!transaction.sender || !transaction.recipient){
                throw new Error('Transaction must include sender and recipient!')
            }


            this.pendingTransactions.push(transaction);
        }
    
        //Transactions not stored in your Wallet, but in the whole Chain
        // so you have to iterate over the whole chain to get a wallet's balance
        getBalanceOfAddress(address){
            let balance = 0;
    
            for(const block of this.chain){

                for(const trans of block.transactions){
                
                    if(trans.sender === address){
                        balance -= trans.amount;
                    }
                    if(trans.recipient === address){
                        balance += trans.amount;
                    }
                }
                
            }
    
            return balance;
        }
    
        isChainValid(){
            for(let i = 1; i < this.chain.length; i++){
                const currentBlock = this.chain[i];
                const previousBlock = this.chain[i - 1];

                if(!currentBlock.hasValidTransactions()){
                    return false;
                }
    
                if(currentBlock.hash !== currentBlock.calculateHash()){
                    return false;
                }
    
                if(currentBlock.previousHash !== previousBlock.hash){
                    return false;
                }
            }
    
            return true;
        }
    
    }



//Initialization
let Coin = new Blockchain();

testAmount = 1000;


// SERVER ALGO part2

//Routes
app.get('/mine', function(req, res) {

    Coin.addBlock(new Block( time() , { amount: testAmount}));
    

  

    

    res.send({
      message: "New Block Mined",
      //block: Coin.chain[testindex]
      //timestamp: currentBlock.timestamp,
      //previous_Hash: currentBlock.previousHash 
    })

    //testIndex++;
    //testAmount=testAmount+10;
  })

app.get('/chain', function(req, res) {


    res.send({
    
      chainlength: Coin.chain.length,
      chain: Coin.chain     
      
    })


  })


app.post('/transaction', function(req, res) {


    Coin.addTransaction(new Transaction(req.body.sender, req.body.recipient, req.body.amount));
    
    res.send({
        message: "New Transaction added!",
        sender: req.body.sender,  // Public Address of Sender
        recipient: req.body.recipient, // Public Address of Recipient
        amount: req.body.amount
      })

    Coin.minePendingTransactions(req.body.sender); //sender gets the reward, cause he sent the request and mines the coin, reward will be added with the next transaction

})

app.post('/balance', function(req, res) {



    
    res.send({
        owner: req.body.owner,
        balance: Coin.getBalanceOfAddress(req.body.owner)
      })

})



// Port for Localhost


const port = 8081;
server = app.listen(port, () => console.log(`Server running on port ${port}`)); //Server Config