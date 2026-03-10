import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { BookOpen, Video, Users, FileText, Rss, ArrowRight } from 'lucide-react';

const categories = [
    {
        icon: BookOpen,
        label: 'Documentation',
        description: 'Comprehensive developer docs, API references, and setup guides.',
        tag: 'Docs',
        color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
        icon: Video,
        label: 'Webinars',
        description: 'Live and on-demand sessions hosted by ERP experts and customers.',
        tag: 'Video',
        color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    },
    {
        icon: FileText,
        label: 'Case Studies',
        description: 'Real-world examples of manufacturers who scaled with our platform.',
        tag: 'Stories',
        color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    },
    {
        icon: Rss,
        label: 'Blog',
        description: 'Industry insights, product updates, and operational best practices.',
        tag: 'Articles',
        color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    },
    {
        icon: Users,
        label: 'Community',
        description: 'Connect with thousands of ERP users, share tips, and get answers fast.',
        tag: 'Community',
        color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    },
    {
        icon: BookOpen,
        label: 'Changelog',
        description: "Stay up to date with every feature release, fix, and improvement.",
        tag: 'Updates',
        color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    },
];

const featured = {
    title: 'AI Agents Guide 2025',
    description:
        'A practical guide for manufacturers on adopting AI-powered automation in inventory, production planning, and quality control.',
    tag: 'Featured',
};

export default function Resources() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
            <Navbar />

            {/* Hero */}
            <section className="pt-36 pb-16 px-6 text-center bg-gradient-to-b from-purple-50/60 to-white dark:from-purple-950/20 dark:to-slate-950">
                <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                    Resources
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-2xl mx-auto">
                    Learn, grow, and{' '}
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                        master your ERP
                    </span>
                </h1>
                <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                    Docs, guides, webinars, and community — everything you need to get the most out of our platform.
                </p>
            </section>

            {/* Featured */}
            <section className="max-w-6xl mx-auto px-6 py-12">
                <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="h-40 w-full md:w-64 rounded-xl bg-indigo-200/50 dark:bg-indigo-800/30 flex items-center justify-center text-indigo-400 shrink-0">
                        <BookOpen className="h-16 w-16 opacity-40" />
                    </div>
                    <div>
                        <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white">{featured.tag}</span>
                        <h2 className="text-2xl font-bold mb-3">{featured.title}</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{featured.description}</p>
                        <Link
                            to="#"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all"
                        >
                            Read Guide <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="max-w-6xl mx-auto px-6 py-8 pb-20">
                <h2 className="text-2xl font-bold mb-8">Explore by type</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map(({ icon: Icon, label, description, tag, color }) => (
                        <div
                            key={label}
                            className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer group"
                        >
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${color} bg-opacity-60 group-hover:scale-110 transition-transform`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{tag}</span>
                            <h3 className="font-bold text-lg mt-1 mb-2">{label}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
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
