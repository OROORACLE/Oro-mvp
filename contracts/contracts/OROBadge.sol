// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title OROBadge
 * @dev Soulbound Token (SBT) - Non-transferable ERC721 for reputation badges
 * @notice Each wallet can only have one badge, identified by tokenId = uint256(uint160(address))
 */
contract OROBadge is ERC721, Ownable {
    using Strings for uint256;

    // Base metadata URI for token metadata
    string private _baseMetadataURI;
    
    // Mapping to track which addresses can mint/update badges
    mapping(address => bool) public minters;
    
    // Mapping to track if a wallet has been minted
    mapping(address => bool) private _mintedWallets;
    
    // Events
    event BadgeMinted(address indexed wallet, uint256 indexed tokenId);
    event BadgeUpdated(address indexed wallet, uint256 indexed tokenId);
    event MinterUpdated(address indexed minter, bool allowed);
    event BaseMetadataUpdated(string newBaseMetadataURI);

    /**
     * @dev Constructor sets the initial owner and base metadata URI
     * @param initialOwner The address that will own the contract
     * @param baseMetadataURI The base URI for token metadata
     */
    constructor(
        address initialOwner,
        string memory baseMetadataURI
    ) ERC721("ORO Badge", "ORO") Ownable(initialOwner) {
        _baseMetadataURI = baseMetadataURI;
        // Owner is automatically a minter
        minters[initialOwner] = true;
    }

    /**
     * @dev Mints a new badge or updates an existing one for a wallet
     * @param wallet The wallet address to mint/update the badge for
     * @notice Only callable by authorized minters
     * @notice Each wallet can only have one badge
     */
    function mintOrUpdate(address wallet) external {
        require(minters[msg.sender], "OROBadge: Not authorized to mint");
        require(wallet != address(0), "OROBadge: Cannot mint to zero address");
        
        uint256 tokenId = uint256(uint160(wallet));
        
        if (_mintedWallets[wallet]) {
            // Update existing badge
            emit BadgeUpdated(wallet, tokenId);
        } else {
            // Mint new badge
            _mintedWallets[wallet] = true;
            _safeMint(wallet, tokenId);
            emit BadgeMinted(wallet, tokenId);
        }
    }

    /**
     * @dev Returns the token ID for a given wallet address
     * @param wallet The wallet address
     * @return The token ID (uint256(uint160(wallet)))
     */
    function getTokenId(address wallet) external pure returns (uint256) {
        return uint256(uint160(wallet));
    }

    /**
     * @dev Checks if a wallet has been minted
     * @param wallet The wallet address to check
     * @return True if the wallet has been minted
     */
    function isMinted(address wallet) external view returns (bool) {
        return _mintedWallets[wallet];
    }

    /**
     * @dev Returns the token URI for a given token ID
     * @param tokenId The token ID
     * @return The token URI pointing to the API
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "OROBadge: URI query for nonexistent token");
        
        address wallet = address(uint160(tokenId));
        return string(abi.encodePacked(_baseMetadataURI, Strings.toHexString(wallet), ".json"));
    }

    /**
     * @dev Sets the base metadata URI
     * @param newBaseMetadataURI The new base metadata URI
     * @notice Only callable by the owner
     */
    function setBaseMetadata(string calldata newBaseMetadataURI) external onlyOwner {
        _baseMetadataURI = newBaseMetadataURI;
        emit BaseMetadataUpdated(newBaseMetadataURI);
    }

    /**
     * @dev Sets the minter status for an address
     * @param minter The address to set minter status for
     * @param allowed Whether the address is allowed to mint
     * @notice Only callable by the owner
     */
    function setMinter(address minter, bool allowed) external onlyOwner {
        minters[minter] = allowed;
        emit MinterUpdated(minter, allowed);
    }

    /**
     * @dev Returns the base metadata URI
     * @return The base metadata URI
     */
    function getBaseMetadataURI() external view returns (string memory) {
        return _baseMetadataURI;
    }

    // ============ SOULBOUND FUNCTIONALITY ============
    
    /**
     * @dev Override transfer function to make tokens non-transferable
     * @notice Soulbound tokens cannot be transferred
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        // Allow minting (to != address(0) and from == address(0))
        if (to != address(0) && _ownerOf(tokenId) == address(0)) {
            return super._update(to, tokenId, auth);
        }
        
        // Reject all transfers
        revert("OROBadge: Soulbound tokens cannot be transferred");
    }

    /**
     * @dev Override approval functions to prevent approvals
     * @notice Soulbound tokens cannot be approved for transfer
     */
    function approve(address, uint256) public pure override {
        revert("OROBadge: Soulbound tokens cannot be approved");
    }

    /**
     * @dev Override setApprovalForAll to prevent approvals
     * @notice Soulbound tokens cannot be approved for transfer
     */
    function setApprovalForAll(address, bool) public pure override {
        revert("OROBadge: Soulbound tokens cannot be approved");
    }

    /**
     * @dev Override getApproved to always return zero address
     * @notice Soulbound tokens cannot be approved
     */
    function getApproved(uint256) public pure override returns (address) {
        return address(0);
    }

    /**
     * @dev Override isApprovedForAll to always return false
     * @notice Soulbound tokens cannot be approved
     */
    function isApprovedForAll(address, address) public pure override returns (bool) {
        return false;
    }
}
