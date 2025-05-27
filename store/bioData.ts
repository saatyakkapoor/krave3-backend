import { defineStore } from 'pinia';

// --- Interfaces for our data structures ---
export interface GlucoseReading {
  id: string;
  value: number; // mg/dL
  timestamp: string; // ISO string
  trend?: 'up' | 'down' | 'stable' | 'rapid_up' | 'rapid_down';
  notes?: string;
}

export interface HrvData {
  currentRmsdd?: number; // ms (Root Mean Square of Successive Differences)
  readinessScore?: number; // 0-100
  stressLevel?: 'low' | 'medium' | 'high';
  lastReadingTimestamp?: string; // ISO string
  dailyAverageRmsdd?: number;
}

export interface SleepSession {
  id: string;
  date: string; // YYYY-MM-DD
  score: number; // 0-100
  durationMinutes: number;
  // Optional: more detailed sleep stages if available
  // deepSleepMinutes?: number;
  // remSleepMinutes?: number;
  // lightSleepMinutes?: number;
  // awakeMinutes?: number;
  notes?: string;
}

export interface FoodLog {
  id: string;
  name: string;
  timestamp: string; // ISO string
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  photoUrl?: string; // Placeholder for photo
  notes?: string;
}

export interface SupplementLog {
  id:string;
  name: string;
  dosage: string; // e.g., "500mg", "1 capsule"
  timestamp: string; // ISO string
  notes?: string;
}

export interface EnergyReport {
    level: number; // 1-10
    timestamp: string; // ISO string
    notes?: string;
}

// --- Store State Interface ---
interface BioDataState {
  glucoseReadings: GlucoseReading[];
  latestGlucose?: GlucoseReading; // For quick display
  hrv: HrvData;
  sleepSessions: SleepSession[];
  latestSleep?: SleepSession; // For quick display
  foodLogs: FoodLog[];
  supplementLogs: SupplementLog[];
  energyReports: EnergyReport[];
  // Mock data for recommendations
  supplementRecommendations: Record<string, { timing: string, interactionWarning?: string }>;
}

export const useBioDataStore = defineStore('bioData', {
  state: (): BioDataState => ({
    glucoseReadings: [ // Initial mock data
        { id: 'g1', value: 95, timestamp: new Date(Date.now() - 600000).toISOString(), trend: 'stable'},
        { id: 'g2', value: 98, timestamp: new Date().toISOString(), trend: 'up'},
    ],
    latestGlucose: { id: 'g2', value: 98, timestamp: new Date().toISOString(), trend: 'up'},
    hrv: { // Initial mock data
      currentRmsdd: 65,
      readinessScore: 75,
      stressLevel: 'low',
      lastReadingTimestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      dailyAverageRmsdd: 62,
    },
    sleepSessions: [ // Initial mock data
        { id: 's1', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], score: 82, durationMinutes: 7 * 60 + 45 },
    ],
    latestSleep: { id: 's1', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], score: 82, durationMinutes: 7 * 60 + 45 },
    foodLogs: [ // Initial mock data
        { id: 'f1', name: 'Chicken Salad', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), calories: 450, protein: 30, carbs: 15, fat: 25},
    ],
    supplementLogs: [],
    energyReports: [
        { level: 7, timestamp: new Date(Date.now() - 3600000).toISOString() }
    ],
    supplementRecommendations: { // Mock recommendations
      'Vitamin D': { timing: 'Morning with food', interactionWarning: 'May interact with certain medications.' },
      'Magnesium Glycinate': { timing: 'Evening, 30-60 mins before bed' },
      'Creatine Monohydrate': { timing: 'Anytime, daily' },
    }
  }),

  getters: {
    // Example getter for dashboard
    getLatestGlucoseValue: (state) => state.latestGlucose?.value,
    getLatestGlucoseTrend: (state) => state.latestGlucose?.trend,
    getLatestGlucoseTimestamp: (state) => state.latestGlucose?.timestamp,

    getHrvReadiness: (state) => state.hrv.readinessScore,
    getHrvCurrentRmsdd: (state) => state.hrv.currentRmsdd,
    getHrvLastReadingTimestamp: (state) => state.hrv.lastReadingTimestamp,

    getLatestSleepScore: (state) => state.latestSleep?.score,
    getLatestSleepDuration: (state) => {
        if (!state.latestSleep) return 'N/A';
        const hours = Math.floor(state.latestSleep.durationMinutes / 60);
        const minutes = state.latestSleep.durationMinutes % 60;
        return `${hours}h ${minutes}m`;
    },
    getLatestSleepDate: (state) => state.latestSleep?.date,

    getLatestEnergyReport: (state) => state.energyReports.length > 0 ? state.energyReports[state.energyReports.length - 1] : undefined,

    getSupplementRecommendation: (state) => (supplementName: string) => {
        return state.supplementRecommendations[supplementName];
    }
  },

  actions: {
    // --- Glucose Actions ---
    addGlucoseReading(reading: Omit<GlucoseReading, 'id' | 'timestamp'> & { timestamp?: string }) {
      const newReading: GlucoseReading = {
        ...reading,
        id: `g${Date.now()}`, // Simple ID generation
        timestamp: reading.timestamp || new Date().toISOString(),
      };
      this.glucoseReadings.push(newReading);
      this.latestGlucose = newReading;
      // TODO: Persist to backend
      console.log('Added glucose reading:', newReading);
    },

    // --- HRV Actions ---
    updateHrvData(data: Partial<HrvData>) {
      this.hrv = { ...this.hrv, ...data, lastReadingTimestamp: new Date().toISOString() };
      // TODO: Persist to backend
      console.log('Updated HRV data:', this.hrv);
    },

    // --- Sleep Actions ---
    addSleepSession(session: Omit<SleepSession, 'id' | 'date'> & { date?: string }) {
        const newSession: SleepSession = {
            ...session,
            id: `s${Date.now()}`,
            date: session.date || new Date().toISOString().split('T')[0],
        };
        this.sleepSessions.push(newSession);
        this.latestSleep = newSession;
        // TODO: Persist to backend
        console.log('Added sleep session:', newSession);
    },

    // --- Food Log Actions ---
    addFoodLog(log: Omit<FoodLog, 'id' | 'timestamp'> & { timestamp?: string }) {
        const newLog: FoodLog = {
            ...log,
            id: `f${Date.now()}`,
            timestamp: log.timestamp || new Date().toISOString(),
        };
        this.foodLogs.push(newLog);
        // TODO: Persist to backend
        console.log('Added food log:', newLog);
    },

    // --- Supplement Log Actions ---
    addSupplementLog(log: Omit<SupplementLog, 'id' | 'timestamp'> & { timestamp?: string }) {
      const newLog: SupplementLog = {
        ...log,
        id: `sup${Date.now()}`,
        timestamp: log.timestamp || new Date().toISOString(),
      };
      this.supplementLogs.push(newLog);
      // TODO: Persist to backend
      console.log('Added supplement log:', newLog);
    },

    // --- Energy Report Actions ---
    addEnergyReport(report: Omit<EnergyReport, 'timestamp'> & { timestamp?: string }) {
        const newReport: EnergyReport = {
            ...report,
            timestamp: report.timestamp || new Date().toISOString(),
        };
        this.energyReports.push(newReport);
        // TODO: Persist to backend
        console.log('Added energy report:', newReport);
    },

    // --- Simulate fetching initial data (can be called in app.vue or dashboard onMounted) ---
    async fetchInitialBioData() {
      console.log('Simulating fetching initial bio data...');
      // In a real app, this would be an API call
      // For now, we use the initial mock data in the state.
      // You could add more complex mock data loading here if needed.
      // Example: update HRV after a delay
      setTimeout(() => {
        this.updateHrvData({ currentRmsdd: (this.hrv.currentRmsdd || 60) + Math.floor(Math.random() * 10) - 5 });
      }, 5000);
    }
  },
});