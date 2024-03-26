// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


contract Pausable {
    event Paused();
    event Unpaused();

    bool public paused = false;


    modifier whenNotPaused() {
        require(!paused, "Pausable: Contract paused");
        _;
    }

    modifier whenPaused() {
        require(paused, "Pausable: Contract not paused");
        _;
    }

    function pause() public virtual whenNotPaused {
        paused = true;
        emit Paused();
    }

    function unpause() public virtual whenPaused {
        paused = false;
        emit Unpaused();
    }
}
