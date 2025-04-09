'use client';

import { useState } from 'react';
import Card from './Card';
import { Droppable, Draggable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';

interface Card {
  id: string;
  title: string;
  description: string;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
  color: string;
}

interface ColumnProps {
  column: Column;
  onDelete: (columnId: string) => void;
  onEdit: (columnId: string) => void;
  onAddCard: (columnId: string, title: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onEditCard: (columnId: string, cardId: string, title: string, description: string) => void;
}

export default function Column({ 
  column, 
  onDelete, 
  onEdit,
  onAddCard,
  onDeleteCard,
  onEditCard
}: ColumnProps): JSX.Element {
  const [newCardTitle, setNewCardTitle] = useState('');

  return (
    <div className="w-72 flex-shrink-0">
      <div className="bg-gray-100 dark:bg-dark-700 rounded-lg h-full">
        <div 
          className="h-2 rounded-t-lg"
          style={{ backgroundColor: column.color }}
        />
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {column.title}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(column.id)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(column.id)}
                className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <Droppable droppableId={column.id} type="card">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-3 min-h-[50px]"
              >
                {column.cards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card
                          card={card}
                          isDragging={snapshot.isDragging}
                          onDelete={() => onDeleteCard(column.id, card.id)}
                          onEdit={(title, description) => onEditCard(column.id, card.id, title, description)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="mt-3">
            <input
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Add a card..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-800 dark:text-gray-200"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onAddCard(column.id, newCardTitle);
                  setNewCardTitle('');
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 