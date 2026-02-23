'use client';

import AuthContainer from './_components/AuthContainer';
import { useRouter } from 'next/navigation';
import { loginAction, registerAction } from '../actions/authActions';

export default function AuthPage() {
  const router = useRouter();

  const handleLogin = async (values: any) => {
    const res = await loginAction({
      email: values.email,
      password: values.password,
    });
    const role = res.data.role;
    if (res.success) {
      if (role === "SYSTEM_ADMIN") {
        router.push('/admin');
      } else if (role === "USER") {
        router.push('/user');
      } else if (role === "LEGAL_OFFICER") {
        router.push('/legal-officer/dashboard');
      } else if (role === "LEGAL_SUPERVISOR") {
        router.push('/supervisor');
      } else if (role === "AGREEMENT_REVIEWER") {
        router.push('/agreement-reviewer/dashboard');
      } else if (role === "AGREEMENT_APPROVER") {
        router.push('/agreement-approver/dashboard');
      } else if (role === "MANAGEMENT") {
        router.push('/management/dashboard');
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
      router.push('/dashboard');
      return res.data;
    } else {
      throw { response: { data: { error: res.error } } };
    }
  };

  return <AuthContainer handleLogin={handleLogin} handleRegister={handleRegister} />;
}
