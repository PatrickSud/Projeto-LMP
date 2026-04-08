import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { DailyLog, HabitTracking, Habit } from '../types';

export interface DayRecord {
  date: string;
  emotionLevel?: number;
  intention?: string;
  learned?: string;
  completedTasks: number;
  totalTasks: number;
  habitsDetails: { title: string, completed: boolean }[];
}

export function useJourney() {
  const [journeyData, setJourneyData] = useState<Record<string, DayRecord>>({});
  const [loading, setLoading] = useState(true);
  const userId = 'test-user';

  const fetchJourney = async () => {
    setLoading(true);
    try {
      const logsQ = query(collection(db, 'daily_logs'), where('userId', '==', userId));
      const trackingsQ = query(collection(db, 'habit_trackings'), where('userId', '==', userId));
      const habitsQ = query(collection(db, 'habits'), where('userId', '==', userId));

      const [logsSnap, trackingsSnap, habitsSnap] = await Promise.all([
        getDocs(logsQ),
        getDocs(trackingsQ),
        getDocs(habitsQ)
      ]);

      const activeHabits: Record<string, Habit> = {};
      habitsSnap.docs.forEach(d => {
        activeHabits[d.id] = { id: d.id, ...d.data() } as Habit;
      });

      const records: Record<string, DayRecord> = {};

      logsSnap.docs.forEach(d => {
        const data = d.data() as DailyLog;
        if (!records[data.date]) {
           records[data.date] = { date: data.date, completedTasks: 0, totalTasks: 0, habitsDetails: [] };
        }
        records[data.date].emotionLevel = data.emotionLevel;
        records[data.date].intention = data.intention;
        records[data.date].learned = data.learned;
      });

      const trackingsByDate: Record<string, HabitTracking[]> = {};
      trackingsSnap.docs.forEach(d => {
        const data = d.data() as HabitTracking;
        if (!trackingsByDate[data.date]) { trackingsByDate[data.date] = []; }
        trackingsByDate[data.date].push(data);
      });

      Object.keys(trackingsByDate).forEach(dateStr => {
         // Ajuste de fuso horário seguro
         const dateObj = new Date(`${dateStr}T12:00:00`);
         const dayOfWeek = dateObj.getDay();
         
         if (!records[dateStr]) {
            records[dateStr] = { date: dateStr, completedTasks: 0, totalTasks: 0, habitsDetails: [] };
         }

         const trackingsOfDate = trackingsByDate[dateStr];
         let completedCount = 0;
         const habitsDetails: {title: string, completed: boolean}[] = [];
         
         const scopedHabits = Object.values(activeHabits).filter(h => h.daysOfWeek.includes(dayOfWeek));
         
         scopedHabits.forEach(h => {
             const track = trackingsOfDate.find(t => t.habitId === h.id);
             const isCompleted = track?.completed || false;
             if (isCompleted) completedCount++;
             habitsDetails.push({ title: h.title, completed: isCompleted });
         });

         records[dateStr].completedTasks = completedCount;
         records[dateStr].totalTasks = scopedHabits.length;
         records[dateStr].habitsDetails = habitsDetails;
      });

      setJourneyData(records);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, []);

  return { journeyData, loading };
}
