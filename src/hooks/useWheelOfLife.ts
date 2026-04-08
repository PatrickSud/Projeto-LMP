import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { WheelOfLife } from '../types';

export function useWheelOfLife() {
  const [allWheelData, setAllWheelData] = useState<WheelOfLife[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = 'test-user';

  useEffect(() => {
    const q = query(
      collection(db, 'wheel_of_life'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const records = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            ...data,
            id: docSnap.id,
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : new Date(data.createdAt),
          } as WheelOfLife;
        });

        // Mais recente primeiro
        records.sort((a, b) => {
          const ta = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const tb = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return tb - ta;
        });

        setAllWheelData(records);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao buscar a Roda da Vida:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Registro mais recente — retrocompatibilidade com Vida.tsx
  const wheelData = allWheelData[0] ?? null;

  // Mapa por data (YYYY-MM-DD) para lookup no Jornada
  const wheelByDate = allWheelData.reduce(
    (map, record) => {
      const d =
        record.createdAt instanceof Date
          ? record.createdAt
          : new Date(record.createdAt as unknown as string);
      const dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
      // Mantém apenas a avaliação mais recente do dia
      if (!map[dateStr]) map[dateStr] = record;
      return map;
    },
    {} as Record<string, WheelOfLife>
  );

  const saveWheelData = async (
    scores: Record<string, number>,
    feedback: string
  ): Promise<boolean> => {
    try {
      await addDoc(collection(db, 'wheel_of_life'), {
        userId,
        scores,
        feedback,
        createdAt: new Date(),
      });
      return true;
    } catch (error) {
      console.error('Erro ao guardar a Roda da Vida:', error);
      return false;
    }
  };

  return { wheelData, allWheelData, wheelByDate, loading, saveWheelData };
}
