<template>
    <div class="audio-assets">
        <AssetCard v-for="asset in props.assets" :asset="asset"></AssetCard>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, reactive } from 'vue'
import type { AudioAsset } from '../../types'
// import type AssetCardVue from './AssetCard.vue'

export interface Props {
    assets: {
        type: Array<AudioAsset>
        required: true
    }
}

const props = defineProps<Props>()

onMounted(() => {
    console.log('Audio Assets Component mounted')
})
</script>

<style lang="scss" scoped></style>
