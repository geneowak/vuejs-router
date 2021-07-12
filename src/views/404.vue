<template>
  <div>
    <h1>Not found</h1>
    <p>
      Sorry we couldn't find that page, try going back
      <router-link :to="{ name: 'Home' }">home</router-link>
    </p>
  </div>
</template>
