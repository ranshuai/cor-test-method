<template>
	<div class="child_header">
		<back v-if="!backHide"></back>
		<span class="_title">{{title}}</span>
	</div>
</template>

<style lang="scss">
.qr {
	position: absolute;
	right: pxToRem(16);
	top: 0;
	color: #fff;
}
.child_header {
	height: 0.82rem;
	position: absolute;
	left: 0;
	top: 0;
	line-height: 0.82rem;
	text-align: center;
	width: 100%;
	background: #469feb;
}
.child_header > ._title {
	font-size: pxToRem(25);
	color: #ffffff;
}
</style>


<script>
import { Popup } from "mint-ui";
export default {
	components: {
		Popup
	},

	props: ["title", "backHide"],
	data() {
		return {
		};
	},
	watch: {},
	computed: {
	},
	methods: {
	},
	created() {},
	mounted() {}
};
</script>