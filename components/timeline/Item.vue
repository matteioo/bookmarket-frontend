<template>
  <div class="relative">
    <div class="items-center mb-3">
      <div class="flex space-x-4">
        <!-- Icon -->
        <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow">
          <UIcon :name="props.icon" class="w-6 h-6" :class="computedColor" />
        </div>
        <div>
          <div class="text-gray-700 dark:text-gray-300 font-medium">
            <time v-if="props.dateTime" class="block text-sm text-gray-500">{{ formatReadableDate(props.dateTime.toString()) }}</time>
            <ULink v-if="props.member"
              class="underline hover:text-gray-800 dark:hover:text-gray-200"
              :to="`/fv/members/${props.member.id}`"
              >
              {{ props.member?.username }}
            </ULink>
            <span>&nbsp;{{ props.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasContent" class="p-2 rounded border bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 ml-14">
      <slot v-bind:content="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Member } from '~/interfaces/Member';
import { formatReadableDate } from '~/utils/utils';

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
    required: false
  },
  dateTime: {
    type: Date,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: false
  }
});

const computedColor = computed(() => {
  const colorMap = {
    success: 'text-emerald-600 dark:text-emerald-500',
    warning: 'text-yellow-600 dark:text-yellow-500',
    error: 'text-red-600 dark:text-red-500',
    info: 'text-blue-600 dark:text-blue-500'
  };
  return colorMap[props.variant as keyof typeof colorMap] || '';
});

const hasContent = ref(false);
const slots = useSlots();
watchEffect(() => {
  hasContent.value = !!slots.default && !!slots.default()[0];
})
</script>