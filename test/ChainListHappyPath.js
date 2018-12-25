var ChainList = artifacts.require("./ChainList.sol");

// test suite
contract('ChainList', function(accounts){
  var chainListInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName1 = "article 1";
  var articleDescription1 = "Description for article 1";
  var articlePrice1 = 10;
  var articleName2 = "article 2";
  var articleDescription2 = "Description for article 2";
  var articlePrice2 = 20;
  var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
  var buyerBlanaceBeforeGuy, buyerBalanceAfterBuy;

  it("should be initialized with empty values", function() {
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return instance.getNumberOfArticles();
    }).then(function(data) {
      assert.equal(data.toNumber(), 0, "No Of Articles must be zero");
      return chainListInstance.getArticlesForSale();
    }).then(data=>{
      assert.equal(data.length, 0, "There should not be any article for sale");
    })
  });

  //should sell the first Item
  it("should sell first article", function() {
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName1, articleDescription1, web3.utils.toWei(articlePrice1.toString(), "ether"), { from: seller});
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      console.log('LOGS--->',receipt.logs[0].args);
      assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
      assert.equal(receipt.logs[0].args._articleCounter.toNumber(), 1, "event id must be " + 1);
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._name, articleName1, "event article name must be " + articleName1);
      assert.equal(receipt.logs[0].args._price, web3.utils.toWei(articlePrice1.toString(), "ether"), "event article price must be " + web3.utils.toWei(articlePrice1.toString(), "ether"));
      return chainListInstance.getNumberOfArticles();
    }).then(function(data) {
      assert.equal(data.toNumber(), 1, "No Of Articles must be one");
      return chainListInstance.getArticlesForSale();
    }).then(data=>{
      assert.equal(data.length, 1, "There should be one article for sale");
      assert.equal(data[0].toNumber(), 1, "There should be one article for sale");
    });
  });

  //should sell the second Item
  it("should sell second article", function() {
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName2, articleDescription2, web3.utils.toWei(articlePrice2.toString(), "ether"), { from: seller});
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      console.log('LOGS--->',receipt.logs[0].args);
      assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
      assert.equal(receipt.logs[0].args._articleCounter.toNumber(), 2, "event id must be " + 2);
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._name, articleName2, "event article name must be " + articleName2);
      assert.equal(receipt.logs[0].args._price, web3.utils.toWei(articlePrice2.toString(), "ether"), "event article price must be " + web3.utils.toWei(articlePrice2.toString(), "ether"));
      return chainListInstance.getNumberOfArticles();
    }).then(function(data) {
      assert.equal(data.toNumber(), 2, "No Of Articles must be one");
      return chainListInstance.getArticlesForSale();
    }).then(data=>{
      assert.equal(data.length, 2, "There should be one article for sale");
      assert.equal(data[1].toNumber(), 2, "There should be one article for sale");
    });
  });


  // it("should sell an article", function() {
  //   return ChainList.deployed().then(function(instance) {
  //     chainListInstance = instance;
  //     return chainListInstance.sellArticle(articleName, articleDescription, web3.utils.toWei(articlePrice.toString(), "ether"), { from: seller});
  //   }).then(function() {
  //     return chainListInstance.getArticle();
  //   }).then(function(data) {
  //     assert.equal(data[0], seller, "seller must be " + seller);
  //     assert.equal(data[1], 0x0, "buyer must be " + buyer);
  //     assert.equal(data[2], articleName, "article name must be " + articleName);
  //     assert.equal(data[3], articleDescription, "article description must be " + articleDescription);
  //     assert.equal(data[4], web3.utils.toWei(articlePrice.toString(), "ether"), "article price must be " + web3.utils.toWei(articlePrice.toString(), "ether"));
  //   });
  // });

  it("should buy an article",function(){
    return ChainList.deployed().then(function(instance){
      ChainListInstance = instance;
      //record balance of buyer and seller
      sellerBalanceBeforeBuy = web3.eth.getBalance(seller);
      buyerBlanaceBeforeGuy = web3.eth.getBalance(buyer);
      return chainListInstance.buyArticle(1, {
        from: buyer,
        value: web3.utils.toWei(articlePrice1.toString(),"ether")
      });
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      console.log('LOGS--->',receipt.logs[0].args);
      assert.equal(receipt.logs[0].event, "LogBuyArticle", "event should be LogSellArticle");
      assert.equal(receipt.logs[0].args._id.toNumber(), 1, "event id must be " + 1);
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._buyer, buyer, "event buyer must be " + buyer);
      assert.equal(receipt.logs[0].args._name, articleName1, "event article name must be " + articleName1);
      assert.equal(receipt.logs[0].args._price, web3.utils.toWei(articlePrice1.toString(), "ether"), "event article price must be " + web3.utils.toWei(articlePrice1.toString(), "ether"));
      sellerBalanceAfterBuy = web3.eth.getBalance(seller);
      buyerBalanceAfterBuy = web3.eth.getBalance(buyer);
      //assert(sellerBalanceAfterBuy == sellerBalanceBeforeBuy + web3.utils.toWei(articlePrice.toString(),"ether"), "seller should have earned " + articlePrice + " ETH");
      //assert(buyerBalanceAfterBuy <= buyerBlanaceBeforeGuy - web3.utils.toWei(articlePrice.toString(),"ether"), "buyer should have spent " + articlePrice + " ETH");

      return chainListInstance.getNumberOfArticles();
    }).then(function(data) {  
      assert.equal(data.toNumber(), 2, "No Of Articles must be two");
      return chainListInstance.getArticlesForSale();
    }).then(data=>{
      assert.equal(data.length, 1, "There should be one article for sale");
      assert.equal(data[0].toNumber(), 2, "There should be one article for sale");
    });

    
  });

  // it("should trigger an event when a new article is sold", function() {
  //   return ChainList.deployed().then(function(instance) {
  //     chainListInstance = instance;
  //     return chainListInstance.sellArticle(articleName, articleDescription, web3.utils.toWei(articlePrice.toString(), "ether"), {from: seller});
  //   }).then(function(receipt) {
  //     assert.equal(receipt.logs.length, 1, "one event should have been triggered");
  //     console.log('LOGS--->',receipt.logs[0].args);
  //     assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
  //     assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
  //     assert.equal(receipt.logs[0].args._name, articleName, "event article name must be " + articleName);
  //     assert.equal(receipt.logs[0].args._price, web3.utils.toWei(articlePrice.toString(), "ether"), "event article price must be " + web3.utils.toWei(articlePrice.toString(), "ether"));
  //   });
  // });
});
