import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, addDoc, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Habit, HabitTracking } from '../types';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [trackings, setTrackings] = useState<Record<string, HabitTracking>>({});
  const [loading, setLoading] = useState(true);
  const userId = 'test-user';

  // Buscar Hábitos Real-time
  useEffect(() => {
    const q = query(collection(db, 'habits'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedHabits = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Habit));
      setHabits(loadedHabits);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  // Função para buscar trackings de um determinado dia (YYYY-MM-DD)
  const fetchTrackingsForDate = useCallback(async (dateStr: string) => {
    const q = query(
      collection(db, 'habit_trackings'),
      where('userId', '==', userId),
      where('date', '==', dateStr)
    );
    const snapshot = await getDocs(q);
    const loadedTrackings: Record<string, HabitTracking> = {};
    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data() as HabitTracking;
      // Indexando localmente usando o habitId como chave
      loadedTrackings[data.habitId] = { id: docSnap.id, ...data };
    });
    
    // Merge para não subscrever trackings de outros dias em cache (se aplicável no futuro)
    setTrackings(prev => ({ ...prev, ...loadedTrackings }));
  }, [userId]);

  const addHabit = async (title: string, daysOfWeek: number[]) => {
    try {
      const newHabit = {
        userId,
        title,
        isActive: true,
        daysOfWeek
      };
      await addDoc(collection(db, 'habits'), newHabit);
      return true;
    } catch (error) {
      console.error("Erro ao adicionar hábito:", error);
      return false;
    }
  };

  const toggleHabitCompletion = async (habitId: string, dateStr: string, completed: boolean) => {
    try {
      const trackingId = `${userId}_${habitId}_${dateStr}`;
      const docRef = doc(db, 'habit_trackings', trackingId);
      
      const trackingData = {
        userId,
        habitId,
        date: dateStr,
        completed
      };

      await setDoc(docRef, trackingData, { merge: true });
      
      setTrackings(prev => ({
        ...prev,
        [habitId]: { id: trackingId, ...trackingData }
      }));
    } catch (error) {
      console.error("Erro ao alternar status do hábito:", error);
    }
  };

  // Desativar ou reativar um hábito
  const toggleHabitActive = async (habitId: string, isActive: boolean) => {
    try {
      const docRef = doc(db, 'habits', habitId);
      await setDoc(docRef, { isActive }, { merge: true });
    } catch (error) {
      console.error("Erro ao ocultar/ativar hábito", error);
    }
  };

  // Excluir permanentemente um hábito
  const deleteHabit = async (habitId: string) => {
    try {
      const docRef = doc(db, 'habits', habitId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Erro ao excluir hábito", error);
    }
  };

  return { habits, trackings, loading, addHabit, toggleHabitCompletion, fetchTrackingsForDate, toggleHabitActive, deleteHabit };
}
