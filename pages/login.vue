<!-- frontend-nuxt/pages/login.vue -->
<template>
    <div class="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-primary">
            Sign in to your account
          </h2>
          <p class="mt-2 text-center text-sm text-base-content/70">
            Or
            <NuxtLink to="/signup" class="font-medium text-secondary hover:text-secondary-focus">
              create a new account
            </NuxtLink>
          </p>
        </div>
        <form class="mt-8 space-y-6 card bg-base-100 shadow-xl p-8" @submit.prevent="handleLogin">
          <input type="hidden" name="remember" value="true" />
          <div class="rounded-md shadow-sm -space-y-px">
            <div class="form-control mb-4">
              <label for="email-address" class="label">
                <span class="label-text">Email address</span>
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="email"
                class="input input-bordered w-full"
                placeholder="Email address"
              />
            </div>
            <div class="form-control">
              <label for="password" class="label">
                <span class="label-text">Password</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                v-model="password"
                class="input input-bordered w-full"
                placeholder="Password"
              />
            </div>
          </div>
  
          <div class="flex items-center justify-between text-sm">
            <div class="form-control">
              <label class="label cursor-pointer">
                <input type="checkbox" class="checkbox checkbox-primary checkbox-sm mr-2" v-model="rememberMe" />
                <span class="label-text">Remember me</span>
              </label>
            </div>
  
            <div >
              <a href="#" class="font-medium text-secondary hover:text-secondary-focus">
                Forgot your password?
              </a>
            </div>
          </div>
  
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="btn btn-primary w-full group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span v-if="isLoading" class="loading loading-spinner loading-xs mr-2"></span>
              Sign in
            </button>
          </div>
          <div v-if="errorMessage" class="alert alert-error shadow-lg text-sm">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{{ errorMessage }}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  // import { useUserStore } from '~/store/user'; // Will be used later
  
  const email = ref('');
  const password = ref('');
  const rememberMe = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref('');
  // const userStore = useUserStore(); // Will be used later
  // const router = useRouter(); // Will be used later
  
  const handleLogin = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    console.log('Attempting login with:', email.value, password.value, rememberMe.value);
  
    // --- TODO: Actual Login Logic (e.g., call Pinia store action) ---
    try {
      // await userStore.login({ email: email.value, password: password.value });
      // router.push('/'); // Navigate to dashboard on success
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      if (email.value === "test@example.com" && password.value === "password") {
        alert('Simulated login successful! Redirecting...');
        // router.push('/');
      } else {
        throw new Error("Invalid credentials (simulated)");
      }
    } catch (error: any) {
      errorMessage.value = error.message || 'Login failed. Please check your credentials.';
      console.error('Login error:', error);
    } finally {
      isLoading.value = false;
    }
    // --- End Login Logic ---
  };
  
  // Define a different layout if your login page shouldn't have the main navbar/footer
  // definePageMeta({
  //   layout: 'auth', // Assuming you create an layouts/auth.vue
  // });
  </script>