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
import ButtonLoadingSpinner from '@/components/loader/ButtonLoadingSpinner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { signIn } from '@/utils/api';
import { SIGNIN_SUCCESS, SIGNIN_FAIL, CLEAR_MESSAGE } from '@/redux/authSlice';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useMemo } from 'react';

const FormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { signInError } = useAppSelector((state) => state.auth);

  const {
    mutateAsync: userSignIn,
    data,
    isError,
    isSuccess,
    isPending,
    error,
  } = signIn();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await userSignIn(data);
    } catch (error) {
      console.log(error);
      return;
    }
    form.reset();
  }

  if (isSuccess) {
    dispatch(SIGNIN_SUCCESS(data));
    const profile = {
      user: data.data.user,
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    };

    localStorage.setItem('profile', JSON.stringify(profile));

    navigate('/');
  }

  useMemo(() => {
    if (isError) {
      dispatch(SIGNIN_FAIL((error as any).response.data.message));
    }
  }, [isError]);

  const handleClearError = () => {
    dispatch(CLEAR_MESSAGE());
  };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-6">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login your account
          </CardDescription>
        </CardHeader>

        {signInError ? (
          <div
            className="m-5 flex items-center rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
            role="alert"
          >
            <span className="ml-2 block sm:inline">{signInError} </span>
            <button
              className="ml-auto font-bold text-red-700"
              onClick={handleClearError}
            >
              <Cross2Icon />
            </button>
          </div>
        ) : (
          ''
        )}

        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
              <Button type="submit" className="w-full">
                {isPending ? (
                  <ButtonLoadingSpinner loadingText="Logging in ..." />
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <p className="text-sm font-light text-gray-500 text-center mb-5">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            SignUp here
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
