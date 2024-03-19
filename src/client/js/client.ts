import '../scss/global.scss'

import mitt from 'mitt'
import type { Emitter } from 'mitt'
import { createApp } from 'vue'

import * as Tone from 'tone'

import App from './vue/App.vue'

import AudioChannel from './vue/components/AudioChannel.vue'
import AudioUpload from './vue/components/AudioUpload.vue'
import AudioAssets from './vue/components/AudioAssets.vue'
import AssetCard from './vue/components/AssetCard.vue'
import type { AudioAsset } from '../../types'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $tone: typeof Tone
        $fuck: String
    }
}

type Events = {
    updateAsset: AudioAsset
}

const emitter: Emitter<Events> = mitt<Events>()
export const app = createApp(App)

app.provide('$emitter', emitter)
app.provide('$tone', Tone)

app.component('AudioChannel', AudioChannel)
app.component('AudioUpload', AudioUpload)
app.component('AudioAssets', AudioAssets)
app.component('AssetCard', AssetCard)

app.config.errorHandler = (err) => {
    console.log('THERE HAS BEEN AN ERROR')
    console.log(err)
}

app.mount('#app')
