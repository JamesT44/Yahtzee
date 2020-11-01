import { pendingGameStore } from '../../store/pendingGameStore.js'
import { buildPath } from './pathBuilder.js'

/*
    Assume that the body of the request has form:
        { game: code }

    This controller should:
        - Get the pending game with the correct code from the pendingGameStore
        - Check that the game exists
        - If it exists, redirect the user to enter_name.html with the game code as a query parameter
        - Log a message to the console to record that a player requested to join the game
*/
export const joinGameController = (req, res) => {
    const code = req.body.code

    if (pendingGameStore.get(code) == null) {
        res.sendStatus(404)
    } else {
        const returnUrl = buildPath('/enter_name.html', { game: code, host: 0 })
        // generates: /lobby.html?game=code

        res.redirect(returnUrl)

        console.log(`Game Code Entered: ${JSON.stringify(req.body)}`)
    }
}
