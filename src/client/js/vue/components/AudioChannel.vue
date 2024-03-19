<template>
    <div class="audio-channel">
        <div class="audio-channel__label">
            <label>
                <input type="text" v-model="props.asset.name" />
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
import type { AudioAsset } from '../../../../types'
import { inject, onMounted, reactive } from 'vue'
// Tone is sort of a pseudo type. don't fully understand this but it works
import type { Tone, Player, Filter, Solo } from 'tone'

export interface Props {
    asset: AudioAsset
}

export interface Reactive {
    isPlaying: boolean
    isMuted: boolean
    isSoloed: boolean
    name: string
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
let player: Player = new $tone.Player()
let filter: Filter
let solo: Solo

onMounted(() => {
    player.load(props.asset.url)
    player.loop = true

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
