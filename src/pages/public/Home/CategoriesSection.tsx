import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '@/config/constants';

const CategoriesSection: React.FC = () => {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          🏷️ Explore Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={`/blogs?category=${category.id}`}
              className="group"
            >
              <div className="bg-card p-6 rounded-xl border hover:border-primary hover:shadow-lg transition-all duration-300 text-center">
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  Explore posts
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link
            to="/categories"
            className="inline-flex items-center text-primary hover:underline"
          >
            View all categories
            <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;