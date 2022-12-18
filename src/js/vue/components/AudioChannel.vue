<template>
    <div class="audio-channel">
        <div class="audio-channel__label">
            <label>
                <input type="text" v-model="state.name" />
            </label>
        </div>
        <button @click="togglePlay">
            {{ state.isPlaying ? 'Stop' : 'Play' }}
        </button>
        <label>
            <input
                type="range"
                name="volume"
                @change="changeVolume"
                min="-30"
                max="6"
                value="0"
                orient="vertical"
            />
        </label>
        <label>
            <input
                type="range"
                name="cutoff"
                @change="changeCutoff"
                min="20"
                max="20000"
                value="20000"
            />
        </label>
        <div class="toggle-wrap">
            <button
                @click="toggleMute"
                class="toggle"
                :class="{ active: state.isMuted }"
                data-function="mute"
            >
                M
            </button>
            <button
                @click="toggleSolo"
                class="toggle"
                :class="{ active: state.isSoloed }"
                data-function="solo"
            >
                S
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { inject, onMounted, reactive } from 'vue'
import type { Tone, Player, Filter, Solo } from 'tone'

export interface Props {
    audioUrl: String
    player: Player
}

export interface Reactive {
    isPlaying: boolean
    isMuted: boolean
    isSoloed: boolean
    name: String
}

const props = defineProps<Props>()
const $tone: Tone = inject('$tone')

let state: Reactive = reactive({
    isPlaying: false,
    isMuted: false,
    isSoloed: false,
    name: 'Audio',
})

// locally scoped player
let player: Player
let filter: Filter
let solo: Solo

onMounted(() => {
    player = new $tone.Player({
        url: props.audioUrl,
        loop: true,
    })
    filter = new $tone.Filter({ type: 'lowpass', frequency: 20000 })
    solo = new $tone.Solo()

    player.connect(filter)
    filter.connect(solo)
    solo.toDestination()
})

function togglePlay() {
    if (state.isPlaying) {
        player.stop()
    } else {
        player.start(0)
    }

    state.isPlaying = !state.isPlaying
}

function changeVolume(e: Event) {
    const t: HTMLInputElement = e.target as HTMLInputElement

    player.set({
        volume: parseFloat(t.value),
    })
}

function changeCutoff(e: Event) {
    const t: HTMLInputElement = e.target as HTMLInputElement

    filter.set({
        frequency: parseFloat(t.value),
    })
}

function toggleMute() {
    state.isMuted = !state.isMuted
    player.set({
        mute: state.isMuted,
    })
}

function toggleSolo() {
    state.isSoloed = !state.isSoloed
    solo.set({
        solo: state.isSoloed,
    })
}
</script>
<style scoped lang="scss">
.audio-channel {
    background: #4e5863;
    border: 2px solid #c98c39;
    position: relative;
    width: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 6rem;
    color: white;
    text-align: center;

    padding: 1rem;
}

label {
    width: 100%;

    input {
        width: 100%;
    }
}

input[type='range'] {
    width: 100%;
}

input[type='range']::-webkit-slider-runnable-track,
input[type='range']::-moz-range-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    background: #3071a9;
    border-radius: 1.3px;
}

input[type='range'][orient='vertical']::-webkit-slider-runnable-track,
input[type='range'][orient='vertical']::-moz-range-track {
    height: 100%;
    width: 8.4px;
}

input[type='range']:focus::-webkit-slider-runnable-track {
    background: #367ebd;
}

input[type='range']::-ms-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
}
input[type='range']::-ms-fill-lower {
    background: #2a6495;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type='range']:focus::-ms-fill-lower {
    background: #3071a9;
}
input[type='range']::-ms-fill-upper {
    background: #3071a9;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type='range']:focus::-ms-fill-upper {
    background: #367ebd;
}

.toggle {
    &-wrap {
        display: flex;
        justify-content: space-between;
    }

    border: 1px solid black;
    border-radius: 3px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.75rem;

    padding: 0.25rem;

    width: 24px;
    aspect-ratio: 1/1;

    &.active {
        &[data-function='mute'] {
            background: red;
            color: white;
        }

        &[data-function='solo'] {
            background: yellow;
            color: black;
        }
    }
}
</style>
