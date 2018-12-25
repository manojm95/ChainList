//contract to be tested
var ChainList = artifacts.require("./ChainList.sol");
// contract('ChainList', function(accounts){
//     var chainListInstance;
//     var seller = accounts[1];
//     var buyer = accounts[2];
//     var articleName = "article 1";
//     var articleDescription = "Description for article 1";
//     var articlePrice = 10;
//     var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
//     var buyerBlanaceBeforeGuy, buyerBalanceAfterBuy;
  
//     it("should sell an articleeee", function() {
//       return ChainList.deployed().then(function(instance) {
//         chainListInstance = instance;
//         return chainListInstance.sellArticle(articleName, articleDescription, web3.utils.toWei(articlePrice.toString(), "ether"), { from: seller});
//       }).then(function() {
//         return chainListInstance.getArticle();
//       }).then(function(data) {
//         assert.equal(data[0], seller, "seller must be " + seller);
//         assert.equal(data[1], 0x0, "buyer must be " + buyer);
//         assert.equal(data[2], articleName, "article name must be " + articleName);
//         assert.equal(data[3], articleDescription, "article description must be " + articleDescription);
//         assert.equal(data[4], web3.utils.toWei(articlePrice.toString(), "ether"), "article price must be " + web3.utils.toWei(articlePrice.toString(), "ether"));
//       });
//     });

// });

//test suite
contract('ChainList', function(accounts){
    var chainListInstance;
    var seller = accounts[1];
    var buyer = accounts[2];
    var articleName = "article 1";
    var articleDescription = "Description for article 1";
    var articlePrice = 1;

    //no article for sale yet

        it("should sell an articleeee", function() {
      return ChainList.deployed().then(function(instance) {
        chainListInstance = instance;
        return chainListInstance.sellArticle(articleName, articleDescription, web3.utils.toWei(articlePrice.toString(), "ether"), { from: seller});
      }).then(function() {
        return chainListInstance.articles(1);
    }).then(function(data) {

      assert.equal(data[0].toNumber(), 1, "article id must be 1");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], articleName, "article name must be " + articleName);
      assert.equal(data[4], articleDescription, "article description must be " + articleDescription);
      console.log(data,'<-----------------');
      console.log(data,'<----------------->'+web3.utils.toWei(articlePrice.toString(), "ether"));

      //assert.equal(data[5].toNumber(), web3.utils.toWei(articlePrice.toString(), "ether"), "article price must be " + web3.utils.toWei(articlePrice.toString(), "ether"));
    });
    });


//     it("Throw esception when there is no article to buy and someone tries to buy", function () {
//         return ChainList.deployed().then(function (instance) {
//             chainListInstance = instance;
//             //record balance of buyer and seller
//             return chainListInstance.buyArticle(1,{
//                 from: buyer,
//                 value: web3.utils.toWei(articlePrice.toString(), "ether")
//             });
//         }).then(assert.fail)
//             .catch(function (error) {
//                 assert(true);
//             }).then(function () {
//                 return chainListInstance.getNumberOfArticles();

//             }).then(function (data) {
//                 assert.equal(data.toNumber(), 0, "No Of Articles must be zero");
//             })
//     });

    //buy article that doesn't exist
    // buy an article that does not exist
  it("should throw an exception if you try to buy an article that does not exist", function(){
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice.toString(), "ether"), { from: seller });
    }).then(function(receipt){
      return chainListInstance.buyArticle(2, {from: seller, value: web3.toWei(articlePrice.toString(), "ether")});
    }).then(assert.fail)
    .catch(function(error) {
      assert(true);
    }).then(function() {
      return chainListInstance.articles(1);
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 1, "article id must be 1");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], articleName, "article name must be " + articleName);
      assert.equal(data[4], articleDescription, "article description must be " + articleDescription);
      //assert.equal(data[5].toNumber(), web3.utils.toWei(articlePrice.toString, "ether"), "article price must be " + web3.utils.toWei(articlePrice, "ether"));
    });
  });

      // buying an article you are selling
  it("should throw an exception if you try to buy your own article", function() {
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;

      return chainListInstance.buyArticle(1, {from: seller, value: web3.toWei(articlePrice.toString(), "ether")});
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function() {
      return chainListInstance.articles(1);
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 1, "article id must be 1");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], articleName, "article name must be " + articleName);
      assert.equal(data[4], articleDescription, "article description must be " + articleDescription);
      //assert.equal(data[5].toNumber(), web3.toWei(articlePrice.toString(), "ether"), "article price must be " + web3.toWei(articlePrice.toString(), "ether"));
    });
  });

   // incorrect value
  it("should throw an exception if you try to buy an article for a value different from its price", function() {
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.buyArticle(1, {from: buyer, value: web3.toWei((articlePrice + 1).toString(), "ether")});
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function() {
      return chainListInstance.articles(1);
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 1, "article id must be 1");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], articleName, "article name must be " + articleName);
      assert.equal(data[4], articleDescription, "article description must be " + articleDescription);
      //assert.equal(data[5].toNumber(), web3.toWei(articlePrice.toString(), "ether"), "article price must be " + web3.toWei(articlePrice.toString(), "ether"));
    });
  });

    //article already sold issue
    it("Throw esception when there buyer tries to buy article which is alread sold", function () {
        return ChainList.deployed().then(function (instance) {
            ChainListInstance = instance;
            return ChainListInstance.sellArticle(articleName, articleDescription, web3.utils.toWei(articlePrice.toString(), "ether"), { from: seller });
        }).then(function (receipt) {
            //record balance of buyer and seller
            return ChainListInstance.buyArticle(1,{ from: buyer, value: web3.utils.toWei(articlePrice.toString(), "ether") });
        }).then(function () {
            //record balance of buyer and seller
            return ChainListInstance.buyArticle(1,{ from: accounts[2], value: web3.utils.toWei(articlePrice.toString(), "ether") });
        }).then(assert.fail)
        .catch(function (error) {
                assert(true);
        }).then(function () {
            return chainListInstance.articles(1);
        }).then(function(data) {
          assert.equal(data[0].toNumber(), 1, "article id must be 1");
          assert.equal(data[1], seller, "seller must be " + seller);
          assert.equal(data[2], buyer, "buyer must be empty");
          assert.equal(data[3], articleName, "article name must be " + articleName);
          assert.equal(data[4], articleDescription, "article description must be " + articleDescription);
          //assert.equal(data[5].toNumber(), web3.toWei(articlePrice.toString(), "ether"), "article price must be " + web3.toWei(articlePrice.toString(), "ether"));
        });
    });

})

