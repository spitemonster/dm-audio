export type AudioBlock = {
    url: string
    id: string
}

export type Tag = {
    name: string
}

export type AudioAsset = {
    url: string
    id: string
    name: string
    tags: Array<Tag>
}

export type Scene = {
    blocks: Array<AudioBlock>
}
