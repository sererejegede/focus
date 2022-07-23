<template>
  <div>
    <!--<component :is="component" />-->
    <img :src="L" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import L from '@/assets/icons/check.svg'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  // components: { L },
  setup(props) {
    // noinspection TypeScriptCheckImport
    // const component = computed(
    //   () => () =>
    //     import(
    //       /* WebpackChunkName: "icons" */
    //       /* WebpackMode: "lazy-once" */ `../assets/icons/${props.name}.svg`
    //     )
    // )

    return {
      // component,
      L,
    }
  },
})
</script>
