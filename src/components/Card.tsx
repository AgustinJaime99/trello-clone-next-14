interface CardProps {
  card: {
    id: string;
    title: string;
    description: string;
  };
}

export default function Card({ card }: CardProps) {
  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing">
      <h3 className="font-medium text-gray-800">{card.title}</h3>
      {card.description && (
        <p className="text-sm text-gray-600 mt-1">{card.description}</p>
      )}
    </div>
  );
} 