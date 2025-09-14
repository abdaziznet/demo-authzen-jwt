'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';
import { getConditionalContent } from '@/app/actions';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

function ConditionalContent() {
  const [requestedContent, setRequestedContent] = useState('a list of secret admin features');
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const role = user?.labels?.includes('admin') ? 'admin' : 'user';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAiResponse(null);
    try {
      const response = await getConditionalContent({ userRole: role, requestedContent });
      setAiResponse(response);
    } catch (error) {
      console.error("Failed to get conditional content", error);
      setAiResponse({isAuthorized: false, authorizedContent: "Error fetching content from AI."});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-6 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>AI-Powered Conditional Content</CardTitle>
        <CardDescription>
          This content is dynamically shown based on your user role, as determined by a GenAI model. You are currently logged in as a &quot;{role}&quot;.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="requested-content">Requested Content</Label>
            <Textarea
              id="requested-content"
              value={requestedContent}
              onChange={(e) => setRequestedContent(e.target.value)}
              placeholder="e.g., secret launch codes"
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? 'Analyzing...' : 'Request Content'}
          </Button>
        </form>

        {aiResponse && (
          <div className="mt-6 rounded-lg border bg-background p-4 animate-in fade-in-50">
            <h3 className="font-semibold text-lg">AI Authorization Response:</h3>
            {aiResponse.isAuthorized ? (
              <div className="mt-2 text-success">
                <p className="font-bold">Access Granted.</p>
                <p className="mt-1 text-foreground">{aiResponse.authorizedContent}</p>
              </div>
            ) : (
              <div className="mt-2 text-destructive">
                <p className="font-bold">Access Denied.</p>
                 <p className="mt-1 text-foreground/80">The AI determined you do not have permission to view this content.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-primary font-headline">AuthZen Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="outline" onClick={logout} className="hover:bg-accent hover:text-accent-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      
      <div className="p-4 md:p-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-4xl font-headline">Welcome to Your Dashboard</CardTitle>
            <CardDescription>Your session is securely managed. You can close this tab and you&apos;ll remain logged in.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is a protected area. Only authenticated users can see this page.</p>
          </CardContent>
        </Card>
        
        <ConditionalContent />
      </div>
    </div>
  );
}
