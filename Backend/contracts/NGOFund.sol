// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./NGORegistry.sol";

/**
 * @title NGOFund
 * @dev Simulated blockchain-based fund management for NGOs
 * @notice ⚠️ TESTNET/DEMONSTRATION ONLY - No real cryptocurrency is transferred
 * This contract simulates transparent fund tracking for educational purposes
 */

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract NGOFund {
    // Reference to the NGORegistry contract
    NGORegistry public ngoRegistry;

    // Mappings for simulated ETH and ERC20 token balances
    mapping(address => uint256) public ethFunds; // ngo => amount
    mapping(address => mapping(address => uint256)) public tokenFunds; // token => ngo => amount
    
    // Donation tracking for transparency
    mapping(address => uint256) public totalDonationsReceived; // ngo => total amount
    mapping(address => uint256) public donorCount; // ngo => number of unique donors
    mapping(address => mapping(address => bool)) public hasDonated; // ngo => donor => bool

    // Events for transparency and tracking
    event DonationReceived(address indexed donor, address indexed ngo, uint256 amount, string purpose, uint256 timestamp);
    event TokenDonationReceived(address indexed donor, address indexed token, address indexed ngo, uint256 amount, string purpose, uint256 timestamp);
    event FundsWithdrawn(address indexed ngo, uint256 amount, string purpose, uint256 timestamp);
    event TokenFundsWithdrawn(address indexed token, address indexed ngo, uint256 amount, string purpose, uint256 timestamp);

    // Constructor
    constructor(address _ngoRegistry) {
        require(_ngoRegistry != address(0), "Invalid registry address");
        ngoRegistry = NGORegistry(_ngoRegistry);
    }

    // ==============================
    //    SIMULATED ETH/MATIC Flow
    //    (TESTNET ONLY)
    // ==============================

    /**
     * @dev Simulate a donation to an NGO
     * @notice This is a SIMULATED transaction for demonstration purposes
     * @param ngo The NGO's wallet address
     * @param purpose The purpose of the donation (e.g., "Education", "Healthcare")
     */
    function donateToNGO(address ngo, string memory purpose) external payable {
        require(msg.value > 0, "Donation amount must be greater than zero");
        require(ngoRegistry.isRegistered(ngo), "NGO is not registered");
        require(bytes(purpose).length > 0, "Purpose is required");

        ethFunds[ngo] += msg.value;
        totalDonationsReceived[ngo] += msg.value;
        
        // Track unique donors
        if (!hasDonated[ngo][msg.sender]) {
            hasDonated[ngo][msg.sender] = true;
            donorCount[ngo]++;
        }

        emit DonationReceived(msg.sender, ngo, msg.value, purpose, block.timestamp);
    }

    /**
     * @dev NGO withdraws funds (simulated)
     * @param amount The amount to withdraw
     * @param purpose The purpose of withdrawal
     */
    function withdrawFunds(uint256 amount, string memory purpose) external {
        require(ngoRegistry.isRegistered(msg.sender), "Only registered NGO can withdraw");
        require(amount > 0, "Withdraw amount must be greater than zero");
        require(ethFunds[msg.sender] >= amount, "Insufficient funds");
        require(bytes(purpose).length > 0, "Purpose is required for transparency");

        ethFunds[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);

        emit FundsWithdrawn(msg.sender, amount, purpose, block.timestamp);
    }

    /**
     * @dev Get NGO's current balance
     * @param ngo The NGO's wallet address
     * @return uint256 Current balance
     */
    function getNGOBalance(address ngo) external view returns (uint256) {
        return ethFunds[ngo];
    }

    /**
     * @dev Get total donations received by an NGO
     * @param ngo The NGO's wallet address
     * @return uint256 Total donations received
     */
    function getTotalDonations(address ngo) external view returns (uint256) {
        return totalDonationsReceived[ngo];
    }

    /**
     * @dev Get donor count for an NGO
     * @param ngo The NGO's wallet address
     * @return uint256 Number of unique donors
     */
    function getDonorCount(address ngo) external view returns (uint256) {
        return donorCount[ngo];
    }

    // ==============================
    //    SIMULATED Token Flow
    //    (TESTNET ONLY)
    // ==============================

    /**
     * @dev Simulate token donation to NGO
     * @param token The token contract address
     * @param ngo The NGO's wallet address
     * @param amount The amount of tokens
     * @param purpose The purpose of donation
     */
    function donateTokenToNGO(address token, address ngo, uint256 amount, string memory purpose) external {
        require(amount > 0, "Donation amount must be greater than zero");
        require(ngoRegistry.isRegistered(ngo), "NGO is not registered");
        require(bytes(purpose).length > 0, "Purpose is required");

        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");

        tokenFunds[token][ngo] += amount;
        
        // Track unique donors
        if (!hasDonated[ngo][msg.sender]) {
            hasDonated[ngo][msg.sender] = true;
            donorCount[ngo]++;
        }

        emit TokenDonationReceived(msg.sender, token, ngo, amount, purpose, block.timestamp);
    }

    /**
     * @dev Withdraw token funds (simulated)
     * @param token The token contract address
     * @param amount The amount to withdraw
     * @param purpose The purpose of withdrawal
     */
    function withdrawTokenFunds(address token, uint256 amount, string memory purpose) external {
        require(ngoRegistry.isRegistered(msg.sender), "Only registered NGO can withdraw");
        require(amount > 0, "Withdraw amount must be greater than zero");
        require(tokenFunds[token][msg.sender] >= amount, "Insufficient token funds");
        require(bytes(purpose).length > 0, "Purpose is required for transparency");

        tokenFunds[token][msg.sender] -= amount;

        bool success = IERC20(token).transfer(msg.sender, amount);
        require(success, "Token transfer failed");

        emit TokenFundsWithdrawn(token, msg.sender, amount, purpose, block.timestamp);
    }

    /**
     * @dev Get NGO's token balance
     * @param token The token contract address
     * @param ngo The NGO's wallet address
     * @return uint256 Token balance
     */
    function getNGOTokenBalance(address token, address ngo) external view returns (uint256) {
        return tokenFunds[token][ngo];
    }
}
