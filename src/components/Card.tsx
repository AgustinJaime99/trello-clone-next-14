'use client';

interface CardProps {
  card: {
    id: string;
    title: string;
    description: string;
  };
  isDragging: boolean;
}

export default function Card({ card, isDragging }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-dark-700 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200
        ${isDragging ? 'ring-2 ring-primary-500' : 'hover:ring-1 hover:ring-gray-200 dark:hover:ring-dark-600'}`}
    >
      <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-1">{card.title}</h3>
      {card.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
      )}
    </div>
  );
} 