export const EMOTIONS = [
  { level: 700, label: 'Iluminação', color: 'bg-yellow-100 text-yellow-700', hex: '#ca8a04' },
  { level: 600, label: 'Paz', color: 'bg-cyan-100 text-cyan-700', hex: '#0891b2' },
  { level: 540, label: 'Alegria', color: 'bg-orange-100 text-orange-700', hex: '#c2410c' },
  { level: 500, label: 'Amor', color: 'bg-rose-100 text-rose-700', hex: '#e11d48' },
  { level: 400, label: 'Razão', color: 'bg-blue-100 text-blue-700', hex: '#1d4ed8' },
  { level: 350, label: 'Aceitação', color: 'bg-teal-100 text-teal-700', hex: '#0f766e' },
  { level: 310, label: 'Disposição', color: 'bg-green-100 text-green-700', hex: '#15803d' },
  { level: 250, label: 'Neutralidade', color: 'bg-gray-100 text-gray-700', hex: '#374151' },
  { level: 200, label: 'Coragem', color: 'bg-violet-100 text-violet-700', hex: '#6d28d9' },
  { level: 175, label: 'Orgulho', color: 'bg-red-50 text-red-700', hex: '#b91c1c' },
  { level: 150, label: 'Raiva', color: 'bg-red-100 text-red-800', hex: '#991b1b' },
  { level: 125, label: 'Desejo', color: 'bg-pink-100 text-pink-700', hex: '#be185d' },
  { level: 100, label: 'Medo', color: 'bg-stone-200 text-stone-700', hex: '#44403c' },
  { level: 76, label: 'Tristeza', color: 'bg-indigo-100 text-indigo-700', hex: '#4338ca' },
  { level: 50, label: 'Apatia', color: 'bg-gray-200 text-gray-500', hex: '#6b7280' },
  { level: 30, label: 'Culpa', color: 'bg-zinc-800 text-zinc-300', hex: '#27272a' },
  { level: 20, label: 'Vergonha', color: 'bg-black text-gray-300', hex: '#000000' },
];

export const getEmotionMeta = (level: number) => {
  return EMOTIONS.find(e => e.level === level) || null;
}
