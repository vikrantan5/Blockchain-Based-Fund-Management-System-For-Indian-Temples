// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NGORegistry
 * @dev Smart contract for registering and managing NGOs on the blockchain
 * @notice This contract is designed for TESTNET/DEMONSTRATION purposes only
 * No real cryptocurrency is transferred
 */
contract NGORegistry {
    address public platformAdmin;

    mapping(address => bool) private registeredNGOs;
    address[] private ngoList;

    event NGORegistered(address indexed ngo, uint256 timestamp);
    event NGORemoved(address indexed ngo, uint256 timestamp);
    event PlatformAdminTransferred(address indexed oldAdmin, address indexed newAdmin);

    modifier onlyPlatformAdmin() {
        require(msg.sender == platformAdmin, "Only platform administrator can perform this action");
        _;
    }

    constructor() {
        platformAdmin = msg.sender;
    }

    /**
     * @dev Register a new NGO organization
     * @param _ngoWallet The wallet address of the NGO
     */
    function registerNGO(address _ngoWallet) external onlyPlatformAdmin {
        require(!registeredNGOs[_ngoWallet], "NGO already registered");
        require(_ngoWallet != address(0), "Invalid wallet address");
        
        registeredNGOs[_ngoWallet] = true;
        ngoList.push(_ngoWallet);
        emit NGORegistered(_ngoWallet, block.timestamp);
    }

    /**
     * @dev Remove an NGO from the registry
     * @param _ngoWallet The wallet address of the NGO to remove
     */
    function removeNGO(address _ngoWallet) external onlyPlatformAdmin {
        require(registeredNGOs[_ngoWallet], "NGO not registered");

        registeredNGOs[_ngoWallet] = false;

        // Remove from ngoList
        for (uint i = 0; i < ngoList.length; i++) {
            if (ngoList[i] == _ngoWallet) {
                ngoList[i] = ngoList[ngoList.length - 1];
                ngoList.pop();
                break;
            }
        }

        emit NGORemoved(_ngoWallet, block.timestamp);
    }

    /**
     * @dev Check if an NGO is registered
     * @param _ngoWallet The wallet address to check
     * @return bool Returns true if registered
     */
    function isRegistered(address _ngoWallet) public view returns (bool) {
        return registeredNGOs[_ngoWallet];
    }

    /**
     * @dev Get all registered NGOs
     * @return address[] Array of all registered NGO wallet addresses
     */
    function getAllNGOs() external view returns (address[] memory) {
        return ngoList;
    }

    /**
     * @dev Get total number of registered NGOs
     * @return uint256 Total count of registered NGOs
     */
    function getTotalNGOs() external view returns (uint256) {
        return ngoList.length;
    }

    /**
     * @dev Transfer platform admin rights to a new address
     * @param newAdmin The address of the new platform administrator
     */
    function transferPlatformAdmin(address newAdmin) external onlyPlatformAdmin {
        require(newAdmin != address(0), "Invalid address");
        emit PlatformAdminTransferred(platformAdmin, newAdmin);
        platformAdmin = newAdmin;
    }
}
