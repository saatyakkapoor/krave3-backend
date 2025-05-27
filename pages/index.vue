<!-- Template remains largely the same, but prop bindings will change -->
<template>
    <div>
      <h1 class="text-3xl md:text-4xl font-bold mb-6 md:mb-8">
        Welcome, Biohacker!
      </h1>
  
      <div class="alert alert-info shadow-lg mb-6 md:mb-8">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Overall Status: Optimal. AI insights are being generated for you.</span>
        </div>
      </div>
  
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <DashboardMetricCard
          title="Glucose"
          :value="bioDataStore.getLatestGlucoseValue ?? 'N/A'"
          unit="mg/dL"
          :trend="bioDataStore.getLatestGlucoseTrend"
          :trend-text="glucoseTrendText"
          :last-updated="formatTimestamp(bioDataStore.getLatestGlucoseTimestamp)"
          :icon="glucoseIcon"
        >
          <template #actions>
            <button class="btn btn-xs btn-outline btn-primary" @click="logMetric('glucose')">Log Reading</button>
          </template>
        </DashboardMetricCard>
  
        <DashboardMetricCard
          title="HRV (RMSSD)"
          :value="bioDataStore.getHrvCurrentRmsdd ?? 'N/A'"
          unit="ms"
          :status-text="`Readiness: ${bioDataStore.getHrvReadiness ?? 'N/A'}`"
          :last-updated="formatTimestamp(bioDataStore.getHrvLastReadingTimestamp)"
          :icon="hrvIcon"
        />
  
        <DashboardMetricCard
          title="Sleep Score"
          :value="bioDataStore.getLatestSleepScore ?? 'N/A'"
          unit="/ 100"
          :status-text="`Duration: ${bioDataStore.getLatestSleepDuration}`"
          :last-updated="bioDataStore.getLatestSleepDate ? `Night of ${bioDataStore.getLatestSleepDate}` : 'N/A'"
          :icon="sleepIcon"
        />
  
        <DashboardMetricCard
          title="Energy Level"
          :value="bioDataStore.getLatestEnergyReport?.level ?? 'N/A'"
          unit="/ 10"
          status-text="Self-reported"
          :last-updated="formatTimestamp(bioDataStore.getLatestEnergyReport?.timestamp)"
          :icon="energyIcon"
        >
          <template #actions>
            <button class="btn btn-xs btn-outline" @click="logMetric('energy')">Report Energy</button>
          </template>
        </DashboardMetricCard>
  
         <DashboardMetricCard
          title="Active Calories"
          value="350"
          unit="kcal"
          status-text="Today"
          :icon="caloriesIcon"
        />
      </div>
  
      <div class="mt-8 md:mt-12">
        <h2 class="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <ul class="space-y-2">
              <li v-for="log in recentActivity" :key="log.id" class="py-2 border-b border-base-300 last:border-b-0 flex justify-between items-center">
                <span>{{ log.text }} - {{ formatTimestamp(log.timestamp, true) }}</span>
                <span class="badge badge-outline">{{ log.type }}</span>
              </li>
              <li v-if="!recentActivity.length" class="text-base-content/70">No recent activity logged.</li>
            </ul>
          </div>
        </div>
      </div>
  
    </div>
  </template>
  
  <script setup lang="ts">
import { useBioDataStore } from '~/store/bioData';

// For navigation
  
  const bioDataStore = useBioDataStore();
  const router = useRouter();
  
  // SVG Icons (remain the same)
  const glucoseIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0122 12c0 3.771-2.503 6.957-6.014 7.795C14.986 21.5 12 22 12 22s1.657-2.343 5.657-3.343z" /></svg>`;
  const hrvIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>`;
  const sleepIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;
  const energyIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`;
  const caloriesIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.05 20.576A8.965 8.965 0 0112 21c-4.953 0-8.965-4.012-8.965-8.965S7.047 3.07 12 3.07s8.965 4.012 8.965 8.965c0 2.089-.712 4.001-1.915 5.521m-2.04-1.868a6.965 6.965 0 00-1.635-8.785M12 10v6m0 0v-2m0 2H9.5M12 16h2.5" /></svg>`
  
  const glucoseTrendText = computed(() => {
      // This can be made more sophisticated later
      const trend = bioDataStore.getLatestGlucoseTrend;
      if (trend === 'up') return 'Rising';
      if (trend === 'down') return 'Falling';
      if (trend === 'stable') return 'Stable';
      if (trend === 'rapid_up') return 'Rising Rapidly';
      if (trend === 'rapid_down') return 'Falling Rapidly';
      return 'N/A';
  });
  
  // Helper to format timestamps for display
  const formatTimestamp = (isoString?: string, includeTime: boolean = false): string => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      if (includeTime) {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      }
      // Simple relative time (very basic)
      const now = new Date();
      const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
      if (diffSeconds < 60) return 'Just now';
      if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
      if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
      return date.toLocaleDateString();
    } catch (e) {
      return 'Invalid Date';
    }
  };
  
  interface ActivityItem {
      id: string;
      timestamp: string;
      type: string;
      text: string;
  }
  
  const recentActivity = computed((): ActivityItem[] => {
      const activities: ActivityItem[] = [];
      bioDataStore.foodLogs.forEach(log => activities.push({id: `food-${log.id}`, timestamp: log.timestamp, type: 'Food', text: `Logged: ${log.name}`}));
      bioDataStore.supplementLogs.forEach(log => activities.push({id: `supp-${log.id}`, timestamp: log.timestamp, type: 'Supplement', text: `Logged: ${log.name} ${log.dosage}`}));
      bioDataStore.energyReports.forEach((log, index) => activities.push({id: `energy-${index}`, timestamp: log.timestamp, type: 'Energy', text: `Reported Energy: ${log.level}/10`}));
      // Add other log types here (workouts, sleep, glucose readings etc.)
      return activities.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0,5); // Sort by newest, take top 5
  });
  
  
  onMounted(async () => {
    // Fetch initial data when component mounts
    await bioDataStore.fetchInitialBioData();
  });
  
  const logMetric = (metricType: string) => {
    // Example: Navigate to a specific logging page or open a modal
    if (metricType === 'glucose') {
      // For now, let's add a mock glucose reading directly
      const newValue = Math.floor(Math.random() * 50) + 80; // Random value between 80-130
      bioDataStore.addGlucoseReading({ value: newValue, trend: Math.random() > 0.5 ? 'up' : 'stable'});
      alert(`Mock glucose reading (${newValue} mg/dL) added!`);
    } else if (metricType === 'energy') {
      router.push('/log-subjective'); // We'll create this page later
    } else {
      alert(`TODO: Implement logging for ${metricType}`);
    }
  };
  </script>