import { useState } from 'react';

interface EditColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, color: string) => void;
  initialTitle: string;
  initialColor: string;
}

const colors = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Green', value: '#10b981' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Gray', value: '#94a3b8' }
];

export default function EditColumnModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialTitle, 
  initialColor 
}: EditColumnModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [color, setColor] = useState(initialColor);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Edit Column</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Column Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200"
            placeholder="Enter column title"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Column Color
          </label>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((colorOption) => (
              <button
                key={colorOption.value}
                onClick={() => setColor(colorOption.value)}
                className={`h-8 rounded-md border-2 ${
                  color === colorOption.value ? 'border-primary-500' : 'border-transparent'
                }`}
                style={{ backgroundColor: colorOption.value }}
                title={colorOption.name}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(title, color)}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 