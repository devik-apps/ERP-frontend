<script setup lang="ts" generic="T extends Record<string, any>">
import { VisXYContainer, VisLine, VisArea, VisAxis } from '@unovis/vue'
import { CurveType } from '@unovis/ts'
import { computed } from 'vue'

type KeyOfT = Extract<keyof T, string>

const props = withDefaults(defineProps<{
  data: T[]
  index: KeyOfT
  category: KeyOfT
  color?: string
  height?: number
  yFormatter?: (v: number) => string
  xFormatter?: (v: number) => string
  showArea?: boolean
}>(), {
  color: 'var(--coral)',
  height: 200,
  showArea: true,
})

const xAccessor = (_d: T, i: number) => i
const yAccessor = (d: T) => Number(d[props.category]) || 0

const ticks = computed(() => props.data.map((_, i) => i))
</script>

<template>
  <div class="sales-chart" :style="{ height: `${height}px` }">
    <VisXYContainer
      :data="data"
      :margin="{ top: 8, right: 8, bottom: 24, left: 48 }"
      :style="{ height: '100%' }"
    >
      <VisArea
        v-if="showArea"
        :x="xAccessor"
        :y="yAccessor"
        :curve-type="CurveType.MonotoneX"
        :color="color"
        :opacity="0.12"
      />
      <VisLine
        :x="xAccessor"
        :y="yAccessor"
        :curve-type="CurveType.MonotoneX"
        :color="color"
      />
      <VisAxis
        type="x"
        :tick-values="ticks"
        :tick-format="(i: number) => xFormatter ? xFormatter(i) : String(data[i]?.[index] ?? '')"
        :grid-line="false"
        :tick-line="false"
        :domain-line="false"
      />
      <VisAxis
        type="y"
        :tick-format="(v: number) => yFormatter ? yFormatter(v) : String(v)"
        :grid-line="true"
        :tick-line="false"
        :domain-line="false"
        :num-ticks="4"
      />
    </VisXYContainer>
  </div>
</template>
