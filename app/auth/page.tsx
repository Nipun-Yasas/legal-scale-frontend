'use client';

import AuthContainer from './_components/AuthContainer';
import { useRouter } from 'next/navigation';
import { loginAction, registerAction } from '../actions/authActions';
import { useAuth } from '@/context/AuthContext';

export default function AuthPage() {
  const router = useRouter();
  const { checkUser } = useAuth();

  const handleLogin = async (values: any) => {
    const res = await loginAction({
      email: values.email,
      password: values.password,
    });
    const role = res.data.role;
    if (res.success) {
      await checkUser();

      if (role === "SYSTEM_ADMIN") {
        router.push('/admin');
      } else if (role === "USER") {
        router.push('/user');
      } else if (role === "LEGAL_OFFICER") {
        router.push('/officer');
      } else if (role === "LEGAL_SUPERVISOR") {
        router.push('/supervisor');
      } else if (role === "MANAGEMENT") {
        router.push('/manager');
      } else {
        router.push('/dashboard');
      }
      return res.data;
    } else {
      // Throw an error in a shape that the child component catch-blocks expect
      // Like Axios error structure
      throw { response: { data: { error: res.error } } };
    }
  };

  const handleRegister = async (values: any) => {
    const res = await registerAction({
      name: values.name,
      email: values.email,
      password: values.password,
      roleName: "USER"
    });

    if (res.success) {
      await checkUser();
      router.push('/dashboard');
      return res.data;
    } else {
      throw { response: { data: { error: res.error } } };
    }
  };

  return <AuthContainer handleLogin={handleLogin} handleRegister={handleRegister} />;
}
