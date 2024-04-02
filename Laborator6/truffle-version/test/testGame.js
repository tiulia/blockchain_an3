const Game = artifacts.require('Game');
const Attacker = artifacts.require('Attacker');
const Token = artifacts.require('Token');

contract('Game', (accounts) => {
  let gameInstance;
  let ercInstance;
  const dealer = accounts[0];
  const attacker = accounts[1];
  const player = accounts[2];
  const maxGames = 2; 
  const tokens = 30;
  const startStake = 5;
  const gameReward = 10;
  const maxPlayers = 3;
  beforeEach(async () => {
    gameInstance = await Game.new(maxGames, {from: dealer} ); // Deploy Game contract with a maximum of 10 games
    ercInstance = await Token.new(tokens, {from: dealer});
  });

  it("should start and join game successfully, attacker stops game 1", async () => {  
    attackerInstance = await Attacker.new(gameInstance.address, 1, { from: attacker }); // Deploy Attacker with Game contract address as constructor argument
    await ercInstance.transfer(gameInstance.address, tokens, {from: dealer})
    // Start game 0 from dealer

    await gameInstance.startGame(startStake, gameReward, ercInstance.address, { from: dealer });

    // Start game 1 from dealer
    await gameInstance.startGame(startStake, gameReward, ercInstance.address, { from: dealer });

    // Join game from attacker 

    await gameInstance.joinGame(0, { from: attacker, value: startStake});

    // Join game from player 
    await gameInstance.joinGame(0, { from: player, value: startStake });

    await attackerInstance.joinGame(0,{ from: attacker, value: startStake });


    await gameInstance.round(0, { from: dealer });
    await gameInstance.endGame(0, { from: dealer });

    const gameEnded0 = await gameInstance.gameEnded(0);
    assert.equal(gameEnded0, true, "Game has not ended");
  
    const gameEnded1 = await gameInstance.gameEnded(1);
    assert.equal(gameEnded1, true, "Game has not ended");
  
   
  });

});
