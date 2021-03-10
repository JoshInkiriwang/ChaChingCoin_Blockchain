const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, prevHash=  '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calcHash();
        this.nonce = 0;
    }

    calcHash(){
        return SHA256(this.index + this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    //Proof-of-work Part
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calcHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    //Genesis Block is equal to make initial or first block
    //Previous Hash pada Genesis Block itu tidak ada karena dia block yang pertama
    createGenesisBlock(){
        return new Block(0,"01/01/2021","Genesis Block", "0");
    }

    //Memberikan informasi blok ujung yang ada di blockchain.
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    //Untuk memasukkan data terbaru kedalam Block
    addBlock(newBlock){
        newBlock.prevHash = this.getLatestBlock().hash; //Mengambil Hash dari Block sebelumnya
        newBlock.hash = newBlock.calcHash(); //Untuk Hashing Block Terbaru
        //Untuk membuat link dari block yang telah ada, lalu disambungkan dengan blok baru, connectnya pake hash.
        this.chain.push(newBlock);
    }

    //Verifikasi Integritas Blockchain, yang akan mengembalikan nilai TRUE jika valid dan sebaliknya
    isChainValid(){
        //Dimulai dari indeks = 1, karena indeks = 0  itu Genesis Block
        for(let i = 1; i < this.chain.length; i++){
            const currBlock = this.chain[i]; //Mengambil posisi currentBlock dari Chain ke i
            const prevBlock = this.chain[i - 1]; //Mengambil posisi Block sebelumnya dari chain ke i - 1

            if(currBlock.hash !== currBlock.calcHash()){
                return false;
            }

            if(currBlock.prevHash !== prevBlock.hash){
                return false;
            }
        }

        return true;
    }
}

//inisialisasi ChaChingCoin menjadi sebuah BlockChain
let ChaChingCoin = new Blockchain();
//Input block baru kedalam BlockChain
ChaChingCoin.addBlock(new Block(1,"10/01/2020",{amount: 40}));
ChaChingCoin.addBlock(new Block(2,"15/01/2020",{amount: 20}));

console.log("is blockchain valid? " + ChaChingCoin.isChainValid());

//Mencoba bila kondisi = false
ChaChingCoin.chain[1].data = { amount : 100 };
//Walaupun kita kalkulasi ulang hash dari blockchain[1] dia tetap false
ChaChingCoin.chain[1].hash = ChaChingCoin.chain[1].calcHash();

console.log("is blockchain valid? " + ChaChingCoin.isChainValid());

//Print BlockChain
//console.log(JSON.stringify(ChaChingCoin,null,4));
