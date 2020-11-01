import { pendingGameStore } from '../../store/pendingGameStore.js'
import { buildPath } from './pathBuilder.js'
/*
    Assume that the body of the request has form:
        { player: name, game: code }

    This controller should:
        - Get the pending game with the correct code from the pendingGameStore
        - Add a new player to the pending game with the correct name
        - Redirect the user to lobby.html with the name and game code as query parameters
        - Log a message to the console to record that a new player was added to this game
*/
export const enterNameController = (req, res) => {
    const name = req.body.name
    const code = req.body.code

    const pendingGame = pendingGameStore.get(code)
    pendingGame.addPlayer(name)

    const returnUrl = buildPath('/lobby.html', {
        player: name,
        game: code,
        allPlayers: pendingGame.players,
    })
    res.redirect(returnUrl)

    console.log(`New Player added to game: ${JSON.stringify(req.body)}`)
}
