import { pendingGameStore } from '../../store/pendingGameStore.js'
import { gameStore } from '../../store/gameStore.js'

export const lobbyStateEndpoint = (req, res) => {
    console.log(`Lobby state request: ${JSON.stringify(req.body)}`)

    let currGame
    try {
        currGame = gameStore.get(req.body.code)
    } catch (err) {
        // Ignore any errors thrown by gameStore if code is missing
        currGame = null
    }

    // If no started games found
    if (currGame == null) {
        try {
            currGame = pendingGameStore.get(req.body.code)
        } catch (err) {
            // Ignore any errors thrown by pendingGameStore if code is missing
            currGame = null
        }

        // Return 404 if game object is null or undefined
        if (currGame == null) {
            res.sendStatus(404)
        } else {
            res.json({ ...currGame, started: false })
        }
    } else {
        res.json({ ...currGame, started: true })
    }
}
