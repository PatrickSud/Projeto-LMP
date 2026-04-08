import { CircularTracker } from '../components/dashboard/CircularTracker';
import { EmotionSelector } from '../components/dashboard/EmotionSelector';
import { DailyChecklist } from '../components/dashboard/DailyChecklist';
import { NoteCard } from '../components/dashboard/NoteCard';
import { DailyFinanceSummary } from '../components/dashboard/DailyFinanceSummary';
import { WheelMiniCard } from '../components/dashboard/WheelMiniCard';

export function Dashboard() {
  return (
    <div className="px-6 pt-12 pb-8 max-w-md mx-auto">
      <header className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-primary-dark leading-tight">
          Bem-vinda<br/>ao novo Ciclo!
        </h1>
        <p className="text-gray-500 mt-2 text-[15px]">O que vamos realizar hoje?</p>
      </header>
      
      <CircularTracker />
      <WheelMiniCard />
      <EmotionSelector />
      <DailyChecklist />
      <DailyFinanceSummary />
      <NoteCard />
    </div>
  );
}
