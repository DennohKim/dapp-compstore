
// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(address, address, uint256) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract ComputerMarketplace {
    uint internal productsLength = 0;
    // address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    address internal celoTokenAddress =
        0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9;

    struct Product {
        address payable owner;
        string computer_title;
        string image_url;
        string computer_specs;
        string store_location;
        uint price;
        uint sold;
    }
    bool private locked = false;

    modifier nonReentrant() {
        require(!locked, "Reentrant call.");
        locked = true;
        _;
        locked = false;
    }

    uint256 constant MAX_PRICE = 100000000000000000000;

    mapping(uint => Product) internal products;

    mapping(address => uint) internal productsByUser;

    uint internal maxProductsPerUser = 10;

    address public admin;

    event ProductCreated(address indexed owner, string computer_title, string image_url, string computer_specs, string store_location, uint price);
    event ProductDeleted(uint indexed productId);


    constructor(){
      admin = msg.sender;
    }

    function setMaxProductsPerUser(uint _maxProductsPerUser) public {
        require(admin == msg.sender, "Unauthorized caller");
        require(
            _maxProductsPerUser > 0,
            "Maximum products per user must be greater than 0"
        );
        maxProductsPerUser = _maxProductsPerUser;
    }

    function writeProduct(
        string memory _computer_title,
        string memory _image_url,
        string memory _computer_specs,
        string memory _store_location,
        uint _price
    ) public {
        require(bytes(_computer_title).length > 0, "Computer title cannot be empty");
        require(bytes(_image_url).length > 0, "Image URL cannot be empty");
        require(bytes(_computer_specs).length > 0, "Computer specs cannot be empty");
        require(bytes(_store_location).length > 0, "Store location cannot be empty");
        require(_price > 0 && _price <= MAX_PRICE, "Invalid product price");

        require(
            productsByUser[msg.sender] < maxProductsPerUser,
            "Maximum products per user reached"
        );

        uint _sold = 0;
        products[productsLength] = Product(
            payable(msg.sender),
            _computer_title,
            _image_url,
            _computer_specs,
            _store_location,
            _price,
            _sold
        );

        productsLength++;
        productsByUser[msg.sender]++;

        emit ProductCreated(msg.sender, _computer_title, _image_url, _computer_specs, _store_location, _price);

    }

    function readProduct(
        uint _index
    )
        public
        view
        returns (
            address payable,
            string memory,
            string memory,
            string memory,
            string memory,
            uint,
            uint
        )
    {
        return (
            products[_index].owner,
            products[_index].computer_title,
            products[_index].image_url,
            products[_index].computer_specs,
            products[_index].store_location,
            products[_index].price,
            products[_index].sold
        );
    }

    function buyProduct(uint _index, uint _amount) public payable nonReentrant {
        require(_index < productsLength, "Invalid product index");
        require(_amount > 0, "One product must at least be bought");
        Product storage product = products[_index];
        require(
            IERC20Token(celoTokenAddress).transferFrom(
                msg.sender,
                product.owner,
                product.price * _amount
            ),
            "Transfer failed."
        );
        products[_index].sold += _amount;
    }

    function deleteProduct(uint256 _index) public {
    require(_index < productsLength, "Invalid product index");

    address owner = products[_index].owner;
    require(owner == msg.sender, "Only the owner can delete the product");

    // Update productsByUser mapping
    productsByUser[owner]--;

    // Swap the product to delete with the last product
    products[_index] = products[productsLength - 1];
    delete products[_index];
    productsLength--;
    
    emit ProductDeleted(_index);
}


    function getProductsByUser(
        address _user
    ) public view returns (Product[] memory) {
      require(_user != address(0));

        Product[] memory ownedProducts = new Product[](productsByUser[_user]);
        uint j = 0;
        for (uint i = 0; i < productsLength; i++) {
            if (products[i].owner == _user) {
                ownedProducts[j] = products[i];
                j++;
                if(j == productsByUser[_user]) break;
            }
        }

        return ownedProducts;
    }

      function getProductsLength() public view returns (uint) {
        return (productsLength);
    }

}


