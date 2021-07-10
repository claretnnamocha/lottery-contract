pragma solidity 0.4.17;

contract Lottery {
    address private manager;

    address[] private players;

    function Lottery() public {
        manager = msg.sender;
    }

    function getManager() public view returns (address) {
        return manager;
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

    function getPlayerCount() public view returns (uint256) {
        return players.length;
    }

    function enter() public payable {
        // Must send exactly 1 ether
        require(msg.value >= 0.01 ether);

        // Manager cannot enter lottery competition
        require(msg.sender != manager);

        players.push(msg.sender);
    }

    function pickWinner() public restricted {
        uint256 rand = uint256(keccak256(block.difficulty, now, players));
        uint256 index = rand % players.length;
        address winner = players[index];

        // send balance to the winner 😎
        winner.transfer(this.balance);

        // Reset lottery
        players = new address[](0);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}
