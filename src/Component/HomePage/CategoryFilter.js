import React from 'react';

const categories = [
  'All', 'Music','Gaming', 'News', 'Sports', 'Movies', 'Podcasts',
  'Education', 'Fashion', 'Travel', 'Food',
  'Comedy', 'Art',
  'VLogs', 'Fitness', 'Motivation','Nature',
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full overflow-x-auto shadow-sm py-3 px-4 flex items-center justify-between">
      <div className="flex gap-3 min-w-max">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)} 
            aria-pressed={selectedCategory === category}
            className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 
              ${
                selectedCategory === category
                ? 'bg-linear-to-r from-orange-200 via-red-400 to-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-linear-to-r from-orange-200 via-red-400 to-pink-600'
              }
              focus:outline-none focus:ring-2 focus:ring-black/50`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
