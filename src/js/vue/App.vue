<template>
    <div class="dm-audio" ref="dmAudio">
        <label>
            <select name=""></select>
        </label>
        <div class="channel-wrap">
            <AudioChannel v-for="asset in state.assets" :asset="asset" />

            <p v-for="asset in assets">Asset</p>
        </div>

        <div class="setup-overlay">
            <button class="activate">Activate</button>
        </div>

        <AudioUpload @upload="handleUpload" />

        <AudioAssets :assets="state.assets" />

        <button @click="toggleUpload" class="add">
            <span>l</span>
            <span>l</span>
            <!-- <svg
                clip-rule="evenodd"
                fill-rule="evenodd"
                stroke-linejoin="round"
                stroke-miterlimit="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="m11 11h-7.25c-.414 0-.75.336-.75.75s.336.75.75.75h7.25v7.25c0 .414.336.75.75.75s.75-.336.75-.75v-7.25h7.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-7.25v-7.25c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
                    fill-rule="nonzero"
                />
            </svg> -->
        </button>
    </div>
</template>

<script setup lang="ts">
import type { Tone } from 'tone'
import type { AudioAsset } from '../types'
import type { AudioBlock } from '../types'
import type { Emitter } from 'mitt'
import { inject, onMounted, ref, reactive, watch } from 'vue'

const $tone: Tone = inject('$tone') as Tone
const $emitter: Emitter = inject('$emitter')

type State = {
    assets: Array<AudioAsset>
}

const state: State = reactive({
    assets: [],
})

const dmAudio = ref<HTMLElement>()

// let assets: Array<AudioAsset> = reactive([])

const localStorage: Storage = window.localStorage

const haveLocalAssets = localStorage.getItem('assets') != null

if (haveLocalAssets) {
    state.assets = JSON.parse(
        localStorage.getItem('assets') as string
    ) as Array<AudioAsset>
} else {
    state.assets = []
    localStorage.setItem('assets', JSON.stringify(state.assets))
}

watch(state.assets, (first, last) => {
    console.log('assets changed')
})

onMounted(() => {
    const button: HTMLButtonElement | null = document.querySelector('.activate')

    if (!button) {
        return
    }

    button.addEventListener('click', async () => {
        await $tone.start()

        // bad way of doing this but only temporary
        button.parentElement.parentElement.removeChild(button.parentElement)
    })

    $emitter.on('updateAsset', updateAsset)
    $emitter.on('upload', addAsset)
})

function registerAsset(asset: AudioAsset) {
    const localAssets = JSON.parse(
        localStorage.getItem('assets') as string
    ) as Array<AudioAsset>

    if (localAssets.find((e) => e.id == asset.id)) {
        console.log('local assets already contains')
    } else {
        localAssets.push(asset)
    }

    localStorage.setItem('assets', JSON.stringify(localAssets))
    state.assets = localAssets
}

function handleUpload(asset: AudioAsset) {
    registerAsset(asset)
}

function getLocalAsset(assetId: string): AudioAsset {}

function setLocalAsset(assetId: string): bool {}

function toggleUpload() {
    dmAudio.value?.classList.toggle('upload')
}

function updateAsset(asset: AudioAsset): void {
    let localAsset: AudioAsset = state.assets.find((a) => a.id == asset.id)

    localAsset = asset

    // update the asset in local storage

    localStorage.setItem('assets', JSON.stringify(state.assets))

    // update the asset's json file
    fetch('http://localhost:3000/asset', {
        method: 'PUT',
        body: JSON.stringify(asset),
    }).then((res) => {
        console.log('asset updated')
        console.log(res)
    })
}

function addAsset(asset: AudioAsset) {
    console.log('asset added', asset)
    state.assets.push(asset)

    localStorage.setItem('assets', JSON.stringify(state.assets))
    console.log('assets: ', state.assets)
}
</script>
