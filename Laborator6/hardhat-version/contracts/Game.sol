// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.18;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/*
interface IERC20 {

    function totalSupply() external view returns (uint);
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
    function approve(address spender, uint amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint amount) external returns (bool);

    function who(address sender) external returns(address);

    event Transfer(address indexed from, address indexed to, uint vsalue);
    event Approval(address indexed owner, address indexed spender, uint value);
}
*/


contract Token is ERC20 {

    constructor(uint tokens) ERC20("game token", "GTA") payable{
        _mint(msg.sender, tokens);
    }

}



contract Game{

    event StartGame(address indexed dealer, uint gameId, uint gameStake);
    event EndGame(address indexed dealer, uint gameId);
    event JoinGame(address indexed player, address dealer, uint gameId);
    event Round(address indexed palyer, uint indexed gameId, uint card);


    modifier canSendReward(address _erc20Token, uint256 _reward){
        require(IERC20(_erc20Token).balanceOf(address(this)) >= _reward, 'insufficient tokens!');
        _;
    }
    
    modifier onlyDealer(address _dealer, uint256 _gameId){
        require(gameParams[_gameId].dealer == _dealer, 'you are not the dealer!');
        _;
    }

    uint256 public gameId;
    uint256 public maxGameId;
    uint256 public maxPlayersG = 10;

    struct GameState {
        uint256 stake; //player's deposit
        uint256 totalInHand; //player's cards
    }

    struct GameParams {
        address dealer;
        uint256 gameReward;
        uint256 gameStake;
        uint256 nrPlayers;
    }

    //each game has an Id and each player has a gameState for each game he plays.
    //gameStates[0][player].totalInHand cards of player in game 0
    mapping(uint256 => mapping (address => GameState)) public gameStates;
    
    //gamePlayers[0] the list of players for game 0 
    mapping(uint256 => address[]) gamePlayers;

    //type of token used by games as rewards, the address of a token of type ERC20 
    mapping(uint256 => address) public gameToken;

    mapping(uint256 => GameParams) public gameParams;

    mapping(uint256 => bool) public gameEnded;

    constructor(uint256 _maxGames) {
        gameId = 0;
        maxGameId = _maxGames;
    }


    /**
    * @dev A dealer (msg.sender) can start a Game if the contract can transfer reward tokens
    * of type erc20Token to all players that will join the game.
    * @param erc20Token address of the ERC20 token for reward tokens.
    * @param _gameReward each player will receive _gameReward tokens at the end of the game.
    * @param _gameStake each player should send _gameStake wei to join the game.
    */

    function startGame(uint256 _gameStake, uint256 _gameReward, address  erc20Token) canSendReward(erc20Token, _gameReward) public payable {
        require (gameId < maxGameId);
        GameParams storage _gameParams = gameParams[gameId];
        _gameParams.dealer = msg.sender;
        _gameParams.gameReward = _gameReward;
        _gameParams.gameStake = _gameStake;
        _gameParams.nrPlayers = 0;
        gameToken[gameId] = erc20Token;

        emit StartGame(msg.sender, gameId, gameParams[gameId].gameStake);
        gameId++;
        
    }


    function joinGame(uint256 _gameId) public payable{
        require(gameParams[_gameId].gameStake == msg.value, 'incorrect stake');  
        emit JoinGame(msg.sender, gameParams[_gameId].dealer, _gameId);
        gameStates[_gameId][msg.sender].stake = msg.value;
        gameStates[_gameId][msg.sender].totalInHand = 0;
        gameParams[_gameId].nrPlayers = gameParams[_gameId].nrPlayers+1;
        address[] storage _gamePlayers = gamePlayers[_gameId];
        _gamePlayers.push(msg.sender);
    }

    function round(uint256 _gameId) public onlyDealer(tx.origin, _gameId){
        uint8 i = 0;
        address player;
        while (i < gameParams[_gameId].nrPlayers) {
            player = gamePlayers[_gameId][i];
            gameStates[_gameId][player].totalInHand += uint(keccak256(abi.encodePacked(block.timestamp,_gameId, tx.origin))) % 15;
            emit Round(player, _gameId, gameStates[_gameId][player].totalInHand );
            i++;
        }
    }


    /**
    * @dev Winners receive reward tokens, while all players are refunded half of their stake. 
    Additionally, winners receive a full refund.  
    */

    function endGame(uint256 _gameId) public onlyDealer(tx.origin, _gameId){
        uint8 i = 0;
        uint256 max = 0;
        address player;
        while (i < gamePlayers[_gameId].length) {
            player = gamePlayers[_gameId][i];
            if (gameStates[_gameId][player].totalInHand > max)
                max = gameStates[_gameId][player].totalInHand;
            i++;    
        }

        i = 0;
        while (i < gamePlayers[_gameId].length) {
            player = gamePlayers[_gameId][i];
            if (max == gameStates[_gameId][player].totalInHand){
                IERC20(gameToken[_gameId]).transfer(player, gameParams[_gameId].gameReward);
                (bool sent, ) = payable(player).call{value:gameStates[_gameId][player].stake}("");
                require(sent, "Failed to send Ether");
            }
            else{
                (bool sent, ) = payable(player).call{value:gameStates[_gameId][player].stake/2}("");
                require(sent, "Failed to send Ether");
            }
            i++;    
        }

        gameEnded[_gameId] = true;
        emit EndGame(tx.origin, _gameId);
    }
    
}