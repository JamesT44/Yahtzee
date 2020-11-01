import { getPageQueryParameters } from './util/queryParameters.js'

window.onload = () => {
    const code = getPageQueryParameters().game
    const element = document.getElementById('code')
    element.value = code
    console.log(`Joining game with code: ${code}`)
}
