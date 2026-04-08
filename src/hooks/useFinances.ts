import { useState, useEffect, useRef, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { FinanceRecord } from '../types';

// ── Helpers de navegação ────────────────────────────────────────────────────

/** Retorna a string "MM-YYYY" para o mês atual */
export function getCurrentMonthYear(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${month}-${now.getFullYear()}`;
}

/** Avança ou recua um "MM-YYYY" por N meses */
export function shiftMonthYear(monthYear: string, delta: number): string {
  const [m, y] = monthYear.split('-').map(Number);
  const date = new Date(y, m - 1 + delta, 1);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${month}-${date.getFullYear()}`;
}

// ── Hook principal ──────────────────────────────────────────────────────────

export function useFinances(monthYear: string) {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthNote, setMonthNote] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // userId estático, alinhado ao padrão dos outros hooks
  const userId = 'test-user';

  // ── Leitura de registros em tempo-real ─────────────────────────────────
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'finances'),
      where('userId', '==', userId),
      where('monthYear', '==', monthYear)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
          } as FinanceRecord;
        });
        loaded.sort((a, b) => b.date.getTime() - a.date.getTime());
        setRecords(loaded);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao ouvir finances:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, monthYear]);

  // ── Leitura da nota do mês ─────────────────────────────────────────────
  useEffect(() => {
    const noteId = `${userId}_${monthYear}`;
    const noteRef = doc(db, 'finance_notes', noteId);

    getDoc(noteRef)
      .then((snap) => {
        if (snap.exists()) {
          setMonthNote((snap.data() as { note: string }).note ?? '');
        } else {
          setMonthNote('');
        }
      })
      .catch((err) => console.error('Erro ao buscar nota do mês:', err));
  }, [userId, monthYear]);

  // ── Salvar nota com debounce de 800ms ──────────────────────────────────
  const saveMonthNote = useCallback(
    (text: string) => {
      setMonthNote(text);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        try {
          const noteId = `${userId}_${monthYear}`;
          await setDoc(
            doc(db, 'finance_notes', noteId),
            { userId, monthYear, note: text },
            { merge: true }
          );
        } catch (err) {
          console.error('Erro ao salvar nota do mês:', err);
        }
      }, 800);
    },
    [userId, monthYear]
  );

  // ── Adicionar registro ─────────────────────────────────────────────────
  const addRecord = async (
    type: 'income' | 'expense',
    amount: number,
    description: string,
    date: Date,
    category?: string
  ): Promise<boolean> => {
    try {
      await addDoc(collection(db, 'finances'), {
        userId,
        type,
        amount,
        description,
        date: Timestamp.fromDate(date),
        monthYear,
        category: category ?? '',
      });
      return true;
    } catch (error) {
      console.error('Erro ao adicionar finance record:', error);
      return false;
    }
  };

  // ── Excluir registro ───────────────────────────────────────────────────
  const deleteRecord = async (recordId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'finances', recordId));
    } catch (error) {
      console.error('Erro ao excluir finance record:', error);
    }
  };

  // ── Derivações ─────────────────────────────────────────────────────────
  const totalIncome = records
    .filter((r) => r.type === 'income')
    .reduce((acc, r) => acc + r.amount, 0);

  const totalExpense = records
    .filter((r) => r.type === 'expense')
    .reduce((acc, r) => acc + r.amount, 0);

  const balance = totalIncome - totalExpense;

  return {
    records,
    loading,
    monthNote,
    saveMonthNote,
    totalIncome,
    totalExpense,
    balance,
    addRecord,
    deleteRecord,
  };
}
