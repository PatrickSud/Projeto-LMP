import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { WheelOfLife } from '../types';

export function useWheelOfLife() {
  const [wheelData, setWheelData] = useState<WheelOfLife | null>(null);
  const [loading, setLoading] = useState(true);
  
  // ID estático conforme as tuas instruções
  const userId = 'test-user';

  const fetchLatestRecord = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'wheel_of_life'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const records = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Ordena do mais recente para o mais antigo localmente
        records.sort((a: any, b: any) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        setWheelData(records[0] as WheelOfLife);
      }
    } catch (error) {
      console.error("Erro ao buscar a Roda da Vida:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestRecord();
  }, []);

  const saveWheelData = async (scores: Record<string, number>, feedback: string) => {
    try {
      const newRecord = {
        userId,
        scores,
        feedback,
        createdAt: new Date(),
      };
      
      const docRef = await addDoc(collection(db, 'wheel_of_life'), newRecord);
      
      const savedData = { id: docRef.id, ...newRecord } as unknown as WheelOfLife;
      setWheelData(savedData);
      return true;
    } catch (error) {
      console.error("Erro ao guardar a Roda da Vida:", error);
      return false;
    }
  };

  return { wheelData, loading, saveWheelData };
}
