<!-- frontend-nuxt/pages/settings.vue -->
<template>
    <div>
      <h1 class="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Settings</h1>
  
      <div class="space-y-8">
        <!-- Profile Section -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Profile Information</h2>
            <form @submit.prevent="saveProfile">
              <div class="form-control mb-4">
                <label class="label"><span class="label-text">Full Name</span></label>
                <input type="text" v-model="profile.name" placeholder="Your Name" class="input input-bordered" />
              </div>
              <div class="form-control mb-4">
                <label class="label"><span class="label-text">Email</span></label>
                <input type="email" v-model="profile.email" placeholder="your@email.com" class="input input-bordered" disabled />
              </div>
              <div class="card-actions justify-end">
                <button type="submit" class="btn btn-primary">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
  
        <!-- Device Connections Section -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Connected Devices</h2>
            <ul class="space-y-3 mt-2">
              <li class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <div>
                  <p class="font-semibold">Continuous Glucose Monitor (CGM)</p>
                  <p class="text-sm text-base-content/70">FreeStyle Libre - Connected</p>
                </div>
                <button class="btn btn-sm btn-outline btn-error">Disconnect</button>
              </li>
              <li class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <div>
                  <p class="font-semibold">HRV Monitor</p>
                  <p class="text-sm text-base-content/70">Oura Ring - Not Connected</p>
                </div>
                <button class="btn btn-sm btn-primary">Connect</button>
              </li>
              <!-- Add more devices -->
            </ul>
          </div>
        </div>
  
        <!-- Notification Preferences Section -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Notification Preferences</h2>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Email Notifications for Weekly Summary</span>
                <input type="checkbox" class="toggle toggle-primary" v-model="notifications.emailSummary" />
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Push Notifications for Real-time Alerts</span>
                <input type="checkbox" class="toggle toggle-primary" v-model="notifications.pushAlerts" checked />
              </label>
            </div>
            <!-- Add more notification settings -->
          </div>
        </div>
  
          <!-- Account Actions -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Account Actions</h2>
            <div class="space-y-3 mt-2">
               <button class="btn btn-outline w-full md:w-auto">Change Password</button>
               <button class="btn btn-outline btn-error w-full md:w-auto">Delete Account</button>
            </div>
          </div>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive } from 'vue';
  
  // Mock data - will come from Pinia store later
  const profile = reactive({
    name: 'Jane Biohacker',
    email: 'jane.biohacker@example.com',
  });
  
  const notifications = reactive({
    emailSummary: false,
    pushAlerts: true,
  });
  
  const saveProfile = () => {
    console.log('Saving profile:', profile);
    alert('Profile save functionality to be implemented.');
    // TODO: Call Pinia store action to save profile
  };
  
  // definePageMeta({
  //   middleware: ['auth'] // Example: Add auth middleware later
  // });
  </script>