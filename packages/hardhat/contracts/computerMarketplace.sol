// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

/*

Interface that allows contract to transfer and recieve ERC20 tokens

*/
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

/*
Beginning of contract
*/
contract ComputerMarketplace {
    uint internal productsLength = 0;
    // address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    address internal celoTokenAddress =
        0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9;

    address owner = msg.sender;

    /*
    Product template struct
    */

    struct Product {
        address payable owner;
        string computer_title;
        string image_url;
        string computer_specs;
        string store_location;
        uint price;
        uint sold;
    }

    // Boolean for non reentrant function

    bool private locked = false;

    /* 
       Modifier making functions non reentrant by changing locked boolean for duration of transaction so that on reentry it does not pass the "not locked requirement"
    */
    modifier nonReentrant() {
        require(!locked, "Reentrant call.");
        locked = true;
        _;
        locked = false;
    }
    modifier Onlyowner() {
        require(msg.sender == owner);
        _;
    }

    //Setting Price limit for listings
    uint256 constant MAX_PRICE = 100000000000000000000;

    //Mapping for prodict indices to product struct
    mapping(uint => Product) internal products;

    //mapping users addresses to the indices for the product listings
    mapping(address => uint) internal productsByUser;

    //Max products for a seller can list
    uint internal maxProductsPerUser = 10;

    //Events for product Listing and delisting
    event ProductCreated(
        address indexed owner,
        string computer_title,
        string image_url,
        string computer_specs,
        string store_location,
        uint price
    );
    event ProductDeleted(
        address indexed owner,
        string computer_title,
        string image_url
    );
    event ProductSold(
        address indexed owner,
        string computer_title,
        string image_url
    );

    /*
    Function to change max products per user
     
    ->Requirement: Only the owner can set this limit
    */
    function setMaxProductsPerUser(uint _maxProductsPerUser) public Onlyowner {
        require(
            _maxProductsPerUser > 0,
            "Maximum products per user must be greater than 0"
        );
        maxProductsPerUser = _maxProductsPerUser;
    }

    function getProductsLength() public view returns (uint) {
        return (productsLength);
    }

    /*
    Function to add product listing, Emits listing event "Product Created"

    ->Requirements
    *Non of the fields of data entered should be a zero
    *Price field data should also be below max price 
    *Seller should no have exceeded platform limit
    */

    function writeProduct(
        string memory _computer_title,
        string memory _image_url,
        string memory _computer_specs,
        string memory _store_location,
        uint _price
    ) public {
        require(
            bytes(_computer_title).length > 0,
            "Computer title cannot be empty"
        );
        require(bytes(_image_url).length > 0, "Image URL cannot be empty");
        require(
            bytes(_computer_specs).length > 0,
            "Computer specs cannot be empty"
        );
        require(
            bytes(_store_location).length > 0,
            "Store location cannot be empty"
        );
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

        emit ProductCreated(
            msg.sender,
            _computer_title,
            _image_url,
            _computer_specs,
            _store_location,
            _price
        );
    }

    /*
     Function allowing buyers to access data on a given product 
     */
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

    /*
       Function allowing buyers to buy a product on the platform
       Increments the product sold counter for the number of total units sold
    */


    function buyProduct(uint _index) public payable nonReentrant {
        require(msg.value == products[_index].price);

        uint allowance = IERC20Token(celoTokenAddress).allowance(
            msg.sender,
            address(this)
        );
        require(
            allowance >= products[_index].price,
            "Celo token allowance not enough"
        );

        require(
            IERC20Token(celoTokenAddress).transferFrom(
                msg.sender,
                products[_index].owner,
                products[_index].price
            ),
            "Celo token transfer failed"
        );

        
        products[_index].sold++;

        emit ProductSold(
            products[_index].owner,
            products[_index].computer_title,
            products[_index].image_url
        );
    }

    function getProductsByUser(
        address _user
    ) public view returns (Product[] memory) {
        uint count = 0;
        for (uint i = 0; i < productsLength; i++) {
            if (products[i].owner == _user) {
                count++;
            }
        }

        Product[] memory ownedProducts = new Product[](count);
        uint j = 0;
        for (uint i = 0; i < productsLength; i++) {
            if (products[i].owner == _user) {
                ownedProducts[j] = products[i];
                j++;
            }
        }

        return ownedProducts;
    }

    /*
      Function a seller uses to delete a product

      ->Requirements
      *index of product must be valid ie; within the number of products listed
      * Sender of the call must be the owner of the product
    */
    function deleteProduct(uint _index) public {
        require(_index < productsLength, "Product index out of range");

        // Make sure that the caller is the owner of the product
        require(
            products[_index].owner == msg.sender,
            "Only the owner can delete their products"
        );

        // Delete the product at the specified index
        for (uint i = _index; i < productsLength - 1; i++) {
            products[i] = products[i + 1];
        }
        delete products[productsLength - 1];
        productsLength--;

        // Update the product count for the owner
        productsByUser[msg.sender]--;
    }
}
