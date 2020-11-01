import { generateGameCode } from '../../game/gameCode.js'
import { PendingGame } from '../../game/pendingGame.js'
import { pendingGameStore } from '../../store/pendingGameStore.js'
import { buildPath } from './pathBuilder.js'

/*
    This controller should:
        - Call generateGameCode to get a new game code
        - Add the new game to the pendingGameStore
        - Redirect the user to the enter_name.html with the game code as a query parameter
        - Log a message to the console to record that a new game was created
*/
export const newGameController = (req, res) => {
    const code = generateGameCode()

    pendingGameStore.add(code, new PendingGame(code))
    const returnUrl = buildPath('/enter_name.html', { game: code, host: 1 })

    res.redirect(returnUrl)

    console.log(`New Game created: ${JSON.stringify(req.body)}`)
}
