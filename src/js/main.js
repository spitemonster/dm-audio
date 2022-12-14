import * as Tone from 'tone'

const caveUrl = new URL('../audio/cave.m4a', import.meta.url)

console.log(caveUrl)

const cave = new Tone.Player(caveUrl.href)

const range = document.querySelector('input[type="range"]')

const filter = new Tone.Filter({
    frequency: 1000,
    q: 2,
    type: 'lowpass',
}).toDestination()

cave.connect(filter)

cave.loop = true
cave.autostart = true

range.addEventListener('change', (e) => {
    filter.set({
        frequency: range.value,
    })
})
//attach a click listener to a play button
document.querySelector('button')?.addEventListener('click', async () => {
    await Tone.start()
})
