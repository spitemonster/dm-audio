<template>
    <div class="dm-audio">
        <div class="channel-wrap">
            <AudioChannel v-for="player in players" :audioUrl="player.href" />
        </div>

        <div class="setup-overlay">
            <button class="activate">Activate</button>
        </div>

        <input type="file" @change="logFile" />
    </div>
</template>

<script setup lang="ts">
import type { Tone } from 'tone'
import { inject, onMounted } from 'vue'

const players: Array<URL> = [
    new URL('../../audio/cave.m4a', import.meta.url),
    new URL('../../audio/fire.m4a', import.meta.url),
]

const $tone: Tone = inject('$tone') as Tone

onMounted(() => {
    // this.$tone = Tone
    const button: HTMLButtonElement | null = document.querySelector('.activate')

    if (!button) {
        return
    }

    button.addEventListener('click', async () => {
        await $tone.start()

        // bad way of doing this but only temporary
        button.parentElement.parentElement.removeChild(button.parentElement)
    })
})

function logFile(e: Event) {
    console.log(e)
}
</script>

<style scoped>
.channel-wrap {
    display: flex;
    gap: 1rem;
    padding: 1rem;
}
.setup-overlay {
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    height: 100%;
    width: 100%;

    justify-content: center;
    align-items: center;

    background: rgba(0, 0, 0, 0.3);
}

.activate {
    font-size: 2rem;
    font-weight: bold;
    padding: 1rem;
    border: none;
    background: white;
    border-radius: 0;
    cursor: pointer;
}
</style>
