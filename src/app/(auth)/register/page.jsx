'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { account, ID } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: 'Password must be at least 8 characters long.',
      });
      return;
    }
    setIsLoading(true);
    try {
      await account.create(ID.unique(), email, password);
      toast({
        title: 'Registration Successful',
        description: 'Please log in with your new account.',
      });
      router.push('/login');
    } catch (error) {
      console.error('Registration failed', error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'An error occurred during registration.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-center text-primary">Create an Account</CardTitle>
        <CardDescription className="text-center">Enter your email and password to register</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
            {!isLoading && <UserPlus className="ml-2 h-4 w-4" />}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline text-accent hover:text-accent/80">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
