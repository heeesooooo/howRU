import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface UserData {
  id: number;
  lastPeriodDate: string;
  cycleLength: number;
  periodLength: number;
  createdAt: string;
  updatedAt: string;
}

interface HowRUDB extends DBSchema {
  userData: {
    key: number;
    value: UserData;
  };
}

let db: IDBPDatabase<HowRUDB> | null = null;

const initDB = async (): Promise<IDBPDatabase<HowRUDB>> => {
  if (db) return db;
  
  db = await openDB<HowRUDB>('HowRUDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('userData')) {
        db.createObjectStore('userData', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  
  return db;
};

export const saveUserData = async (data: Omit<UserData, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
  const database = await initDB();
  const now = new Date().toISOString();
  
  // Check if data already exists
  const existingData = await database.getAll('userData');
  
  if (existingData.length > 0) {
    // Update existing data
    const updated: UserData = {
      ...existingData[0],
      ...data,
      updatedAt: now,
    };
    await database.put('userData', updated);
  } else {
    // Create new data
    const newData: UserData = {
      id: 1,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    await database.add('userData', newData);
  }
};

export const getUserData = async (): Promise<UserData | null> => {
  try {
    const database = await initDB();
    const allData = await database.getAll('userData');
    return allData.length > 0 ? allData[0] : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const clearUserData = async (): Promise<void> => {
  const database = await initDB();
  await database.clear('userData');
};

// Helper functions for cycle calculations
export const calculatePhases = (lastPeriodDate: string, cycleLength: number, periodLength: number) => {
  const startDate = new Date(lastPeriodDate);
  const today = new Date();
  
  // Calculate days since last period
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentCycleDay = (daysSinceStart % cycleLength) + 1;
  
  // Phase definitions
  const phases = {
    menstrual: { start: 1, end: periodLength, color: '#F2762E', name: '휴식 기간' },
    follicular: { start: periodLength + 1, end: 13, color: '#F2AF5C', name: '에너지 업 기간' },
    ovulation: { start: 14, end: 15, color: '#F2CA50', name: '스파크 기간' },
    luteal: { start: 16, end: cycleLength, color: '#74A65D', name: '컨트롤 기간' }
  };
  
  // Determine current phase
  let currentPhase = 'luteal';
  if (currentCycleDay >= phases.menstrual.start && currentCycleDay <= phases.menstrual.end) {
    currentPhase = 'menstrual';
  } else if (currentCycleDay >= phases.follicular.start && currentCycleDay <= phases.follicular.end) {
    currentPhase = 'follicular';
  } else if (currentCycleDay >= phases.ovulation.start && currentCycleDay <= phases.ovulation.end) {
    currentPhase = 'ovulation';
  }
  
  return {
    currentCycleDay,
    currentPhase,
    phases,
    nextPeriodDate: new Date(startDate.getTime() + cycleLength * 24 * 60 * 60 * 1000)
  };
};