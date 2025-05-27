<!-- frontend-nuxt/pages/log-food.vue -->
<template>
    <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold mb-6 text-center">Log Your Meal</h1>

        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <form @submit.prevent="handleFoodLogSubmit">
                    <!-- Food Name -->
                    <div class="form-control w-full mb-4">
                        <label class="label">
                            <span class="label-text">What did you eat?</span>
                        </label>
                        <input type="text" placeholder="e.g., Chicken Salad, Apple" class="input input-bordered w-full"
                            v-model="foodLog.name" required />
                    </div>

                    <!-- Photo Upload -->
                    <div class="form-control w-full mb-4">
                        <label class="label">
                            <span class="label-text">Upload a photo (optional)</span>
                        </label>
                        <input type="file" class="file-input file-input-bordered file-input-primary w-full"
                            @change="handleFileUpload" accept="image/*" />
                        <div v-if="foodLog.photoPreview" class="mt-2">
                            <img :src="foodLog.photoPreview" alt="Food preview" class="max-h-48 rounded-lg" />
                        </div>
                    </div>

                    <!-- Quick Add Common Items (Future Feature Placeholder) -->
                    <!-- <div class="form-control w-full mb-4">
              <label class="label">
                <span class="label-text">Or quick add common items:</span>
              </label>
              <div class="flex gap-2">
                <button type="button" class="btn btn-sm btn-outline">Apple</button>
                <button type="button" class="btn btn-sm btn-outline">Coffee</button>
              </div>
            </div> -->

                    <h2 class="text-xl font-semibold mt-6 mb-3">Nutritional Information (Manual Entry)</h2>
                    <p class="text-sm text-base-content/70 mb-4">
                        Enter the approximate nutritional values if you know them.
                        The AI will try to estimate this from photos later.
                    </p>

                    <!-- Calories -->
                    <div class="form-control w-full mb-4">
                        <label class="label">
                            <span class="label-text">Calories (kcal)</span>
                        </label>
                        <input type="number" placeholder="e.g., 350" class="input input-bordered w-full"
                            v-model.number="foodLog.calories" min="0" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <!-- Protein -->
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text">Protein (g)</span>
                            </label>
                            <input type="number" placeholder="e.g., 20" class="input input-bordered w-full"
                                v-model.number="foodLog.protein" min="0" />
                        </div>

                        <!-- Carbohydrates -->
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text">Carbs (g)</span>
                            </label>
                            <input type="number" placeholder="e.g., 30" class="input input-bordered w-full"
                                v-model.number="foodLog.carbs" min="0" />
                        </div>

                        <!-- Fat -->
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text">Fat (g)</span>
                            </label>
                            <input type="number" placeholder="e.g., 15" class="input input-bordered w-full"
                                v-model.number="foodLog.fat" min="0" />
                        </div>
                    </div>

                    <!-- Timestamp (Defaults to now, but can be adjusted) -->
                    <div class="form-control w-full mb-6">
                        <label class="label">
                            <span class="label-text">Time Eaten</span>
                        </label>
                        <input type="datetime-local" class="input input-bordered w-full" v-model="foodLog.timestamp" />
                    </div>


                    <!-- Submit Button -->
                    <div class="card-actions justify-end mt-6">
                        <button type="submit" class="btn btn-primary">
                            Log Meal
                            <span v-if="isSubmitting" class="loading loading-spinner loading-xs ml-2"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Display Logged Data (for testing) -->
        <div v-if="submittedData" class="mt-8 p-4 bg-neutral text-neutral-content rounded-lg">
            <h3 class="text-lg font-semibold">Data Logged (for testing):</h3>
            <pre class="text-xs">{{ JSON.stringify(submittedData, null, 2) }}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
// Define the structure of our food log entry
interface FoodLogEntry {
    name: string;
    photoFile: File | null;
    photoPreview: string | null;
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
    timestamp: string;
}

// Helper to get current datetime-local string
const getCurrentDateTimeLocal = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for local timezone
    return now.toISOString().slice(0, 16);
};

// Reactive state for the form
const foodLog = reactive<FoodLogEntry>({
    name: '',
    photoFile: null,
    photoPreview: null,
    calories: null,
    protein: null,
    carbs: null,
    fat: null,
    timestamp: getCurrentDateTimeLocal(),
});

const isSubmitting = ref(false);
const submittedData = ref<FoodLogEntry | null>(null); // To display what was "submitted"

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        foodLog.photoFile = file;
        foodLog.photoPreview = URL.createObjectURL(file); // Create a temporary URL for preview
    } else {
        foodLog.photoFile = null;
        foodLog.photoPreview = null;
    }
};

const resetForm = () => {
    foodLog.name = '';
    foodLog.photoFile = null;
    if (foodLog.photoPreview) {
        URL.revokeObjectURL(foodLog.photoPreview); // Clean up the object URL
    }
    foodLog.photoPreview = null;
    foodLog.calories = null;
    foodLog.protein = null;
    foodLog.carbs = null;
    foodLog.fat = null;
    foodLog.timestamp = getCurrentDateTimeLocal();
    // Reset file input visually (a bit tricky, this is a common approach)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (fileInput) {
        fileInput.value = '';
    }
};

const handleFoodLogSubmit = async () => {
    isSubmitting.value = true;
    submittedData.value = null; // Clear previous submitted data

    // Basic validation example
    if (!foodLog.name) {
        alert('Please enter what you ate.');
        isSubmitting.value = false;
        return;
    }

    console.log('Submitting food log:', { ...foodLog });

    // --- TODO: API Integration ---
    // Here you would typically create a FormData object if sending a file
    // const formData = new FormData();
    // formData.append('name', foodLog.name);
    // if (foodLog.photoFile) {
    //   formData.append('photo', foodLog.photoFile);
    // }
    // if (foodLog.calories) formData.append('calories', foodLog.calories.toString());
    // if (foodLog.protein) formData.append('protein', foodLog.protein.toString());
    // if (foodLog.carbs) formData.append('carbs', foodLog.carbs.toString());
    // if (foodLog.fat) formData.append('fat', foodLog.fat.toString());
    // formData.append('timestamp', new Date(foodLog.timestamp).toISOString());

    // try {
    //   // const { data, error } = await useFetch('/api/backend/log-meal', { // Assuming Nuxt proxy
    //   //   method: 'POST',
    //   //   body: formData,
    //   // });
    //   // if (error.value) throw error.value;
    //   // console.log('Server response:', data.value);
    //   // alert('Meal logged successfully!');

    //   // For MVP, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    submittedData.value = { ...foodLog, photoFile: foodLog.photoFile ? foodLog.photoFile.name as any : null }; // Don't try to stringify the File object directly
    alert('Meal logged (simulated)! Check console and test data display.');
    resetForm();

    // } catch (err) {
    //   console.error('Error logging food:', err);
    //   alert('Failed to log meal. Please try again.');
    // } finally {
    //   isSubmitting.value = false;
    // }
    // --- End API Integration ---

    // For now, just simulate and display
    await new Promise(resolve => setTimeout(resolve, 500));
    submittedData.value = { ...foodLog, photoFile: foodLog.photoFile ? foodLog.photoFile.name as any : null };
    console.log('Simulated submission successful.');
    // alert('Meal logged (simulated)! Check console and test data display.'); // Redundant if using the one in the simulated API block
    // resetForm(); // Already called in simulated API block
    isSubmitting.value = false;
};

// Clean up object URL on component unmount if a preview was generated
import { onUnmounted } from 'vue';
onUnmounted(() => {
    if (foodLog.photoPreview) {
        URL.revokeObjectURL(foodLog.photoPreview);
    }
});
</script>

<style scoped>
/* Add any page-specific styles here if needed */
</style>