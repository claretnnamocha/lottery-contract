pragma solidity 0.4.17;

contract Lottery {
    address private manager;
    
    address[] private players;
    
    uint private purse;

    function Lottery() public{
        manager = msg.sender;
    }

    function getManager() public view returns (address) {
        return manager;
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

    function getPlayerCount() public view returns (uint) {
        return players.length;
    }
    
    function enter() public payable{
        // Must send exactly 1 ether
        require(msg.value > 1 ether);
        
        // Manager cannot enter lottery competition
        require(msg.sender != manager);
        
        players.push(msg.sender);
    }
    
    function pickWinner() restricted public {
        uint rand =  uint(keccak256(block.difficulty, now, players));
        uint index = rand % players.length;
        address winner = players[index];
        
        // send balance to the winner 😎
        winner.transfer(this.balance);
        
        // Reset lottery
        players = new address[](0);
    }
    
    modifier restricted(){
        
        require(msg.sender == manager);
        _;
    }
}
