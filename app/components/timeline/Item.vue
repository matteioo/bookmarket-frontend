<template>
  <div class="relative">
    <div class="items-center mb-3">
      <div class="flex space-x-4">
        <!-- Icon -->
        <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-sm">
          <UIcon :name="props.icon" class="w-6 h-6" :class="computedColor" />
        </div>
        <div>
          <div class="text-neutral-700 dark:text-neutral-300 font-medium">
            <time v-if="props.dateTime" class="block text-sm text-neutral-500">{{ formatReadableDate(props.dateTime.toString()) }}</time>
            <ULink v-if="props.member" class="underline hover:text-neutral-800 dark:hover:text-neutral-200" :to="`/fv/members/${props.member.id}`">
              {{ props.member?.username }}
            </ULink>
            <span>&nbsp;{{ props.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasContent" class="p-2 rounded-sm border bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 ml-14">
      <slot :content="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Member } from '~/interfaces/Member'
import { formatReadableDate } from '~/utils/utils'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'gray'
  },
  member: {
    type: Object as () => Member,
    required: false,
    default: undefined
  },
  dateTime: {
    type: Date,
    required: false,
    default: undefined
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: false,
    default: undefined,
  }
})

const computedColor = computed(() => {
  const colorMap = {
    success: 'text-emerald-600 dark:text-emerald-500',
    warning: 'text-yellow-600 dark:text-yellow-500',
    error: 'text-red-600 dark:text-red-500',
    info: 'text-blue-600 dark:text-blue-500'
  }
  return colorMap[props.variant as keyof typeof colorMap] || ''
})

const hasContent = ref<boolean>(false)
const slots = useSlots()
watchEffect(() => {
  hasContent.value = !!slots.default && !!slots.default()[0]
})
</script>