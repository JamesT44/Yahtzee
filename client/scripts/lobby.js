import { getPageQueryParameters } from './util/queryParameters.js'
import { apiMessageSender } from './api/apiMessageSender.js'

const receiveLobbyState = async (code) => {
    const state = await apiMessageSender.post('/lobby_state', {
        code: code,
    })
    console.log(state)
    return state
}

const pollLobbyState = (code) => {
    console.log('Polling lobby state')
    setTimeout(async () => {
        const lobbyState = await receiveLobbyState(code)
        const newListOfPlayers = lobbyState.players
        for (let i = 0; i < newListOfPlayers.length; i++) {
            const playerCells = document.getElementsByClassName('PlayerName')[i]
            playerCells.innerHTML = `${newListOfPlayers[i]}`
        }
        pollLobbyState(code)
    }, 500)
}

window.onload = () => {
    const code = getPageQueryParameters().game
    const elem = document.getElementById('code')
    elem.innerHTML = 'Code: ' + code
    console.log(`Code: ${code}`)
    pollLobbyState(code)
}
