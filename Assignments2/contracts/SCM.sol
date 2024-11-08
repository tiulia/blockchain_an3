// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.27;

/// @title Package Registry Contract
/// @notice Manages package creation, shipping status, and updates within a supply chain system.
/// @dev Provides status tracking, consumer and seller management, and secure handling of package details.
contract PackageRegistry {

    /// @notice Enum representing the status of a package within the supply chain
    enum PackageStatus { Created, FeeLocked, Shipped, Canceled, Received }

    /// @notice Struct representing a package in the registry
    struct Package {
        bytes32 packageId;
        string description;
        uint256 timestamp;
        bytes32 hashedSecretCode;
        PackageStatus status;
        address payable seller;
        address payable consumer;
    }

    mapping(bytes32 => Package) packages;

    /// @notice Emitted when a new package is registered
    event PackageRegistered(
        bytes32 indexed packageId,
        address indexed seller,
        string description,
        uint256 timestamp
    );

    /// @notice Emitted when a package status is updated
    event PackageStatusUpdated(bytes32 indexed packageId, PackageStatus status);

    /// @dev Modifier to restrict function access to the package seller
    modifier onlySeller(bytes32 packageId) {
        require(packages[packageId].seller == msg.sender, "Package status update restricted to seller!");
        _;
    }

    /// @dev Modifier to restrict function access to the package consumer
    modifier onlyConsumer(bytes32 packageId) {
        require(packages[packageId].consumer == msg.sender, "Package status update restricted to consumer!");
        _;
    }

    /// @dev Modifier to allow cancellation by either the seller or the consumer
    modifier canCancel(bytes32 packageId) {
        require(
            packages[packageId].consumer == msg.sender || packages[packageId].seller == msg.sender,
            "Package cancellation restricted!"
        );
        _;
    }

    /// @notice Registers a new package
    /// @param description Description of the package
    /// @param hashedSecretCode Secret code hash used for package opening
    function registerPackage(
        string memory description,
        bytes32 hashedSecretCode
    ) public {
        uint256 timestamp = block.timestamp;
        bytes32 packageId = keccak256(abi.encodePacked(msg.sender, description, timestamp));

        packages[packageId] = Package({
            packageId: packageId,
            seller: payable(msg.sender),
            consumer: payable(address(0)),
            description: description,
            timestamp: timestamp,
            hashedSecretCode: hashedSecretCode,
            status: PackageStatus.Created
        });

        emit PackageRegistered(packageId, msg.sender, description, timestamp);
    }

    /// @dev Internal function to update the status of a package
    /// @param packageId The unique identifier of the package
    /// @param newStatus The new status to assign to the package
    function updatePackageStatus(bytes32 packageId, PackageStatus newStatus) internal {
        packages[packageId].status = newStatus;
        emit PackageStatusUpdated(packageId, newStatus);
    }

    /// @notice Locks the shipping fee for the package
    /// @dev This is called by the consumer to lock the fee and set consumer details
    /// @param packageId The unique identifier of the package
    function lockFee(bytes32 packageId) external {
        require(packages[packageId].status == PackageStatus.Created, "Cannot lock fee; Package must be marked as \"Created!\"");
        packages[packageId].consumer = payable(msg.sender);
        updatePackageStatus(packageId, PackageStatus.FeeLocked);
    }

    /// @notice Marks the package as shipped
    /// @dev Only the seller can call this function
    /// @param packageId The unique identifier of the package
    function ship(bytes32 packageId) external onlySeller(packageId) {
        require(packages[packageId].status == PackageStatus.FeeLocked, "Cannot ship; No fee locked for this package!");
        updatePackageStatus(packageId, PackageStatus.Shipped);
    }

    /// @notice Cancels the package transaction
    /// @dev Can be called by either the seller or the consumer when conditions allow
    /// @param packageId The unique identifier of the package
    function cancel(bytes32 packageId) external canCancel(packageId) {
        require(
            packages[packageId].status == PackageStatus.Created || packages[packageId].status == PackageStatus.FeeLocked
            || packages[packageId].status == PackageStatus.Shipped,
            "Cannot cancel; Package must be marked as \"Created\", \"FeeLocked\" or \"Shipped\"!"
        );
        updatePackageStatus(packageId, PackageStatus.Canceled);
    }

    /// @notice Opens the package after verifying the secret code
    /// @dev Only the consumer can call this function
    /// @param packageId The unique identifier of the package
    /// @param hashedSecretCode The hashed secret code provided by the consumer
    function open(bytes32 packageId, bytes32 hashedSecretCode) external onlyConsumer(packageId) {
        require(packages[packageId].status == PackageStatus.Shipped, "Cannot open; Package must be marked as \"Shipped!\"");
        require(packages[packageId].hashedSecretCode == hashedSecretCode, "Cannot open; Incorrect secret code!");
        updatePackageStatus(packageId, PackageStatus.Received);
    }

    /// @notice Retrieves package details
    /// @dev Access limited to seller and consumer for privacy
    /// @param packageId The unique identifier of the package
    /// @return Package memory struct containing package details
    function getPackage(bytes32 packageId) public view canCancel(packageId) returns (Package memory) {
        return packages[packageId];
    }

    /// @notice Returns the current status of a package
    /// @param packageId The unique identifier of the package
    /// @return PackageStatus enum value representing the current package status
    function getPackageStatus(bytes32 packageId) public view returns (PackageStatus) {
        return packages[packageId].status;
    }

    /// @notice Returns the address of the package consumer
    /// @param packageId The unique identifier of the package
    /// @return Address of the consumer
    function getPackageConsumer(bytes32 packageId) public view returns (address payable) {
        return packages[packageId].consumer;
    }

    /// @notice Returns the address of the package seller
    /// @param packageId The unique identifier of the package
    /// @return Address of the seller
    function getPackageSeller(bytes32 packageId) public view returns (address payable) {
        return packages[packageId].seller;
    }

    /// @notice Returns the hashed secret code of the package
    /// @dev Access restricted to seller and consumer for privacy
    /// @param packageId The unique identifier of the package
    /// @return Bytes32 hash of the secret code
    function getPackageCode(bytes32 packageId) public view canCancel(packageId) returns (bytes32) {
        return packages[packageId].hashedSecretCode;
    }

    /// @notice Checks if the package is canceled
    /// @param packageId The unique identifier of the package
    /// @return Boolean indicating if the package is canceled
    function isCanceled(bytes32 packageId) public view returns (bool) {
        return packages[packageId].status == PackageStatus.Canceled;
    }

    /// @notice Checks if the package is received
    /// @param packageId The unique identifier of the package
    /// @return Boolean indicating if the package is received
    function isReceived(bytes32 packageId) public view returns (bool) {
        return packages[packageId].status == PackageStatus.Received;
    }
}

/// @title Supply Chain Management (SCM) Contract
/// @notice This contract handles payments and refunds for packages within the supply chain system 
/// @dev This contract interacts with PackageRegistry to manage package states and ensure secure payment processing
contract SCM {

    // Reference to the PackageRegistry contract for accessing package data
    PackageRegistry public packageRegistry;

    /// @notice Constructor initializes the SCM contract with the address of the PackageRegistry
    /// @param packageRegistryAddress Address of the deployed PackageRegistry contract
    constructor(address packageRegistryAddress) {
        packageRegistry = PackageRegistry(packageRegistryAddress);
    }

    // Mapping to keep track of locked shipping fees for each package
    mapping(bytes32 => uint256) public lockedShippingFees;

    // Events to log activities related to shipment fees, refunds, and payments
    event ShipmentFeeLocked(bytes32 indexed packageId, address indexed consumer, uint256 amount);
    event RefundIssued(bytes32 indexed packageId, address indexed consumer, uint256 amount);
    event PaymentIssued(bytes32 indexed packageId, address indexed seller, uint256 amount);

    /// @notice Locks a shipping fee for a specified package
    /// @dev This function transfers ETH to the contract and updates the package status in PackageRegistry
    /// @param packageId The unique ID of the package for which the fee is locked
    function lockShippingFee(bytes32 packageId) external payable {
        packageRegistry.lockFee(packageId);        
        lockedShippingFees[packageId] = msg.value;  // Store the fee amount for the package
        emit ShipmentFeeLocked(packageId, msg.sender, msg.value);
    }

    /// @notice Allows the consumer to request a refund if the package is canceled
    /// @dev Checks that the caller is the consumer and that the package is in the Canceled state
    /// @param packageId The unique ID of the package for which the refund is requested
    function requestRefund(bytes32 packageId) external {
        require(lockedShippingFees[packageId] > 0, "No fee locked for this package");

        // Ensure that only the consumer can request a refund
        address payable consumer = packageRegistry.getPackageConsumer(packageId);
        require(consumer == msg.sender, "Only the consumer can ask for refund!");

        // Ensure the package is canceled before issuing a refund
        require(packageRegistry.isCanceled(packageId), "Package must be marked as Canceled for refund");

        uint256 refundAmount = lockedShippingFees[packageId];
        lockedShippingFees[packageId] = 0;  // Clear the locked fee
        consumer.transfer(refundAmount);    // Transfer the refund amount to the consumer

        emit RefundIssued(packageId, consumer, refundAmount);
    }

    /// @notice Allows the seller to request payment upon successful package delivery
    /// @dev Ensures the caller is the seller and the package is marked as Received
    /// @param packageId The unique ID of the package for which payment is requested
    function requestPayment(bytes32 packageId) external {
        require(lockedShippingFees[packageId] > 0, "No fee locked for this package");

        // Ensure that only the seller can initiate the payment
        address payable seller = packageRegistry.getPackageSeller(packageId);
        require(seller == msg.sender, "Only the seller can initiate payment!");

        // Ensure the package is in the Received state before releasing payment
        require(packageRegistry.isReceived(packageId), "Package must be marked as Received!");

        uint256 deliveryAmount = lockedShippingFees[packageId];
        lockedShippingFees[packageId] = 0;  // Clear the locked fee
        payable(seller).transfer(deliveryAmount);  // Transfer the payment amount to the seller

        emit PaymentIssued(packageId, seller, deliveryAmount);
    }
}


