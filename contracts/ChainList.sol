pragma solidity >=0.4.21 <0.6.0;

contract ChainList {
  //custom types
  struct Article {
    uint id;
    address payable seller;
    address buyer;
    string name;
    string description;
    uint256 price;
  }

  mapping (uint => Article) public articles;
  uint articleCounter;

  // state variables
  address payable seller;
  address buyer;
  string name;
  string description;
  uint256 price;

  // events
  event LogSellArticle(
    uint _articleCounter,
    address indexed _seller,
    string _name,
    uint256 _price
  );

  event LogBuyArticle(
    uint _id,
    address indexed _seller,
    address indexed _buyer,
    string _name,
    uint256 _price
  );

  // sell an article
  function sellArticle(string memory _name, string memory _description, uint256 _price) public {
    articleCounter ++;
    articles[articleCounter] = Article(
      articleCounter,
      msg.sender,
      0x0000000000000000000000000000000000000000,
      _name,
      _description,
      _price
    );
    

    emit LogSellArticle(articleCounter, msg.sender, _name, _price);
  }

  // // get an article
  // function getArticle() public view returns (
  //   address _seller,
  //   address _buyer,
  //   string memory _name,
  //   string memory _description,
  //   uint256 _price
  // ) {
  //     return(seller, buyer, name, description, price);
  // }

  function getNumberOfArticles() public view returns(uint _id){
    return articleCounter;
  }

  function getArticlesForSale() public view returns(uint[] memory){
    uint[] memory articleIds = new uint[](articleCounter);
    uint noOfArticlesForSale = 0;

    uint i = 1;
    while(i<=articleCounter){
      if(articles[i].buyer == 0x0000000000000000000000000000000000000000){
        articleIds[noOfArticlesForSale] = articles[i].id;
        noOfArticlesForSale++;
      }
      i++;
    }

    uint[] memory forSaleArray = new uint[](noOfArticlesForSale);

    for(uint j=0; j<noOfArticlesForSale; j++){      
         forSaleArray[j] = articleIds[j];
    }

    return forSaleArray;
  }

  function buyArticle(uint _id) payable public {
    //check whether article is on sale
    require(articleCounter > 0 );
    //check if article exist
    require(_id>0 && _id<=articleCounter);
    //retrieve article from mapping
    Article storage article = articles[_id];
    //check article has not been sold yetuuuuuuuuuuuuuuuuuuuuuuu
    require(article.buyer == 0x0000000000000000000000000000000000000000);
    require(msg.sender != article.seller);
    require(msg.value == article.price );

    article.buyer = msg.sender;

    seller.transfer(msg.value);
    //trigger the event
    emit LogBuyArticle(_id,article.seller,article.buyer,article.name,article.price);
  }
}
