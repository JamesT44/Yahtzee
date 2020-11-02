import { diceScoreCalculator } from './diceScoreCalculator.js'
import { scoringCategories } from './categories.js'

class PossibleScoreCalculator {
    allPossibleScores(scorecard, dice) {
        const availableCategories = scoringCategories.filter((c) => {
            return scorecard.scores[c] === null
        })
        return availableCategories.reduce((possScores, cat) => {
            possScores[cat] = diceScoreCalculator.getScoreForCategory(dice, cat)
            return possScores
        }, {})
    }
}

export const possibleScoreCalculator = new PossibleScoreCalculator()
