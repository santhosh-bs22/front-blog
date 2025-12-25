import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Edit, Trash2, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBlog } from '@/contexts/BlogContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { formatDate } from '@/lib/formatters';

const DraftsPage: React.FC = () => {
  const { user } = useAuth();
  const { drafts, deleteDraft } = useBlog();
  const [search, setSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);

  const filteredDrafts = drafts.filter(draft =>
    draft.title.toLowerCase().includes(search.toLowerCase()) ||
    draft.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (draftId: string) => {
    setSelectedDraftId(draftId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDraftId) {
      deleteDraft(selectedDraftId);
      toast.success('Draft deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedDraftId(null);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to view drafts</h1>
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
      </div>
    );
  }

  const selectedDraft = selectedDraftId ? drafts.find(d => d.id === selectedDraftId) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Drafts</h1>
            <p className="text-muted-foreground mt-2">
              Your unpublished blog posts ({drafts.length} total)
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search drafts..."
                className="pl-10 w-full md:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Button asChild>
              <Link to="/blog/create">
                Create New
              </Link>
            </Button>
          </div>
        </div>

        {drafts.length === 0 ? (
          <Card className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No drafts saved</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start writing and save your work as a draft to come back to it later.
            </p>
            <Button asChild>
              <Link to="/blog/create">Create Your First Draft</Link>
            </Button>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{drafts.length}</div>
                  <div className="text-sm text-muted-foreground">Total Drafts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">
                    {drafts.filter(d => d.category).length}
                  </div>
                  <div className="text-sm text-muted-foreground">With Category</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">
                    {drafts.filter(d => d.coverImage).length}
                  </div>
                  <div className="text-sm text-muted-foreground">With Cover Image</div>
                </CardContent>
              </Card>
            </div>

            {/* Drafts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrafts.map((draft) => (
                <Card key={draft.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      {draft.category && (
                        <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                          {draft.category}
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <Link to={`/blog/edit/${draft.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(draft.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <Link to={`/blog/edit/${draft.id}`}>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {draft.title || 'Untitled Draft'}
                      </h3>
                      
                      {draft.excerpt && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {draft.excerpt}
                        </p>
                      )}
                      
                      {draft.coverImage && (
                        <div className="mb-3">
                          <img
                            src={draft.coverImage}
                            alt="Cover preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(draft.updatedAt)}
                        </div>
                        <div className="text-xs">
                          {Math.ceil(draft.content.length / 1000)} min read
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDrafts.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No drafts found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms
                </p>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Draft</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedDraft?.title || 'this draft'}"? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DraftsPage;