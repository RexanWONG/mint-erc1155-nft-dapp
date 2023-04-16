// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SampleNFTs is ERC1155, Ownable, Pausable, ERC1155Supply {
    uint256 public MINT_PRICE = 0.0000001 ether;
    uint256 public MAX_MINT_QUANTITY = 1;
    uint256 public MAX_SUPPLY = 100;

    constructor()
        ERC1155("ipfs://Qmaa6TuP2s9pSKczHF4rwWhTKUdygrrDs8RmYYqCjP3Hye/")
    {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(uint256 id)
        public payable
    {
        require(id < 1, "Wrong NFT");
        require(msg.value == MINT_PRICE, "Not enough money sent to mint");
        require(totalSupply(id) + MAX_MINT_QUANTITY <= MAX_SUPPLY, "Max supply reached");

        _mint(msg.sender, id, MAX_MINT_QUANTITY, "");
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function uri(uint256 _id) public view virtual override returns (string memory) {
        require(exists(_id), "URL: nonexistent token");
        return string(abi.encodePacked(super.uri(_id), Strings.toString(_id), ".json"));
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    } 
}
