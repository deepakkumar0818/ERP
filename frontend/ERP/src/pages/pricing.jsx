import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        price: '₹4,999',
        period: '/month',
        description: 'Perfect for small manufacturers getting started.',
        features: [
            'Up to 5 users',
            'Inventory & Sales modules',
            'Basic reporting',
            'Email support',
            '10 GB storage',
        ],
        cta: 'Start Free Trial',
        highlighted: false,
    },
    {
        name: 'Growth',
        price: '₹14,999',
        period: '/month',
        description: 'For growing teams that need full manufacturing visibility.',
        features: [
            'Up to 25 users',
            'All core modules',
            'Advanced analytics',
            'Priority support',
            '100 GB storage',
            'API access',
            'Custom roles & permissions',
        ],
        cta: 'Start Free Trial',
        highlighted: true,
        badge: 'Most Popular',
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'Tailored for large-scale, multi-plant operations.',
        features: [
            'Unlimited users',
            'All modules + custom modules',
            'Dedicated success manager',
            'SLA-backed support',
            'Unlimited storage',
            'On-premise deployment option',
            'SSO & advanced security',
            'Custom integrations',
        ],
        cta: 'Talk to Sales',
        highlighted: false,
    },
];

const faq = [
    {
        q: 'Is there a free trial?',
        a: 'Yes — all plans include a 14-day free trial with no credit card required.',
    },
    {
        q: 'Can I change plans later?',
        a: 'Absolutely. You can upgrade or downgrade your plan at any time from your account settings.',
    },
    {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit/debit cards, UPI, NEFT, and bank transfers for annual plans.',
    },
    {
        q: 'Is implementation support included?',
        a: 'Growth and Enterprise plans include dedicated onboarding. Starter plans include self-service guides and docs.',
    },
];

export default function Pricing() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
            <Navbar />

            {/* Hero */}
            <section className="pt-36 pb-16 px-6 text-center bg-gradient-to-b from-indigo-50/60 to-white dark:from-indigo-950/30 dark:to-slate-950">
                <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    Pricing
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-2xl mx-auto">
                    Simple, transparent{' '}
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                        pricing
                    </span>
                </h1>
                <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                    Start free. Scale as you grow. No hidden fees.
                </p>
            </section>

            {/* Plans */}
            <section className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {plans.map(({ name, price, period, description, features, cta, highlighted, badge }) => (
                        <div
                            key={name}
                            className={`relative p-8 rounded-2xl border transition-all ${
                                highlighted
                                    ? 'border-indigo-500 bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30 scale-[1.02]'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg'
                            }`}
                        >
                            {badge && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900 flex items-center gap-1">
                                    <Zap className="h-3 w-3" /> {badge}
                                </span>
                            )}
                            <h3 className={`text-lg font-bold mb-1 ${highlighted ? 'text-white' : ''}`}>{name}</h3>
                            <p className={`text-sm mb-4 ${highlighted ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'}`}>{description}</p>
                            <div className="mb-6">
                                <span className={`text-4xl font-extrabold ${highlighted ? 'text-white' : ''}`}>{price}</span>
                                <span className={`text-sm ${highlighted ? 'text-indigo-200' : 'text-slate-400'}`}>{period}</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {features.map((f) => (
                                    <li key={f} className="flex items-start gap-2 text-sm">
                                        <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${highlighted ? 'text-indigo-200' : 'text-emerald-500'}`} />
                                        <span className={highlighted ? 'text-indigo-100' : ''}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to={cta === 'Talk to Sales' ? '#' : '/register'}
                                className={`w-full block text-center py-3 rounded-full font-semibold text-sm transition-all ${
                                    highlighted
                                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                            >
                                {cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="max-w-3xl mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold text-center mb-10">Frequently asked questions</h2>
                <div className="space-y-4">
                    {faq.map(({ q, a }) => (
                        <div key={q} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <h3 className="font-semibold mb-2">{q}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{a}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="pb-10 text-center">
                <Link to="/" className="text-sm text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
