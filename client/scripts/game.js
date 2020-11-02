import { apiMessageSender } from './api/apiMessageSender.js'
import { getPageQueryParameters } from './util/queryParameters.js'

const orderedCategories = [
    'ones',
    'twos',
    'threes',
    'fours',
    'fives',
    'sixes',
    'topHalfSum',
    'bonus',
    'topHalfTotal',
    'threeOfAKind',
    'fourOfAKind',
    'fullHouse',
    'lowStraight',
    'highStraight',
    'yahtzee',
    'chance',
    'bottomHalfTotal',
    'overallTotal',
]

const computedCategories = [
    'topHalfSum',
    'bonus',
    'topHalfTotal',
    'bottomHalfTotal',
    'overallTotal',
]

const generateTestGame = () => {
    const gameState = {
        code: '1023',
        players: ['name1', 'name2', 'name3'],
        currentPlayer: 'name1',
        currentDice: [1, 2, 3, 4, 5],
        diceKept: [1],
        scorecards: {},
    }
    for (const player of gameState.players) {
        gameState.scorecards[player] = {}
        for (const category of orderedCategories) {
            gameState.scorecards[player][category] = Math.trunc(
                Math.random() * 10
            )
        }
    }
    return gameState
}

const postMove = async (move) => {
    await apiMessageSender.post('/move', move).catch((err) => {})
}

const receiveGameState = async (code) => {
    const state = await apiMessageSender.post('/game_state', {
        game: code,
    })

    return state
}

const initializeTable = async (code, thisPlayer) => {
    console.log('Initializing table')
    const gameState = await receiveGameState(code)
    // const gameState = generateTestGame()
    for (const player of gameState.players) {
        ;[...document.getElementsByTagName('tr')].forEach((row, i) => {
            const span = document.createElement('span')
            const cell = document.createElement(i ? 'td' : 'th')
            if (i) {
                const button = document.createElement('button')
                button.classList.add('category-button')
                button.classList.add('player-' + player)
                button.classList.add(orderedCategories[i - 1])
                button.addEventListener('click', (e) =>
                    scoreCategory(e, orderedCategories[i - 1], code, thisPlayer)
                )
                button.textContent = '-'
                if (computedCategories.includes(orderedCategories[i - 1])) {
                    button.classList.add('computed')
                    button.textContent = '0'
                    button.disabled = true
                }
                if (player !== thisPlayer) {
                    button.disabled = true
                }
                span.appendChild(button)
            } else {
                span.textContent = player
            }
            cell.appendChild(span)
            row.appendChild(cell)
        })
    }
}

const pollGameState = async (code, player) => {
    setTimeout(async () => {
        let gameState = await receiveGameState(code)
        // const gameState = generateTestGame()
        if (updateKeptDice) {
            try {
                postMove({
                    game: code,
                    player: player,
                    keep: diceToKeep,
                    roll: false,
                    score: null,
                })
                gameState = await receiveGameState(code)
            } finally {
                updateKeptDice = false
            }
        }
        updatePageWithNewState(gameState, player)
        if (gameState.winner !== null) {
            console.log(`Game over: ${gameState.winner} won`)
            const rollButton = document.getElementById('roll_button')
            rollButton.style.visibility = 'hidden'

            let gameOverMsg = document.createElement('span')
            gameOverMsg.textContent = `Game Over. ${gameState.winner} won!`
            gameOverMsg.style.color = 'white'
            gameOverMsg.style.fontSize = '2em'
            rollButton.parentElement.insertBefore(gameOverMsg, rollButton)
            return
        }
        pollGameState(code, player)
    }, 50)
}

let diceToKeep = []
let updateKeptDice = false
let canKeep = false
let canScore = false
let prevRollsRemaining = 3

const toggleDice = (e, diceIndex) => {
    if (!canKeep) {
        return
    }
    console.log(`Toggled dice ${diceIndex}`)
    if (diceToKeep.includes(diceIndex)) {
        diceToKeep = diceToKeep.filter((val) => val !== diceIndex)
        e.currentTarget.classList.remove('kept')
    } else {
        diceToKeep.push(diceIndex)
        e.currentTarget.classList.add('kept')
    }
    updateKeptDice = true
}

const scoreCategory = (e, category, code, player) => {
    if (!canScore) {
        return
    }
    console.log(`Scored in category ${category}`)
    postMove({
        game: code,
        player: player,
        roll: false,
        score: category,
    })
}

const initCallbacks = (code, player) => {
    const diceButtons = document.getElementsByClassName('dice_button')
    Array.prototype.map.call(diceButtons, (button, i) => {
        button.addEventListener('click', (e) => toggleDice(e, i))
    })
    const rollButton = document.getElementById('roll_button')
    rollButton.addEventListener('click', () => {
        postMove({
            game: code,
            player: player,
            roll: true,
            category: null,
        })
    })
}

window.onload = () => {
    const { name: player, game: code } = getPageQueryParameters()
    initCallbacks(code, player)
    initializeTable(code, player)
    pollGameState(code, player)
}

const updateScorecards = (
    scorecards,
    players,
    currentPlayer,
    currentTurn,
    possibleScores
) => {
    for (const player of players) {
        for (const category of orderedCategories) {
            const cellValue = (scorecards[player][category] ?? '-').toString()
            const element = document.getElementsByClassName(
                `player-${player} ${category}`
            )[0]
            element.textContent = cellValue
            element.disabled =
                currentPlayer !== player ||
                currentPlayer !== currentTurn ||
                computedCategories.includes(category) ||
                possibleScores === null ||
                !(category in possibleScores)
            if (
                currentPlayer !== player ||
                computedCategories.includes(category) ||
                possibleScores === null ||
                !(category in possibleScores)
            ) {
                element.classList.remove('highlighted')
            } else {
                element.textContent = possibleScores[category]
                element.classList.add('highlighted')
            }
        }
    }
}

const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time))
}

const updateDice = async (dice, diceKept, rollsRemaining) => {
    if (rollsRemaining != prevRollsRemaining) {
        prevRollsRemaining = rollsRemaining
        for (let j = 0; j < 10; j++) {
            for (let i = 0; i < 5; i++) {
                if (diceKept.includes(i)) {
                    continue
                }
                const die = document.getElementById(`dice${i + 1}`)
                const curr = Number(die.src.split('_')[1][0])
                die.src = `./images/dice_${
                    ((curr + Math.floor(Math.random() * 5)) % 5) + 1
                }.png`
            }
            await sleep(20)
        }
    }
    for (let i = 0; i < 5; i++) {
        const die = document.getElementById(`dice${i + 1}`)
        die.src = `./images/dice_${dice[i]}.png`
        if (diceKept.includes(i)) {
            document.getElementById(`dice${i + 1}button`).classList.add('kept')
        } else {
            document
                .getElementById(`dice${i + 1}button`)
                .classList.remove('kept')
        }
        diceToKeep = diceKept
    }
}

const updatePageWithNewState = (state, player) => {
    updateScorecards(
        state.scorecards,
        state.players,
        state.currentPlayer,
        player,
        state.possibleScores
    )
    updateDice(state.currentDice, state.diceKept, state.rollsRemaining)
    canKeep = state.canKeep && state.currentPlayer == player
    canScore = state.canScore && state.currentPlayer == player
    document.getElementById('roll_button').style.visibility =
        state.canRoll && state.currentPlayer == player ? 'visible' : 'hidden'
    Array.prototype.map.call(
        document.getElementsByClassName('dice_button'),
        (elem) => {
            elem.style.visibility = state.canScore ? 'visible' : 'hidden'
        }
    )
}

/*
    - Make the dice buttons
    - Have an array containing a list of clicked dice
    - When you click, you add to the array; when you click again, you remove
    - When the player clicks "roll", we should post {
        roll: true,
        diceKept: [ ... ]
    } to /move endpoint by calling postMove()

*/
