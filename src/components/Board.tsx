'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Card {
  id: string;
  title: string;
  description: string;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

interface BoardProps {
  boardId: string;
}

export default function Board({ boardId }: BoardProps) {
  const [board, setBoard] = useState<{ id: string; title: string; columns: Column[] } | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isAddingCard, setIsAddingCard] = useState<string | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [editingCard, setEditingCard] = useState<{ id: string; title: string; description: string } | null>(null);
  const [showCardMenu, setShowCardMenu] = useState<string | null>(null);

  useEffect(() => {
    const savedBoards = sessionStorage.getItem('boards');
    if (savedBoards) {
      const boards = JSON.parse(savedBoards);
      const foundBoard = boards.find((b: any) => b.id === boardId);
      if (foundBoard) {
        // Asegurarse de que todos los IDs sean strings y únicos
        const normalizedBoard = {
          ...foundBoard,
          columns: foundBoard.columns.map((col: Column, index: number) => ({
            ...col,
            id: `column-${index}-${Date.now()}`,
            cards: col.cards.map((card: Card, cardIndex: number) => ({
              ...card,
              id: `card-${cardIndex}-${Date.now()}`
            }))
          }))
        };
        setBoard(normalizedBoard);
      }
    }

    // Hide scroll hint after 3 seconds
    const timer = setTimeout(() => {
      setShowScrollHint(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [boardId]);

  const handleAddColumn = () => {
    if (!newColumnTitle.trim() || !board) return;

    const savedBoards = sessionStorage.getItem('boards');
    if (!savedBoards) return;

    const boards = JSON.parse(savedBoards);
    const boardIndex = boards.findIndex((b: any) => b.id === boardId);
    
    if (boardIndex === -1) return;

    const newColumn: Column = {
      id: `column-${boards[boardIndex].columns.length}-${Date.now()}`,
      title: newColumnTitle,
      cards: []
    };

    boards[boardIndex].columns.push(newColumn);
    sessionStorage.setItem('boards', JSON.stringify(boards));
    setBoard(boards[boardIndex]);
    
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  const handleDeleteColumn = (columnId: string) => {
    if (!board) return;

    const savedBoards = sessionStorage.getItem('boards');
    if (!savedBoards) return;

    const boards = JSON.parse(savedBoards);
    const boardIndex = boards.findIndex((b: any) => b.id === boardId);
    
    if (boardIndex === -1) return;

    boards[boardIndex].columns = boards[boardIndex].columns.filter((col: Column) => col.id !== columnId);
    sessionStorage.setItem('boards', JSON.stringify(boards));
    setBoard(boards[boardIndex]);
  };

  const handleAddCard = (columnId: string) => {
    if (!newCardTitle.trim() || !board) return;

    const savedBoards = sessionStorage.getItem('boards');
    if (!savedBoards) return;

    const boards = JSON.parse(savedBoards);
    const boardIndex = boards.findIndex((b: any) => b.id === boardId);
    const columnIndex = boards[boardIndex].columns.findIndex((col: Column) => col.id === columnId);
    
    if (boardIndex === -1 || columnIndex === -1) return;

    const newCard: Card = {
      id: `card-${boards[boardIndex].columns[columnIndex].cards.length}-${Date.now()}`,
      title: newCardTitle,
      description: ''
    };

    boards[boardIndex].columns[columnIndex].cards.push(newCard);
    sessionStorage.setItem('boards', JSON.stringify(boards));
    setBoard(boards[boardIndex]);
    
    setNewCardTitle('');
    setIsAddingCard(null);
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    if (!board) return;

    const savedBoards = sessionStorage.getItem('boards');
    if (!savedBoards) return;

    const boards = JSON.parse(savedBoards);
    const boardIndex = boards.findIndex((b: any) => b.id === boardId);
    const columnIndex = boards[boardIndex].columns.findIndex((col: Column) => col.id === columnId);
    
    if (boardIndex === -1 || columnIndex === -1) return;

    boards[boardIndex].columns[columnIndex].cards = boards[boardIndex].columns[columnIndex].cards.filter(
      (card: Card) => card.id !== cardId
    );
    sessionStorage.setItem('boards', JSON.stringify(boards));
    setBoard(boards[boardIndex]);
    setShowCardMenu(null);
  };

  const handleEditCard = (columnId: string, card: Card) => {
    setEditingCard({ ...card });
    setShowCardMenu(null);
  };

  const handleSaveCard = (columnId: string, cardId: string) => {
    if (!editingCard || !board) return;

    const savedBoards = sessionStorage.getItem('boards');
    if (!savedBoards) return;

    const boards = JSON.parse(savedBoards);
    const boardIndex = boards.findIndex((b: any) => b.id === boardId);
    const columnIndex = boards[boardIndex].columns.findIndex((col: Column) => col.id === columnId);
    const cardIndex = boards[boardIndex].columns[columnIndex].cards.findIndex(
      (card: Card) => card.id === cardId
    );
    
    if (boardIndex === -1 || columnIndex === -1 || cardIndex === -1) return;

    boards[boardIndex].columns[columnIndex].cards[cardIndex] = editingCard;
    sessionStorage.setItem('boards', JSON.stringify(boards));
    setBoard(boards[boardIndex]);
    setEditingCard(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, columnId: string) => {
    if (e.key === 'Enter') {
      handleAddCard(columnId);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination || !board) return;

    const { source, destination } = result;
    
    // Crear una copia profunda del tablero
    const newBoard = JSON.parse(JSON.stringify(board));
    
    const sourceColumn = newBoard.columns.find((col: Column) => col.id === source.droppableId);
    const destColumn = newBoard.columns.find((col: Column) => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    // Mover la tarjeta
    const [movedCard] = sourceColumn.cards.splice(source.index, 1);
    destColumn.cards.splice(destination.index, 0, movedCard);

    // Actualizar el estado y el sessionStorage
    setBoard(newBoard);
    const savedBoards = sessionStorage.getItem('boards');
    if (savedBoards) {
      const boards = JSON.parse(savedBoards);
      const boardIndex = boards.findIndex((b: any) => b.id === boardId);
      if (boardIndex !== -1) {
        boards[boardIndex] = newBoard;
        sessionStorage.setItem('boards', JSON.stringify(boards));
      }
    }
  };

  if (!board) return null;

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{board.title}</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="relative">
          {showScrollHint && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
              Scroll →
            </div>
          )}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-dark-600 scrollbar-track-transparent">
            {board.columns.map((column) => (
              <div key={column.id} className="flex-none w-72">
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 h-full">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{column.title}</h3>
                    <button
                      onClick={() => handleDeleteColumn(column.id)}
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2 min-h-[100px]"
                      >
                        {column.cards.map((card, index) => (
                          <Draggable key={card.id} draggableId={card.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white dark:bg-dark-600 p-3 rounded-lg shadow-sm ${
                                  snapshot.isDragging ? 'ring-2 ring-primary-500' : ''
                                }`}
                              >
                                {editingCard?.id === card.id ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={editingCard.title}
                                      onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                                      className="w-full px-2 py-1 border border-gray-300 dark:border-dark-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
                                    />
                                    <textarea
                                      value={editingCard.description}
                                      onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                                      placeholder="Add description..."
                                      className="w-full px-2 py-1 border border-gray-300 dark:border-dark-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200"
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleSaveCard(column.id, card.id)}
                                        className="flex-1 py-1 px-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors duration-200 text-sm"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingCard(null)}
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
                                    <button
                                      onClick={() => setShowCardMenu(showCardMenu === card.id ? null : card.id)}
                                      className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                      </svg>
                                    </button>
                                    {showCardMenu === card.id && (
                                      <div className="absolute right-0 top-6 bg-white dark:bg-dark-700 rounded-lg shadow-lg py-1 w-40 z-10">
                                        <button
                                          onClick={() => handleEditCard(column.id, card)}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleEditCard(column.id, { ...card, description: card.description || '' })}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600"
                                        >
                                          Add Description
                                        </button>
                                        <button
                                          onClick={() => handleDeleteCard(column.id, card.id)}
                                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-dark-600"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {isAddingCard === column.id ? (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={newCardTitle}
                              onChange={(e) => setNewCardTitle(e.target.value)}
                              onKeyPress={(e) => handleKeyPress(e, column.id)}
                              placeholder="Enter card title"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200 mb-2"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAddCard(column.id)}
                                className="flex-1 py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
                              >
                                Add Card
                              </button>
                              <button
                                onClick={() => {
                                  setIsAddingCard(null);
                                  setNewCardTitle('');
                                }}
                                className="flex-1 py-2 px-4 bg-gray-200 dark:bg-dark-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors duration-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsAddingCard(column.id)}
                            className="w-full mt-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-left p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded transition-colors duration-200"
                          >
                            + Add a card
                          </button>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}

            <div className="flex-none w-72">
              {!isAddingColumn ? (
                <button
                  onClick={() => setIsAddingColumn(true)}
                  className="w-full h-full bg-gray-100 dark:bg-dark-700 rounded-lg p-4 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
                >
                  + Add Column
                </button>
              ) : (
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <input
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="Enter column title"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-gray-200 mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddColumn}
                      className="flex-1 py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
                    >
                      Add Column
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingColumn(false);
                        setNewColumnTitle('');
                      }}
                      className="flex-1 py-2 px-4 bg-gray-200 dark:bg-dark-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
} 