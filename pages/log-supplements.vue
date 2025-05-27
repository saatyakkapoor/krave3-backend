<!-- frontend-nuxt/pages/log-supplements.vue -->
<template>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-center">Log Supplement Intake</h1>
  
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <form @submit.prevent="handleSupplementLogSubmit">
            <!-- Supplement Name -->
            <div class="form-control w-full mb-4">
              <label class="label">
                <span class="label-text">Supplement Name</span>
              </label>
              <input
                type="text"
                list="supplement-names"
                placeholder="e.g., Vitamin D, Magnesium"
                class="input input-bordered w-full"
                v-model="supplementLog.name"
                @input="showRecommendation"
                required
              />
              <datalist id="supplement-names">
                <option v-for="name in knownSupplementNames" :key="name" :value="name"></option>
              </datalist>
            </div>
  
            <!-- Recommendation Display -->
            <div v-if="currentRecommendation" class="alert alert-sm shadow-lg mb-4" :class="currentRecommendation.interactionWarning ? 'alert-warning' : 'alert-info'">
              <div>
                <svg v-if="!currentRecommendation.interactionWarning" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <svg v-if="currentRecommendation.interactionWarning" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <div>
                  <h3 class="font-bold text-xs">Recommendation: {{ currentRecommendation.timing }}</h3>
                  <div v-if="currentRecommendation.interactionWarning" class="text-xs">{{ currentRecommendation.interactionWarning }}</div>
                </div>
              </div>
            </div>
  
  
            <!-- Dosage -->
            <div class="form-control w-full mb-4">
              <label class="label">
                <span class="label-text">Dosage</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 500mg, 1 capsule"
                class="input input-bordered w-full"
                v-model="supplementLog.dosage"
                required
              />
            </div>
  
            <!-- Timestamp -->
             <div class="form-control w-full mb-6">
              <label class="label">
                <span class="label-text">Time Taken</span>
              </label>
              <input
                type="datetime-local"
                class="input input-bordered w-full"
                v-model="supplementLog.timestamp"
              />
            </div>
  
            <!-- Notes -->
            <div class="form-control w-full mb-4">
              <label class="label">
                <span class="label-text">Notes (optional)</span>
              </label>
              <textarea
                class="textarea textarea-bordered h-24"
                placeholder="e.g., Brand name, reason for taking"
                v-model="supplementLog.notes"
              ></textarea>
            </div>
  
            <!-- Submit Button -->
            <div class="card-actions justify-end mt-6">
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                Log Supplement
                <span v-if="isSubmitting" class="loading loading-spinner loading-xs ml-2"></span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import { useBioDataStore } from '~/store/bioData';

  const bioDataStore = useBioDataStore();
  const router = useRouter();
  
  interface SupplementFormState {
    name: string;
    dosage: string;
    timestamp: string;
    notes?: string;
  }
  
  const getCurrentDateTimeLocal = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  
  const supplementLog = reactive<SupplementFormState>({
    name: '',
    dosage: '',
    timestamp: getCurrentDateTimeLocal(),
    notes: '',
  });
  
  const isSubmitting = ref(false);
  const currentRecommendation = ref<{timing: string, interactionWarning?: string} | null>(null);
  
  const knownSupplementNames = computed(() => Object.keys(bioDataStore.supplementRecommendations));
  
  const showRecommendation = () => {
      const recommendation = bioDataStore.getSupplementRecommendation(supplementLog.name);
      currentRecommendation.value = recommendation || null;
  };
  
  const resetForm = () => {
    supplementLog.name = '';
    supplementLog.dosage = '';
    supplementLog.timestamp = getCurrentDateTimeLocal();
    supplementLog.notes = '';
    currentRecommendation.value = null;
  };
  
  const handleSupplementLogSubmit = async () => {
    isSubmitting.value = true;
    if (!supplementLog.name || !supplementLog.dosage) {
      alert('Please fill in supplement name and dosage.');
      isSubmitting.value = false;
      return;
    }
  
    try {
      bioDataStore.addSupplementLog({
        name: supplementLog.name,
        dosage: supplementLog.dosage,
        timestamp: new Date(supplementLog.timestamp).toISOString(), // Ensure full ISO string
        notes: supplementLog.notes,
      });
      alert('Supplement logged successfully!');
      resetForm();
      // Optionally navigate away or show success message
      // router.push('/');
    } catch (error) {
      console.error('Error logging supplement:', error);
      alert('Failed to log supplement.');
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>