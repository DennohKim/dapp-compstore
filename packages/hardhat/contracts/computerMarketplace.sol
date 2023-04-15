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

    mapping(uint => Product) internal products;

    mapping(address => uint) internal productsByUser;

    uint internal maxProductsPerUser = 5;

    function setMaxProductsPerUser(uint _maxProductsPerUser) public {
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

    function buyProduct(uint _index) public payable {
        require(
            IERC20Token(celoTokenAddress).transferFrom(
                msg.sender,
                products[_index].owner,
                products[_index].price
            ),
            "Transfer failed."
        );
        products[_index].sold++;
    }

    function getProductsLength() public view returns (uint) {
        return (productsLength);
    }

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
}
