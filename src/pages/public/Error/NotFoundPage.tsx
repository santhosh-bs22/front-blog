import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary/20 mb-4">404</div>
          <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-left bg-card p-4 rounded-lg">
            <Search className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Double-check the URL</p>
              <p className="text-sm text-muted-foreground">
                Make sure you entered the correct address
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-left bg-card p-4 rounded-lg">
            <HelpCircle className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Need help?</p>
              <p className="text-sm text-muted-foreground">
                Contact our support team for assistance
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="flex items-center gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/blogs">Explore Blogs</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;