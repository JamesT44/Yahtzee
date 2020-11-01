import { getPageQueryParameters } from './util/queryParameters.js'

window.onload = () => {
    const code = getPageQueryParameters().game
    const elem1 = document.getElementById('code')
    elem1.value = code
    const isHost = getPageQueryParameters().host
    const elem2 = document.getElementById('host')
    elem2.value = isHost
    console.log(`Joining game with code: ${code}`)
}
