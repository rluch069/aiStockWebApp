'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import {useRouter} from "next/navigation";
import {signInAsDemo, signInWithEmail, signUpWithEmail} from "@/lib/actions/auth.actions";
import {toast} from "sonner";
import {useState} from "react";
import {DEMO_ACCOUNT} from "@/lib/demo-account";

const SignIn = () => {
    const router = useRouter()
    const [demoLoading, setDemoLoading] = useState(false)

    const onDemo = async () => {
        setDemoLoading(true)
        const result = await signInAsDemo()
        if (result.success) {
            router.push('/')
            router.refresh()
        } else {
            setDemoLoading(false)
            toast.error('Demo sign in failed.', {description: 'Please try again in a moment.'})
        }
    }
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data:SignInFormData) => {
        try {
            const result = await signInWithEmail(data);
            if(result.success) router.push('/');
        } catch (e){
            console.error(e);
            toast.error('Sign In Failed.', {description: e instanceof Error ? e.message : 'Failed to sign in. Please try again.'})
        }

    }
    return (
        <>
            <h1 className="form-title">Welcome back</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    placeholder="rluch069@uottawa.ca"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email is required', pattern: /^\w+@\w+\.\w+$/ }}
                />

                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Password is required', minLength: 8 }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing In' : 'Sign In'}
                </Button>

                <FooterLink text="Don't have an account?" linkText="Create an account" href="/sign-up" />
            </form>

            {process.env.NEXT_PUBLIC_DEV_MODE !== 'false' && (
                <div className="mt-8 rounded-xl border border-dashed border-gray-600 bg-gray-800/40 p-4">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Explore the demo — one click signs you in
                    </p>
                    <button
                        type="button"
                        onClick={onDemo}
                        disabled={demoLoading}
                        className="inline-flex h-9 items-center rounded-lg border border-gray-600 bg-gray-800 px-3.5 text-sm font-medium text-gray-100 shadow-sm transition-colors hover:border-yellow-500/60 hover:text-yellow-400 disabled:opacity-50"
                    >
                        {demoLoading ? 'Signing in…' : DEMO_ACCOUNT.name}
                    </button>
                    <p className="mt-3 text-xs leading-relaxed text-gray-500">
                        Signs in to a demo account with a sample watchlist and portfolio. All holdings are fictional.
                        Or sign in manually: <span className="font-mono">{DEMO_ACCOUNT.email}</span> / <span className="font-mono">{DEMO_ACCOUNT.password}</span>
                    </p>
                </div>
            )}
        </>
    );
};
export default SignIn;
