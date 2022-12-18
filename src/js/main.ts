import { createApp } from 'vue'
import mitt from 'mitt'
import * as Tone from 'tone'

import App from './vue/App.vue'

import AudioChannel from './vue/components/AudioChannel.vue'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $tone: typeof Tone
        $fuck: String
    }
}

const emitter = mitt()
export const app = createApp(App)

app.provide('$fuck', 'shit ass')
app.provide('$tone', Tone)

app.component('AudioChannel', AudioChannel)

app.config.errorHandler = (err) => {
    console.log('THERE HAS BEEN AN ERROR')
    console.log(err)
}

app.mount('#app')
