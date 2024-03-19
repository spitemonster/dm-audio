<template>
    <div class="audio-upload" ref="upload">
        <div class="audio-upload__form-wrap" v-if="!fileSelected">
            <form class="audio-upload__form">
                <h3>1. Select File</h3>
                <label class="input-wrap">
                    <input id="files" type="file" multiple />
                </label>
                <h3>2. Name Asset</h3>
                <label class="input-wrap">
                    <input id="name" type="text" placeholder="" />
                    <span>Asset Name</span>
                </label>
                <button>Submit</button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, inject } from 'vue'
import type { AudioAsset } from '../../../../types'
import type { Emitter } from 'mitt'

let fileSelected: boolean = false

const emit = defineEmits<{
    (e: 'upload', asset: AudioAsset): void
}>()

const upload = ref<HTMLElement>()
const $emitter: Emitter = inject('$emitter')

onMounted(() => {
    const form = upload.value?.querySelector(
        '.audio-upload__form'
    ) as HTMLFormElement

    upload.value?.addEventListener('click', (e: Event) => {
        const t: HTMLElement = e.target as HTMLElement

        if (t.tagName != 'form') {
        }
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const name: HTMLInputElement = document.getElementById(
            'name'
        ) as HTMLInputElement
        const filesEl: HTMLInputElement = document.getElementById(
            'files'
        ) as HTMLInputElement

        const files: FileList = filesEl.files as FileList

        const formData = new FormData()
        formData.append('name', name.value)
        formData.append('file', files[0])

        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then((res) => {
                $emitter.emit('upload', res)
            })
            .catch((err) => console.log('Error occured', err))
    })
})
</script>

<style lang="scss" scoped></style>
