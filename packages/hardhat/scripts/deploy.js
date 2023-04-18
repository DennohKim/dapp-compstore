const { ethers } = require("hardhat");

async function main() {
  // Load the marketplace contract artifacts
  const computerMarketplaceFactory = await ethers.getContractFactory(
    "ComputerMarketplace"
  );

  // Deploy the contract
  const computerMarketplaceContract = await computerMarketplaceFactory.deploy();

  // Wait for deployment to finish
  await computerMarketplaceContract.deployed();

  // Log the address of the new contract
  console.log("Computer Marketplace deployed to:", computerMarketplaceContract.address);
}

// Call the main function and exit the process with exit code 0 on success or 1 on error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
