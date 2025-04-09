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
    <div className="w-72 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">{board.title}</h2>
      <Droppable droppableId={board.id}>
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2 min-h-[50px] bg-gray-50 p-2 rounded"
          >
            {board.cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided: DraggableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="transform transition-transform hover:scale-105"
                  >
                    <Card card={card} />
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
            className="w-full p-2 border rounded mb-2"
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
          className="mt-4 text-gray-600 hover:text-gray-800 w-full text-left p-2 hover:bg-gray-100 rounded"
        >
          + Add a card
        </button>
      )}
    </div>
  );
} 