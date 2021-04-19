<template>
<div class="dashboard">
  <Home v-if="user" />
  <Login v-else />
</div>
</template>
