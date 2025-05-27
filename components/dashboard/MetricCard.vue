<template>
    <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="card-body p-4 md:p-5">
            <div class="flex items-center justify-between mb-1">
                <h3 class="card-title text-base md:text-lg font-semibold text-base-content/80">
                    {{ title }}
                </h3>
                <div v-if="icon" class="text-primary" v-html="iconSvg"></div>
                <div v-else-if="statusIndicator" :class="statusIndicatorClass" class="w-3 h-3 rounded-full"></div>
            </div>

            <div class="flex items-baseline mb-1">
                <p class="text-2xl md:text-3xl font-bold text-primary tabular-nums">
                    {{ value }}
                </p>
                <span v-if="unit" class="ml-1 text-sm text-base-content/70">{{ unit }}</span>
            </div>

            <div v-if="trend || statusText" class="text-xs md:text-sm text-base-content/60 flex items-center">
                <span v-if="trend" :class="trendColor" class="flex items-center mr-2">
                    <svg v-if="trend === 'up'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-0.5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                            d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <svg v-if="trend === 'down'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-0.5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <svg v-if="trend === 'stable'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-0.5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 12h14" />
                    </svg>
                    {{ trendText }}
                </span>
                <span v-if="statusText">{{ statusText }}</span>
            </div>

            <div v-if="lastUpdated" class="text-xs text-base-content/50 mt-2">
                Last updated: {{ lastUpdated }}
            </div>

            <div v-if="$slots.actions" class="card-actions justify-end mt-3">
                <slot name="actions"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
type TrendDirection = 'up' | 'down' | 'stable' | null;
type StatusIndicatorColor = 'success' | 'warning' | 'error' | 'info' | null;

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    value: {
        type: [String, Number],
        required: true,
    },
    unit: {
        type: String,
        default: '',
    },
    icon: { // Pass SVG string directly
        type: String,
        default: null,
    },
    trend: {
        type: String as PropType<TrendDirection>,
        default: null,
        validator: (value: string) => ['up', 'down', 'stable', null].includes(value),
    },
    trendText: {
        type: String,
        default: '',
    },
    statusText: {
        type: String,
        default: '',
    },
    lastUpdated: {
        type: String, // e.g., "5m ago", "10:30 AM"
        default: '',
    },
    statusIndicator: { // For a simple dot indicator
        type: String as PropType<StatusIndicatorColor>,
        default: null,
        validator: (value: string) => ['success', 'warning', 'error', 'info', null].includes(value),
    }
});

// For injecting SVG strings safely
const iconSvg = computed(() => props.icon);

const trendColor = computed(() => {
    if (props.trend === 'up') return 'text-success'; // Green for up (can be good or bad depending on metric)
    if (props.trend === 'down') return 'text-error';   // Red for down (can be good or bad depending on metric)
    if (props.trend === 'stable') return 'text-info';
    return 'text-base-content/70'; // Default color
    // TODO: Consider making trend colors configurable or context-aware
    // e.g. 'up' for glucose is bad, 'up' for HRV might be good.
    // This might require an additional prop like `trendSentiment: 'positive' | 'negative'`
});

const statusIndicatorClass = computed(() => {
    if (props.statusIndicator === 'success') return 'bg-success';
    if (props.statusIndicator === 'warning') return 'bg-warning';
    if (props.statusIndicator === 'error') return 'bg-error';
    if (props.statusIndicator === 'info') return 'bg-info';
    return 'bg-base-300'; // Default or neutral
});
</script>

<style scoped>
/* Styles for tabular-nums to prevent width changes when numbers update */
.tabular-nums {
    font-variant-numeric: tabular-nums;
}
</style>