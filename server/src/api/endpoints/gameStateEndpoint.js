import { Game } from '../../game/game.js'
import { Scorecard } from '../../game/scorecard.js'
import { gameStore } from '../../store/gameStore.js'

/*
    Assume that the body of the request has form:
        { game: code }
    
    This endpoint should:
        - Find the correct game from the gameStore
        - Return 404 Not Found if the game can't be located
        - Otherwise, return the current state of the game as json
*/
export const gameStateEndpoint = (req, res) => {
    // const game = new Game('0000', ['Player1', 'Player2'])
    // game.rollsRemaining = 2
    // game.currentDice = [1, 2, 3, 4, 5]
    // game.diceKept = [2]
    // game.currentPlayer = 'Player1'
    // game.scorecards[game.currentPlayer].scores['ones'] = 5
    // res.json(game)

    console.log(`Game state request: ${JSON.stringify(req.body)}`)

    let currGame
    try {
        currGame = gameStore.get(req.code)
    } catch (err) {
        // Ignore any errors thrown by gameStore if code is missing
        currGame = null
    }

    // Return 404 if game object is null or undefined
    if (currGame == null) {
        res.sendStatus(404)
    } else {
        res.json(currGame)
    }
}
