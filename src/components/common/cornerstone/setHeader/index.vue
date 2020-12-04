<template>
	<div class="_header" v-bind:style="styleObject">
        <slot></slot>
    </div>
</template>

<script>
export default {
	components: {},
	props: {
		styleObject: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {};
	},
	watch: {},
	computed: {},
	methods: {},
	created() {},
	mounted() {},
};
</script>
<style lang="scss" scoped>

.defaultColor{
    // background: var(--default-background);
}
.wrapper {
}
</style>