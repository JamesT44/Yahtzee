import {
    scoringCategories,
    topHalfCategories,
    bottomHalfCategories,
    computedCategories,
} from './categories.js'

export class Scorecard {
    constructor() {
        this.scores = {}

        for (const category of scoringCategories) {
            this.scores[category] = null
        }
    }

    topHalfSum() {
        let topsum = 0
        for (const category of topHalfCategories) {
            topsum += this.scores[category]
        }
        return topsum
    }

    bonus() {
        return this.topHalfSum() < 63 ? 0 : 35
    }

    topHalfTotal() {
        return this.topHalfSum() + this.bonus()
    }

    bottomHalfTotal() {
        let bottomSum = 0
        for (const category of bottomHalfCategories) {
            bottomSum += this.scores[category]
        }
        return bottomSum
    }

    overallTotal() {
        return this.topHalfTotal() + this.bottomHalfTotal()
    }

    toJSON() {
        const json = { ...this.scores }

        for (let i = 0; i < computedCategories.length; i++) {
            let computedCategory = computedCategories[i]
            json[computedCategory] = this[computedCategory]()
        }
        return json
    }
}
