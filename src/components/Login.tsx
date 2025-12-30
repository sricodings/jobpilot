import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';
import { EMAILJS_CONFIG } from '../emailConfig';

interface LoginProps {
    onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
    const [step, setStep] = useState<'INPUT' | 'OTP'>('INPUT');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

    const ADMIN_EMAIL = 'srisrikanthtvs@gmail.com';

    const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const newOtp = generateOTP();
        setGeneratedOtp(newOtp);

        // Determine Logo URL
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        // Using a blue briefcase icon for localhost that matches the theme better
        const logoUrl = isLocalhost
            ? 'https://cdn-icons-png.flaticon.com/512/4059/4059271.png'
            : `${window.location.origin}/logo.png`;

        // Send Real Email via EmailJS
        const templateParams = {
            to_email: ADMIN_EMAIL,
            passcode: newOtp,
            img: logoUrl, // Changed to {{img}} as requested
        };

        try {
            // Explicitly initialize (sometimes helps with certain browser envs)
            emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

            await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams
            );

            setIsLoading(false);
            setStep('OTP');
            toast.success(`Authentication Code sent to your email`);
        } catch (err: any) {
            console.error('EmailJS Error:', err);
            setIsLoading(false);

            // Show specific error if available
            const errorMessage = err?.text || err?.message || 'Unknown error';
            toast.error(`Email Send Failed: ${errorMessage}`);

            // Fallback for development/demo
            setStep('OTP');
            toast(`[DEMO] OTP: ${newOtp}`, { icon: '🔑', duration: 6000 });
        }
    };

    const handleVerifyOtp = async (code: string) => {
        setIsLoading(true);
        setError('');

        // Simulate API verification delay
        setTimeout(() => {
            setIsLoading(false);
            if (code === generatedOtp || code === '123456') { // Keep 123456 as master key for testing
                onLogin();
            } else {
                const msg = 'Invalid OTP. Please try again.';
                setError(msg);
                toast.error(msg);
            }
        }, 1000);
    };

    const onOtpChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }

        // Auto-submit if full
        if (newOtp.every(digit => digit !== '') && index === 5) {
            handleVerifyOtp(newOtp.join(''));
        }
    };

    const onKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-navy-900 border border-navy-800 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 backdrop-blur-sm"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-400/20 mb-4">
                        <Flame className="text-navy-950 fill-navy-950" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Admin Access</h1>
                    <p className="text-navy-50 text-sm mt-2">
                        {step === 'INPUT'
                            ? 'Authenticate to access the dashboard'
                            : 'Verify your identity'
                        }
                    </p>
                </div>

                {step === 'INPUT' ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div className="text-center space-y-4">
                            <p className="text-slate-300 text-sm">
                                Click below to receive a One-Time Password (OTP) to your registered admin email address.
                            </p>
                            <div className="p-3 bg-navy-950 rounded-lg border border-navy-800 inline-block">
                                <span className="text-cyan-400 font-mono text-sm">{ADMIN_EMAIL}</span>
                            </div>
                        </div>

                        {error && <p className="text-rose-400 text-sm text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-navy-950 py-4 rounded-xl font-bold shadow-lg shadow-cyan-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    Send OTP <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-8">
                        <div className="text-center">
                            <p className="text-slate-300 text-sm">Enter the code sent to</p>
                            <p className="text-cyan-400 font-bold text-sm mt-1">{ADMIN_EMAIL}</p>
                        </div>

                        <div className="flex gap-3 justify-center">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => onOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => onKeyDown(index, e)}
                                    className="w-12 h-14 text-center bg-navy-950 border border-navy-800 rounded-xl text-slate-100 text-xl font-bold focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                                    autoComplete="one-time-code"
                                    inputMode="numeric"
                                />
                            ))}
                        </div>

                        {error && <p className="text-rose-400 text-sm text-center">{error}</p>}

                        <button
                            onClick={() => handleVerifyOtp(otp.join(''))}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-navy-950 py-4 rounded-xl font-bold shadow-lg shadow-cyan-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    Verify & Login <CheckCircle size={20} />
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => setStep('INPUT')}
                            className="w-full text-navy-50 text-sm hover:text-cyan-400 transition-colors"
                        >
                            Resend OTP
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
