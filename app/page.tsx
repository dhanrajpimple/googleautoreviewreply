import Link from 'next/link';
import { CheckCircle, MessageSquare, Star, ArrowRight } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <header className="px-4 lg:px-6 h-16 flex items-center border-b">
                <Link className="flex items-center justify-center text-xl font-bold text-primary" href="/">
                    ReviewReply
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
                        Login
                    </Link>
                    <Link
                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        href="/signup"
                    >
                        Get Started
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-slate-50">
                    <div className="container px-4 md:px-6 mx-auto text-center">
                        <div className="space-y-4 max-w-3xl mx-auto">
                            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                                Auto-Reply to Google Reviews Instantly
                            </h1>
                            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-2xl/relaxed">
                                Connect your Google Business Profile and automatically send personalized thank-you messages to every customer review. 100% Free. No credit card required.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                                <Link
                                    className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    href="/signup"
                                >
                                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6 mx-auto">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-primary text-2xl font-bold">1</div>
                                <h3 className="text-xl font-bold">Connect Profile</h3>
                                <p className="text-gray-500">Securely connect your Google Business Profile with one click.</p>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-primary text-2xl font-bold">2</div>
                                <h3 className="text-xl font-bold">Set Templates</h3>
                                <p className="text-gray-500">Define custom messages for each star rating (1-5 stars).</p>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-primary text-2xl font-bold">3</div>
                                <h3 className="text-xl font-bold">Sit Back & Relax</h3>
                                <p className="text-gray-500">We automatically reply to new reviews as they come in.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">Built for Busy Business Owners</h2>
                                <div className="space-y-4">
                                    {[
                                        "Auto replies based on star rating",
                                        "Fully customizable messages",
                                        "Works 24/7 automatically",
                                        "100% free forever",
                                        "Easy setup in 2 minutes",
                                        "Dashboard to track all reviews"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className="text-lg text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                </div>
                                <p className="text-lg font-medium italic text-slate-700 mb-4">
                                    "Great service! Really enjoyed my visit today. Staff was super helpful."
                                </p>
                                <div className="pl-4 border-l-4 border-primary bg-slate-50 p-4 rounded-r-md">
                                    <p className="text-sm font-bold text-primary mb-1">Reply from Owner:</p>
                                    <p className="text-sm text-slate-600">
                                        Thank you so much for your wonderful 5-star review! 🌟 We are absolutely thrilled to hear you had such a great experience with us...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="w-full py-6 border-t px-4 md:px-6">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">© 2024 ReviewReply. All rights reserved.</p>
                    <nav className="flex gap-4 sm:gap-6">
                        <Link className="text-xs hover:underline underline-offset-4" href="#">
                            Terms of Service
                        </Link>
                        <Link className="text-xs hover:underline underline-offset-4" href="#">
                            Privacy
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
