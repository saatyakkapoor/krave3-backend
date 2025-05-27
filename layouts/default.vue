<!-- frontend-nuxt/layouts/default.vue -->
<template>
    <div class="min-h-screen flex flex-col">
      <header class="bg-base-100 shadow-md sticky top-0 z-50">
        <div class="navbar container mx-auto">
          <div class="flex-1">
            <NuxtLink to="/" class="btn btn-ghost normal-case text-xl text-primary">
              BioOptimizer
            </NuxtLink>
          </div>
          <div class="flex-none">
            <ul class="menu menu-horizontal px-1 items-center">
              <li><NuxtLink to="/" class="btn btn-ghost" active-class="btn-active">Dashboard</NuxtLink></li>
              <li><NuxtLink to="/log-food" class="btn btn-ghost" active-class="btn-active">Log Food</NuxtLink></li>
              <li><NuxtLink to="/insights" class="btn btn-ghost" active-class="btn-active">Insights</NuxtLink></li>
              <li><NuxtLink to="/log-supplements" class="btn btn-ghost" active-class="btn-active">Log Supplements</NuxtLink></li>
              <li><NuxtLink to="/settings" class="btn btn-ghost" active-class="btn-active">Settings</NuxtLink></li>
              <!-- Add other core feature links here as they are developed -->
              <!-- e.g., <li><NuxtLink to="/protocols" class="btn btn-ghost" active-class="btn-active">Protocols</NuxtLink></li> -->
            </ul>
          </div>
        </div>
      </header>
  
      <main class="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <slot />
      </main>

      <DashboardAiChatPanel />
  
      <footer class="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>Copyright © {{ new Date().getFullYear() }} - All right reserved by BioOptimizer Inc.</p>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup lang="ts">


  // No authentication logic needed here for now
  </script>