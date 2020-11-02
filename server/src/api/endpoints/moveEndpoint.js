import { gameStore } from '../../store/gameStore.js'
/*
    Assume that the body of the request has form:
        {
            game: code
            player: name
            keep: [dice]
            roll: true/false
            score: category or null
        }
    
    This endpoint should:
        - Check whether the request received is valid - if not, send 400 Bad Request
        - Find the game from the gameStore
        - Call the correct method on the game
        - Return 200 OK
*/
export const moveEndpoint = (req, res) => {
    console.log(`Move request: ${JSON.stringify(req.body)}`)

    let currGame
    try {
        currGame = gameStore.get(req.body.game)
    } catch (err) {
        // Ignore any errors thrown by gameStore if code is missing
        currGame = null
    }

    // Return 400 if game object is null or undefined
    if (currGame == null) {
        res.sendStatus(400)
        return
    }

    // Return 400 if it is not their turn
    if (currGame.currentPlayer !== req.body.player) {
        res.sendStatus(400)
        return
    }

    // Return 400 if the move is both of rolling and scoring
    if (req.body.roll && req.body.score) {
        res.sendStatus(400)
        return
    }

    if (!req.body.roll && !req.body.score) {
        // Return 400 if trying to mark dice to keep when no rolls are left
        if (!currGame.canRoll()) {
            res.sendStatus(400)
            return
        }
        currGame.keepDice(req.body.keep)
        console.log(`Kept dice`)
        res.sendStatus(200)
    } else if (req.body.roll) {
        // Return 400 if trying to roll when no rolls are left
        if (!currGame.canRoll()) {
            res.sendStatus(400)
            return
        }

        currGame.rollDice()
        console.log(`Rolled dice`)
        res.sendStatus(200)
    } else {
        // Return 400 if trying to score before rolling
        if (!currGame.canScore()) {
            res.sendStatus(400)
            return
        }

        currGame.scoreInCategory(req.body.score)
        console.log(`Scored in category ${req.body.score}`)
        res.sendStatus(200)
    }
}
