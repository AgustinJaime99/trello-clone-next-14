'use client';

import { useState } from 'react';

interface Card {
  id: string;
  title: string;
  description: string;
}

interface CardProps {
  card: Card;
  isDragging: boolean;
  onDelete: () => void;
  onEdit: (title: string, description: string) => void;
}

export default function Card({ card, isDragging, onDelete, onEdit }: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);

  const handleSave = () => {
    onEdit(title, description);
    setIsEditing(false);
  };

  return (
    <div className={`bg-white dark:bg-dark-600 p-3 rounded-lg shadow-sm ${isDragging ? 'ring-2 ring-primary-500' : ''}`}>
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 dark:border-dark-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description..."
            className="w-full px-2 py-1 border border-gray-300 dark:border-dark-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-1 px-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors duration-200 text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-1 px-2 bg-gray-200 dark:bg-dark-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors duration-200 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <h4 className="text-gray-800 dark:text-gray-200">{card.title}</h4>
          {card.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{card.description}</p>
          )}
          <div className="absolute top-0 right-0 flex gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 