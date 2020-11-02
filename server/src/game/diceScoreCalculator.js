import { diceCategoryChecker } from './diceCategoryChecker.js'

class DiceScoreCalculator {
    getScoreForCategory(dice, category) {
        return this[category](dice)
    }

    ones(dice) {
        return dice.filter((val) => val === 1).length
    }

    twos(dice) {
        return dice.filter((val) => val === 2).length * 2
    }

    threes(dice) {
        return dice.filter((val) => val === 3).length * 3
    }

    fours(dice) {
        return dice.filter((val) => val === 4).length * 4
    }

    fives(dice) {
        return dice.filter((val) => val === 5).length * 5
    }

    sixes(dice) {
        return dice.filter((val) => val === 6).length * 6
    }

    threeOfAKind(dice) {
        return diceCategoryChecker.isThreeOfAKind(dice)
            ? dice.reduce((a, b) => a + b, 0)
            : 0
    }

    fourOfAKind(dice) {
        return diceCategoryChecker.isFourOfAKind(dice)
            ? dice.reduce((a, b) => a + b, 0)
            : 0
    }

    fullHouse(dice) {
        return diceCategoryChecker.isFullHouse(dice) ? 25 : 0
    }

    lowStraight(dice) {
        return diceCategoryChecker.isLowStraight(dice) ? 30 : 0
    }

    highStraight(dice) {
        return diceCategoryChecker.isHighStraight(dice) ? 40 : 0
    }

    yahtzee(dice) {
        return diceCategoryChecker.isYahtzee(dice) ? 50 : 0
    }

    chance(dice) {
        return dice.reduce((a, b) => a + b, 0)
    }
}

export const diceScoreCalculator = new DiceScoreCalculator()
