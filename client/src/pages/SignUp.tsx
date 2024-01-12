import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { signUpUser } from '@/redux/authSlice';
import { useNavigate } from 'react-router-dom';
import ButtonLoadingSpinner from '@/components/loader/ButtonLoadingSpinner';

const FormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .refine(
      (value: string) =>
        /[A-Z]/.test(value) && /[^a-zA-Z\d]/.test(value) && /\d/.test(value),
      {
        message:
          'Password must contain at least one uppercase letter, one special character, and one number.',
      }
    ),
});

const SignUp = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, signUpSuccess, success, signUpError } = useAppSelector(
    (state) => state.auth
  );
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await dispatch(signUpUser(data));

    if (success) {
      navigate('/signin');
    }
    form.reset();
  }
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-6">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className=" grid gap-2 mb-5">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} type="text" />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2 mb-5">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@email.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2 mb-5">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <ButtonLoadingSpinner loadingText="Signing up.." />
                ) : (
                  <span>Create account</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <p className="text-sm font-light text-gray-500 text-center mb-5">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Login here
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default SignUp;
