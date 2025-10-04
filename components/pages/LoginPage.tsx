
import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { composeSurfaceClasses } from '../designSystem';

/**
 * Props for the LoginPage component.
 */
interface LoginPageProps {
    /**
     * Callback function executed upon successful Google login.
     * @param {CredentialResponse} credentialResponse - The response object from Google containing user credentials.
     */
    onLoginSuccess: (credentialResponse: CredentialResponse) => void;
}

/**
 * Renders the application's login page.
 * This component provides a clean, centered interface for users to sign in.
 * It features a prominent Google Login button to handle user authentication.
 *
 * @param {LoginPageProps} props - The component props.
 * @returns {JSX.Element} The login page component.
 */
const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    return (
        <div className="min-h-screen bg-neo-dark-1 px-4 py-12 text-gray-100">
            <div className="mx-auto flex max-w-lg items-center justify-center">
                <div className={composeSurfaceClasses('w-full space-y-6 p-8 text-center sm:p-10 bg-neo-dark-2/85 shadow-[0_36px_80px_-40px_rgba(0,0,0,0.85)]', 'elevated', 'lg')}>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neo-dark-1/85 shadow-inner shadow-black/50">
                        <TrendingUpIcon className="h-10 w-10 text-neo-green" />
                    </div>
                    <div className="space-y-2 text-right">
                        <h1 className="text-2xl font-bold text-white sm:text-3xl">به رایا خوش آمدید</h1>
                        <p className="text-sm leading-relaxed text-gray-300">
                            اولین نئوبروکر ایرانی برای دسترسی آسان به بازارهای مالی. برای شروع، وارد حساب کاربری خود شوید.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={onLoginSuccess}
                            onError={() => {
                                console.log('Login Failed');
                                alert('ورود با حساب گوگل با مشکل مواجه شد. لطفا دوباره تلاش کنید.');
                            }}
                            shape="pill"
                            theme="filled_blue"
                            size="large"
                            text="signin_with"
                            logo_alignment="center"
                        />
                    </div>
                    <p className="text-xs text-gray-400">
                        با ورود به رایا،{' '}
                        <a href="#" className="text-neo-green hover:text-neo-green/80">
                            شرایط و قوانین
                        </a>{' '}
                        را می‌پذیرید.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
