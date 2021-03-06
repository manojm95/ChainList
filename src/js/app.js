App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // initialize web3
    if(typeof web3 !== 'undefined') {
      //reuse the provider of the Web3 object injected by Metamask
      App.web3Provider = web3.currentProvider;
    } else {
      //create a new provider and plug it directly into our local node
      //App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      App.web3Provider = new Web3.providers.HttpProvider('http://54.243.9.9:8545');
    }
    web3 = new Web3(App.web3Provider);
    console.log('NNNNN---->',web3);

    App.displayAccountInfo();

    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        $('#account').text(account);
        web3.eth.getBalance(account, function(err, balance) {
          if(err === null) {
            $('#accountBalance').text(web3.fromWei(balance, "ether") + " ETH");
          }
        })
      }
    });
  },

  initContract: function() {
    $.getJSON('ChainList.json', function(chainListArtifact) {
      // get the contract artifact file and use it to instantiate a truffle contract abstraction
      App.contracts.ChainList = TruffleContract(chainListArtifact);
      // set the provider for our contracts
      App.contracts.ChainList.setProvider(App.web3Provider);
       //listen to Events
       App.listenToEvents();
      // retrieve the article from the contract
      return App.reloadArticles();
    });
  },

  reloadArticles: function() {
    if(App.loading){
      return;
    } 

    App.loading = true;
    // refresh account information because the balance might have changed
    App.displayAccountInfo();

    var chainListInstance;

    // retrieve the article placeholder and clear it
    //$('#articlesRow').empty();

    App.contracts.ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance.getArticlesForSale();
    }).then(function(articleIds) {
      $('#articlesRow').empty();
      console.log('MMMMMMMMMM--->',articleIds.toString());
      articleIds.map((articleId,idx)=> {
        chainListInstance.articles(idx+1).then(artic=>{
          App.displayArticle( artic[0], artic[1], artic[3], artic[4], artic[5])
        });
      })

      App.loading = false;
      
    }).catch(function(err) {
      App.loading = false;
      console.error(err.message);
    });
  },

  displayArticle:function(id,seller, name, desc, eprice){
    var articlesRow = $('#articlesRow');
    var price = web3.fromWei(eprice, "ether");
    // retrieve the article template and fill it
    var articleTemplate = $('#articleTemplate');
    articleTemplate.find('.panel-title').text(name);
    articleTemplate.find('.article-description').text(desc);
    articleTemplate.find('.article-price').text(price);
    articleTemplate.find('.btn-buy').attr('data-value',price);
    articleTemplate.find('.btn-buy').attr('data-id',id);
    if (seller == App.account) {
      articleTemplate.find('.article-seller').text("You");
      articleTemplate.find('.btn-buy').hide();
    } else{
      articleTemplate.find('.article-seller').text(seller);
      articleTemplate.find('.btn-buy').show();
    }

    //add this new article
    articlesRow.append(articleTemplate.html())
  },

  sellArticle: function() {
    // retrieve the detail of the article
    var _article_name = $('#article_name').val();
    var _description = $('#article_description').val();
    var _price = web3.toWei(parseFloat($('#article_price').val() || 0), "ether");

    if((_article_name.trim() == '') || (_price == 0)) {
      // nothing to sell
      return false;
    }

    App.contracts.ChainList.deployed().then(function(instance) {
      return instance.sellArticle(_article_name, _description, _price, {
        from: App.account,
        gas: 500000
      });
    }).then(function(result) {
      //App.reloadArticles();
    }).catch(function(err) {
      console.error(err);
    });
  },
  listenToEvents: function(){
    App.contracts.ChainList.deployed().then(function(instance) {
      console.log('Manoj');
      instance.LogSellArticle({}, {}).watch(function(error,event){
        if(!error){
          $("#events").append('<li class="list-group-item">'+event.args._name+ ' is now for sale</li>')
        }else{
          console.log(error);
        }
        App.reloadArticles();
      });

      instance.LogBuyArticle({}, {}).watch(function(error,event){
        if(!error){
          $("#events").append('<li class="list-group-item">'+event.args._buyer+ ' bought '+event.args._name+'</li>')
        }else{
          console.log(error);
        }
        App.reloadArticles();
      });
    }).then(function(result){
      console.log('NNNNN');
    }).catch(function(err) {
      console.error(err);
    });
  },
  buyArticle: function(){
      event.preventDefault();
      //retrieve price
      var _price = parseFloat($(event.target).data('value'));
      var _arid = $(event.target).data('id');

      App.contracts.ChainList.deployed().then(ins=>{
        return ins.buyArticle(arid, { 
          from: App.account,
          value: web3.toWei(_price,"ether"),
          gas: 500000
        });
      }).catch(err=>{
        console.error(error);
      })
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});


// var price = web3.fromWei(article[4], "ether");

//       // retrieve the article template and fill it
//       var articleTemplate = $('#articleTemplate');
//       articleTemplate.find('.panel-title').text(article[2]);
//       articleTemplate.find('.article-description').text(article[3]);
//       articleTemplate.find('.article-price').text(price);
//       articleTemplate.find('.btn-buy').attr('data-value',price);

//       var seller = article[0];
//       if (seller == App.account) {
//         seller = "You";
//       }
//       articleTemplate.find('.article-seller').text(seller);

//       //buyer
//       var buyer = article[1];
//       if (buyer == App.account) {
//         buyer = "You";
//       }else if (buyer == 0X0) {
//         buyer= "No One Yet";
//       }
//       articleTemplate.find('.article-buyer').text(buyer);

//       if(article[0]==App.account || article[1] != 0X0){
//         articleTemplate.find('.btn-buy').hide();
//       } else {
//         articleTemplate.find('.btn-buy').show();
//       }

//       // add this article
//       $('#articlesRow').append(articleTemplate.html());