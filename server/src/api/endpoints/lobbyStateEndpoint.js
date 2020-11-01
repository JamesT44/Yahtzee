import { pendingGameStore } from '../../store/pendingGameStore.js'

export const lobbyStateEndpoint = (req, res) => {
    console.log(`Lobby state request: ${JSON.stringify(req.body)}`)

    let currGame
    try {
        currGame = pendingGameStore.get(req.body.code)
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
