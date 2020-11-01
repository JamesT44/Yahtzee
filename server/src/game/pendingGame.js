export class PendingGame {
    constructor(code, host) {
        this.code = code
        this.players = []
        this.host = ''
    }

    addPlayer(name, isHost = false) {
        this.players.push(name)
        if (isHost) {
            this.host = name
        }
    }
}
