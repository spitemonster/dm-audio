<template>
    <div class="asset-card" :data-asset-id="props.asset.id" ref="assetCard">
        <div class="detail-container">
            <input
                type="text"
                v-model="props.asset.name"
                @change="updateAsset"
            />
        </div>
        <div class="detail-container">
            <p>
                {{ tags }}
            </p>
            <input type="text" :value="tags" @change="updateAssetTags" />
        </div>
        <p>{{ props.asset.url }}</p>
        <button @click="editAsset" class="edit-button">Edit</button>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, reactive, ref, toRef, watch, computed } from 'vue'
import type { AudioAsset, Tag } from '../../../../types'
import { Reverb } from 'tone'
import type { Emitter } from 'mitt'
export interface Props {
    asset: AudioAsset
}

const $emitter: Emitter = inject('$emitter')

const assetCard = ref<HTMLElement>()

const props = defineProps<Props>()

const tags = computed<string>(() => {
    if (!props.asset.tags) {
        return ''
    }

    let str: string = ''

    props.asset.tags.forEach((t) => {
        str += t.name + ' '
    })

    return str
})

function editAsset(): void {
    assetCard.value?.classList.toggle('edit')
}

function updateAssetTags(e: Event): void {
    const t = e.target as HTMLInputElement
    const submittedTags: string = t.value as string

    const tagStrings: Array<string> = submittedTags.split(' ')

    let tagArr: Array<Tag> = tagStrings.map((s) => {
        const t: Tag = { name: s }

        return t
    })

    props.asset.tags = tagArr
    updateAsset()
}

function updateAsset(): void {
    $emitter.emit('updateAsset', props.asset)
}
</script>
