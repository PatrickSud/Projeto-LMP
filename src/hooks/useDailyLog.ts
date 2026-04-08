import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { DailyLog } from '../types';

const INITIAL_TASKS = [
  { id: '1', task: 'Beber 2L de água', completed: false },
  { id: '2', task: 'Meditação matinal (15 min)', completed: false },
  { id: '3', task: 'Revisar metas da semana', completed: false },
  { id: '4', task: 'Leitura antes de dormir', completed: false },
];

export function useDailyLog() {
  const [log, setLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);

  // Mocked user para esta etapa do projeto sem auth completo
  const userId = 'test-user';

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    const today = getTodayDate();
    const docId = `${userId}_${today}`;
    const docRef = doc(db, 'daily_logs', docId);

    const unsubscribe = onSnapshot(docRef, async (snapshot) => {
      if (snapshot.exists()) {
        setLog(snapshot.data() as DailyLog);
        setLoading(false);
      } else {
        const newLog: DailyLog = {
          id: today,
          userId,
          date: today,
          checklist: INITIAL_TASKS,
          intention: '',
        };
        
        try {
          await setDoc(docRef, newLog);
        } catch (error) {
          console.error("Erro ao criar daily log:", error);
          setLoading(false);
        }
      }
    }, (error) => {
      console.error("Erro ao ouvir daily log:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const toggleTask = async (taskId: string | number) => {
    if (!log) return;
    
    const docId = `${userId}_${log.date}`;
    const docRef = doc(db, 'daily_logs', docId);
    
    // Atualiza apenas localmente no merge field (firebase snapshot cuidará do estado)
    const updatedChecklist = log.checklist.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    
    try {
      await setDoc(docRef, { checklist: updatedChecklist }, { merge: true });
    } catch (error) {
      console.error("Erro ao atualizar a task:", error);
    }
  };

  const updateNote = async (text: string) => {
    if (!log) return;
    
    const docId = `${userId}_${log.date}`;
    const docRef = doc(db, 'daily_logs', docId);
    
    try {
      await setDoc(docRef, { intention: text }, { merge: true });
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
    }
  };

  return { log, loading, toggleTask, updateNote };
}
