'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useStore } from '@/hooks/useStore';

const formSchema = z.object({
  password: z.string().min(4),
});

export default function PasswordForm() {
  const setPassword = useStore((state) => state.setPassword);
  const validatePassword = useStore((state) => state.validatePassword);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setPassword(data.password);
    validatePassword(data.password).then((isAuthenticated) => {
      if (!isAuthenticated) {
        form.setError('password', {
          type: 'manual',
          message: 'Invalid password',
        });
      }
    });
  }

  return (
    <Form {...form}>
      <main className="w-full flex justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-4 flex flex-col items-center justify-center max-w-[320px]"
        >
          <h1>Time Planner</h1>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormDescription>
                  To use this app in your current browser, please enter the
                  password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </main>
    </Form>
  );
}
