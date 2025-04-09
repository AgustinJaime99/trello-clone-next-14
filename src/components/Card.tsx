interface CardProps {
  card: {
    id: string;
    title: string;
    description: string;
  };
  isDragging?: boolean;
}

export default function Card({ card, isDragging = false }: CardProps) {
  return (
    <div className={`bg-white dark:bg-dark-800 border dark:border-dark-600 rounded-lg p-3 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-grab active:cursor-grabbing ${
      isDragging ? 'opacity-75' : ''
    }`}>
      <h3 className="font-medium text-gray-800 dark:text-gray-200">{card.title}</h3>
      {card.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{card.description}</p>
      )}
    </div>
  );
} 