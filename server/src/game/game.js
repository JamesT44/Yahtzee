import { Scorecard } from './scorecard.js'
import { possibleScoreCalculator } from './possibleScoreCalculator.js'
import { scoringCategories } from './categories.js'

export class Game {
    constructor(code, players) {
        this.code = code
        this.players = players
        this.currentPlayer = players[0]
        this.currentPlayerCounter = 0
        this.rollsRemaining = 3
        this.currentDice = [1, 2, 3, 4, 5]
        this.diceKept = []
        this.scorecards = {}

        for (const key of this.players) {
            this.scorecards[key] = new Scorecard()
        }
    }

    canKeep() {
        return this.rollsRemaining < 3 && this.rollsRemaining > 0
    }

    keepDice(diceToKeep) {
        this.diceKept = [...diceToKeep]
    }

    canRoll() {
        return this.rollsRemaining > 0
    }

    rollDice() {
        for (let i = 0; i < 5; i++) {
            if (!this.diceKept.includes(i)) {
                this.currentDice[i] = Math.floor(Math.random() * 6) + 1
            }
        }
        this.rollsRemaining--
    }

    canScore() {
        return this.rollsRemaining < 3
    }

    possibleScores() {
        if (!this.canScore()) {
            return null
        }
        return possibleScoreCalculator.allPossibleScores(
            this.scorecards[this.currentPlayer],
            this.currentDice
        )
    }

    scoreInCategory(category) {
        let thisScorecard = this.scorecards[this.currentPlayer]
        console.log(thisScorecard)

        const score = this.possibleScores()[category]
        thisScorecard.scores[category] = score

        this.currentPlayerCounter++
        this.currentPlayerCounter %= this.players.length
        this.currentPlayer = this.players[this.currentPlayerCounter]
        this.rollsRemaining = 3
        this.currentDice = [1, 2, 3, 4, 5]
        this.diceKept = []
    }

    winner() {
        let maxScore = 0
        let winner = ''
        for (const player of this.players) {
            console.log(this.scorecards[player].overallTotal())
            for (const category of scoringCategories) {
                if (this.scorecards[player].scores[category] === null) {
                    return null
                }
            }
            if (this.scorecards[player].overallTotal() > maxScore) {
                maxScore = this.scorecards[player].overallTotal()
                winner = player
            }
        }
        return winner
    }

    toJSON() {
        const json = {}

        json.code = this.code
        json.players = this.players
        json.currentPlayer = this.currentPlayer
        json.rollsRemaining = this.rollsRemaining
        json.currentDice = this.currentDice
        json.diceKept = this.diceKept
        json.scorecards = this.scorecards
        json.canKeep = this.canKeep()
        json.canRoll = this.canRoll()
        json.canScore = this.canScore()
        json.possibleScores = this.possibleScores()
        json.winner = this.winner()

        return json
    }
}
