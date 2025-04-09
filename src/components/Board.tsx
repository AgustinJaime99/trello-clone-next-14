'use client';

import { useState } from 'react';
import Card from './Card';
import { Droppable, Draggable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';

interface Card {
  id: string;
  title: string;
  description: string;
}

interface Board {
  id: string;
  title: string;
  cards: Card[];
}

interface BoardProps {
  board: Board;
  boards: Board[];
  setBoards: (boards: Board[]) => void;
}

export default function Board({ board, boards, setBoards }: BoardProps) {
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      const newCard = {
        id: Date.now().toString(),
        title: newCardTitle,
        description: '',
      };

      const updatedBoards = boards.map((b) =>
        b.id === board.id
          ? { ...b, cards: [...b.cards, newCard] }
          : b
      );

      setBoards(updatedBoards);
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  return (
    <div className="w-72 bg-white dark:bg-dark-800 rounded-lg shadow-card hover:shadow-card-hover p-4 transition-all duration-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{board.title}</h2>
      <Droppable droppableId={board.id}>
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2 min-h-[50px] bg-gray-50 dark:bg-dark-700 p-2 rounded transition-colors duration-200"
          >
            {board.cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided: DraggableProvided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`transform transition-transform duration-200 ${
                      snapshot.isDragging ? 'scale-105 rotate-1' : 'hover:scale-105'
                    }`}
                  >
                    <Card card={card} isDragging={snapshot.isDragging} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {isAddingCard ? (
        <div className="mt-4">
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Enter card title"
            className="w-full p-2 border dark:border-dark-600 rounded mb-2 bg-white dark:bg-dark-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddCard();
              }
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddCard}
              className="btn btn-primary"
            >
              Add Card
            </button>
            <button
              onClick={() => setIsAddingCard(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="mt-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition-colors duration-200"
        >
          + Add a card
        </button>
      )}
    </div>
  );
} 