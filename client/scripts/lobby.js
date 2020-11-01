import { getPageQueryParameters } from './util/queryParameters.js'
import { apiMessageSender } from './api/apiMessageSender.js'

const receiveLobbyState = async (code) => {
    const state = await apiMessageSender.post('/lobby_state', {
        code: code,
    })
    return state
}

const pollLobbyState = (code) => {
    setTimeout(async () => {
        const lobbyState = await receiveLobbyState(code)
        const newListOfPlayers = lobbyState.players
        for (let i = 0; i < newListOfPlayers.length; i++) {
            const playerCells = document.getElementsByClassName('PlayerName')[i]
            playerCells.innerHTML = `${newListOfPlayers[i]}`
        }
        if (lobbyState.started) {
            document.getElementById('startgame-form').submit()
        }
        pollLobbyState(code)
    }, 500)
}

window.onload = () => {
    const code = getPageQueryParameters().game
    const player = getPageQueryParameters().player
    const isHost = Number(getPageQueryParameters().host)

    const elem = document.getElementById('code')
    elem.innerHTML = 'Code: ' + code

    const elem2 = document.getElementById('code-input')
    elem2.value = code

    const elem3 = document.getElementById('player-input')
    elem3.value = player

    const elem4 = document.getElementById('host-input')
    elem4.value = isHost

    if (!isHost) {
        const elem4 = document.getElementById('start-input')
        elem4.style.visibility = 'hidden'
    }

    console.log(`Waiting in lobby with code: ${code}`)
    pollLobbyState(code)
}
