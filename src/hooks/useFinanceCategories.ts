import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// ── Categorias padrão ───────────────────────────────────────────────────────
export const DEFAULT_INCOME_CATEGORIES = [
  'Salário', 'Freelance', 'Investimentos', 'Presente', 'Outros',
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Alimentação', 'Moradia', 'Transporte', 'Saúde',
  'Educação', 'Lazer', 'Assinaturas', 'Roupas', 'Outros',
];

// ── Hook ────────────────────────────────────────────────────────────────────
export function useFinanceCategories() {
  const [incomeCategories, setIncomeCategories] = useState<string[]>(DEFAULT_INCOME_CATEGORIES);
  const [expenseCategories, setExpenseCategories] = useState<string[]>(DEFAULT_EXPENSE_CATEGORIES);
  const [loading, setLoading] = useState(true);

  const userId = 'test-user';

  // Leitura em tempo-real
  useEffect(() => {
    const docRef = doc(db, 'finance_categories', userId);
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setIncomeCategories(data.income ?? DEFAULT_INCOME_CATEGORIES);
          setExpenseCategories(data.expense ?? DEFAULT_EXPENSE_CATEGORIES);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Erro ao carregar categorias:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  // Persistir estado completo no Firestore
  const persist = async (income: string[], expense: string[]) => {
    const docRef = doc(db, 'finance_categories', userId);
    await setDoc(docRef, { income, expense }, { merge: true });
  };

  // Adicionar nova categoria
  const addCategory = async (type: 'income' | 'expense', name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const prevIncome = incomeCategories;
    const prevExpense = expenseCategories;

    const newIncome = type === 'income' ? [...incomeCategories, trimmed] : incomeCategories;
    const newExpense = type === 'expense' ? [...expenseCategories, trimmed] : expenseCategories;

    // Atualização otimista
    if (type === 'income') setIncomeCategories(newIncome);
    else setExpenseCategories(newExpense);

    try {
      await persist(newIncome, newExpense);
    } catch (err) {
      console.error('Erro ao salvar categoria:', err);
      // Reverter
      setIncomeCategories(prevIncome);
      setExpenseCategories(prevExpense);
    }
  };

  // Remover categoria
  const removeCategory = async (type: 'income' | 'expense', name: string) => {
    const prevIncome = incomeCategories;
    const prevExpense = expenseCategories;

    const newIncome = type === 'income' ? incomeCategories.filter((c) => c !== name) : incomeCategories;
    const newExpense = type === 'expense' ? expenseCategories.filter((c) => c !== name) : expenseCategories;

    if (type === 'income') setIncomeCategories(newIncome);
    else setExpenseCategories(newExpense);

    try {
      await persist(newIncome, newExpense);
    } catch (err) {
      console.error('Erro ao remover categoria:', err);
      setIncomeCategories(prevIncome);
      setExpenseCategories(prevExpense);
    }
  };

  return { incomeCategories, expenseCategories, loading, addCategory, removeCategory };
}
