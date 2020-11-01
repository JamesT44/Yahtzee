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

const UpdateDice = (diceValues) => {
    for (let i = 0; i < diceValues.length; i++) {
        const img = document.getElementById(`dice-${i}`)
        img.src = './images/dice_' + diceValues[i] + '.png'
    }
}

const postMove = async (move) => {
    await apiMessageSender.post('/move', move)
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
        const gameState = await receiveGameState(code)
        // const gameState = generateTestGame()
        if (updateKeptDice) {
            postMove({
                game: code,
                player: player,
                keep: diceToKeep,
                roll: false,
                score: null,
            })

            updateKeptDice = false
        }
        updatePageWithNewState(gameState, player)
        pollGameState(code, player)
    }, 500)
}

let diceToKeep = []
let updateKeptDice = false

const toggleDice = (diceIndex) => {
    console.log(`Toggled dice${diceIndex}`)
    if (diceToKeep.includes(diceIndex)) {
        diceToKeep = diceToKeep.filter((val) => val !== diceIndex)
    } else {
        diceToKeep.push(diceIndex)
    }
    updateKeptDice = true
}

window.onload = () => {
    const { name: player, game: code } = getPageQueryParameters()
    const buttons = document.getElementsByClassName('dice_button')

    initializeTable(code, player)
    pollGameState(code, player)
}

const updateScorecards = (
    scorecards,
    players,
    currentPlayer,
    currentTurn,
    canScore
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
                computedCategories.includes(category)
        }
    }
}

const updateDice = (dice, diceKept) => {
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
    }
}

const updatePageWithNewState = (state, player) => {
    updateScorecards(
        state.scorecards,
        state.players,
        player,
        state.currentPlayer
    )
    updateDice(state.currentDice, state.diceKept)
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

// const DiceButton = (diceValue) => {}
