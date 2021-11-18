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

    function getBalance() public view returns (uint256) {
        return this.balance / 1 ether;
    }

    function enter() public payable isNotOwner {
        // Must send a multiple of 0.0001 ether
        // Tickets are at a unit price of  0.0001 ether
        require(msg.value % (0.0001 ether) == 0);

        uint256 g = msg.value / (0.0001 ether);

        while (g > 0) {
            players.push(msg.sender);
            g = g - 1;
        }
    }

    function pickWinner() public isOwner {
        uint256 rand = uint256(keccak256(block.difficulty, now, players));
        uint256 index = rand % players.length;

        address winner = players[index];

        // wins is 90% of balance
        uint256 wins = ((this.balance) * 9) / 10;

        // owner commission of 10% goes to owner 😁
        uint256 commission = this.balance - wins;

        winner.transfer(wins);
        manager.transfer(commission);

        // Reset lottery
        players = new address[](0);
    }

    modifier isOwner() {
        require(msg.sender == manager);
        _;
    }

    modifier isNotOwner() {
        require(msg.sender != manager);
        _;
    }
}
