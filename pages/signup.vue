<!-- frontend-nuxt/pages/signup.vue -->
<template>
    <div class="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-primary">
            Create your BioOptimizer account
          </h2>
          <p class="mt-2 text-center text-sm text-base-content/70">
            Already have an account?
            <NuxtLink to="/login" class="font-medium text-secondary hover:text-secondary-focus">
              Sign in here
            </NuxtLink>
          </p>
        </div>
        <form class="mt-8 space-y-6 card bg-base-100 shadow-xl p-8" @submit.prevent="handleSignup">
          <div class="rounded-md shadow-sm">
            <div class="form-control mb-4">
              <label for="full-name" class="label">
                <span class="label-text">Full Name</span>
              </label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                autocomplete="name"
                required
                v-model="fullName"
                class="input input-bordered w-full"
                placeholder="Full Name"
              />
            </div>
  
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
  
            <div class="form-control mb-4">
              <label for="password" class="label">
                <span class="label-text">Password</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                v-model="password"
                class="input input-bordered w-full"
                placeholder="Password"
              />
            </div>
  
            <div class="form-control">
              <label for="confirm-password" class="label">
                <span class="label-text">Confirm Password</span>
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                v-model="confirmPassword"
                class="input input-bordered w-full"
                placeholder="Confirm Password"
              />
            </div>
          </div>
  
           <div class="form-control mt-2">
              <label class="label cursor-pointer">
                <input type="checkbox" class="checkbox checkbox-primary checkbox-sm mr-2" v-model="agreedToTerms" required />
                <span class="label-text text-xs">I agree to the <a href="/terms" class="link link-secondary">Terms of Service</a> and <a href="/privacy" class="link link-secondary">Privacy Policy</a>.</span>
              </label>
            </div>
  
  
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="btn btn-primary w-full group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span v-if="isLoading" class="loading loading-spinner loading-xs mr-2"></span>
              Create Account
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
  
  const fullName = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const agreedToTerms = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref('');
  // const userStore = useUserStore(); // Will be used later
  // const router = useRouter(); // Will be used later
  
  const handleSignup = async () => {
    isLoading.value = true;
    errorMessage.value = '';
  
    if (password.value !== confirmPassword.value) {
      errorMessage.value = "Passwords do not match.";
      isLoading.value = false;
      return;
    }
    if (!agreedToTerms.value) {
      errorMessage.value = "You must agree to the terms and conditions.";
      isLoading.value = false;
      return;
    }
  
    console.log('Attempting signup for:', fullName.value, email.value);
  
    // --- TODO: Actual Signup Logic (e.g., call Pinia store action) ---
    try {
      // await userStore.signup({ fullName: fullName.value, email: email.value, password: password.value });
      // router.push('/'); // Navigate to dashboard or email verification page
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Simulated signup successful! Please login.');
      // router.push('/login');
    } catch (error: any) {
      errorMessage.value = error.message || 'Signup failed. Please try again.';
      console.error('Signup error:', error);
    } finally {
      isLoading.value = false;
    }
    // --- End Signup Logic ---
  };
  
  // Define a different layout if your signup page shouldn't have the main navbar/footer
  // definePageMeta({
  //   layout: 'auth', // Assuming you create an layouts/auth.vue
  // });
  </script>