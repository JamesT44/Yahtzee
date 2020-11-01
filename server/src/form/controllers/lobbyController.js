import { pendingGameStore } from '../../store/pendingGameStore.js'
import { gameStore } from '../../store/gameStore.js'
import { Game } from '../../game/game.js'
import { buildPath } from './pathBuilder.js'

/*
    Assume that the body of the request has form:
        { player: name, game: code }

    This controller should:
        - Get the pending game with the correct code from the pendingGameStore
        - Create a new game from this pending game
        - Remove the pending game from the pendingGameStore
        - Add the new game to the gameStore
        - Redirect the user to game.html with the name and game code as query parameters
        - Log a message to the console to record that the game was started
*/
export const lobbyController = (req, res) => {
    const code = req.body.code

    pendingGameStore.remove(code)

    gameStore.add(code)

    const returnUrl = buildPath('/game.html', {
        game: code,
        name: req.body.name,
    })
    console.log(`Game started: ${JSON.stringify(req.body)}`)
}
