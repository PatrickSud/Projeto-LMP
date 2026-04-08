interface FeedbackSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function FeedbackSection({ value, onChange }: FeedbackSectionProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 mt-6 group">
      <h3 className="font-serif text-lg text-primary-dark mb-4 drop-shadow-sm">Feedback Diário</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Registe o seu Feedback Aqui..."
        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 min-h-[140px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white text-gray-700 placeholder:text-gray-400 transition-all shadow-inner"
      />
    </div>
  );
}
