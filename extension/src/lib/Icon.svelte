<!--Below component made using this article https://javascript.plainenglish.io/how-to-add-customizable-svg-icons-in-svelte-js-app-488648d302c8-->
<script>
  export let color = "#32F9FF";
  export let stroke = color;
  export let filled = true;
  export let fill = filled ? color : "none";
  export let size = "1.4em"; // default 1em match the parent element
  export let strokeWidth = 0.1;
  // default heart icon
  export let d =
    "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z";
</script>

<svg
  class="icon"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path {d} {fill} {stroke} stroke-width={strokeWidth} />
</svg>

<style>
  .icon {
    position: relative;
    display: inline-block;
  }
</style>
