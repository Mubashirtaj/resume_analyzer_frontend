'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Upload,
  Sparkles,
  Edit3,
  Briefcase,
  Zap,
  CheckCircle2,
  ArrowRight,
  FileText,
  Brain,
  Palette,
  Search,
  Mail,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['home', 'features', 'how-it-works', 'pricing', 'contact'];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-slate-900/95 backdrop-blur-lg border-b border-slate-800' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">ResumeAI</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className={`transition-colors ${
                activeSection === 'home' ? 'text-blue-500' : 'text-slate-300 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`transition-colors ${
                activeSection === 'features' ? 'text-blue-500' : 'text-slate-300 hover:text-white'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`transition-colors ${
                activeSection === 'how-it-works' ? 'text-blue-500' : 'text-slate-300 hover:text-white'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className={`transition-colors ${
                activeSection === 'pricing' ? 'text-blue-500' : 'text-slate-300 hover:text-white'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`transition-colors ${
                activeSection === 'contact' ? 'text-blue-500' : 'text-slate-300 hover:text-white'
              }`}
            >
              Contact
            </button>
          </div>

          <Button
            // onClick={() => scrollToSection('pricing')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href={'/signup'}>
            Get Started
            </Link>
          </Button>
        </div>
      </nav>

      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-block mb-6 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
            <span className="text-blue-400 text-sm font-semibold">AI-Powered CV Enhancement</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Transform Your Resume
            <br />
            Land Your Dream Job
          </h1>

          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Upload your CV and let our AI analyze, optimize, and design it professionally. Get
            personalized job recommendations and edit your resume with our intuitive editor.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => scrollToSection('how-it-works')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => scrollToSection('features')}
              variant="outline"
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">10K+</div>
              <div className="text-slate-400">Resumes Enhanced</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-slate-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">500+</div>
              <div className="text-slate-400">Companies</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">Powerful Features</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to create the perfect resume and land your next job
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Upload className="w-8 h-8" />}
              title="Upload & Analyze"
              description="Upload your CV in any format. Our AI analyzes content, structure, and keywords instantly."
            />
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="AI Optimization"
              description="Get intelligent suggestions to improve content, grammar, and impact of your resume."
            />
            <FeatureCard
              icon={<Palette className="w-8 h-8" />}
              title="Professional Design"
              description="AI designs your CV with modern templates. Edit like Canva with drag-and-drop."
            />
            <FeatureCard
              icon={<Search className="w-8 h-8" />}
              title="Job Finder"
              description="Get personalized job recommendations based on your skills and experience."
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-32 px-6 bg-slate-900/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Get your perfect resume in just 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

            <StepCard
              number="01"
              title="Upload Your CV"
              description="Drag and drop or upload your existing resume in PDF, DOCX, or TXT format."
              icon={<Upload className="w-6 h-6" />}
            />
            <StepCard
              number="02"
              title="AI Analysis"
              description="Our AI analyzes your content and provides detailed improvement suggestions."
              icon={<Brain className="w-6 h-6" />}
            />
            <StepCard
              number="03"
              title="Design & Edit"
              description="Choose from AI-designed templates and customize with our intuitive editor."
              icon={<Edit3 className="w-6 h-6" />}
            />
            <StepCard
              number="04"
              title="Download & Apply"
              description="Export your polished resume and get matched with relevant job opportunities."
              icon={<Briefcase className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Start with 3 free credits. Add your Gemini API key for unlimited access.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur relative overflow-hidden group hover:border-blue-500 transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
                  <div className="text-5xl font-bold mb-4">
                    3 <span className="text-2xl text-slate-400">credits</span>
                  </div>
                  <p className="text-slate-400">Perfect to get started</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <PricingFeature text="AI Resume Analysis" />
                  <PricingFeature text="Content Optimization" />
                  <PricingFeature text="Basic Templates" />
                  <PricingFeature text="Job Recommendations" />
                </ul>

                <Button className="w-full text-white bg-slate-700 hover:bg-slate-600">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0 backdrop-blur relative overflow-hidden group">
              <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full">
                POPULAR
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Unlimited</h3>
                  <div className="text-5xl font-bold mb-4">
                    <span className="text-2xl">Your</span> API Key
                  </div>
                  <p className="text-blue-100">Unlimited everything</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <PricingFeature text="Unlimited AI Analysis" />
                  <PricingFeature text="Advanced Optimization" />
                  <PricingFeature text="Premium Templates" />
                  <PricingFeature text="Priority Job Matching" />
                  <PricingFeature text="Canva-style Editor" />
                  <PricingFeature text="Export in Multiple Formats" />
                </ul>

                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                  Add API Key
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 px-6 bg-slate-900/50 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">Get In Touch</h2>
            <p className="text-xl text-slate-400">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      placeholder="Your name"
                      className="bg-slate-900/50 border-slate-700 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="bg-slate-900/50 border-slate-700 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    placeholder="Tell us how we can help..."
                    rows={6}
                    className="bg-slate-900/50 border-slate-700 focus:border-blue-500"
                  />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Send Message
                  <Mail className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">ResumeAI</span>
            </div>

            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            <p className="text-slate-400 text-sm">
              © 2024 ResumeAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur hover:border-blue-500 transition-all duration-300 group">
      <CardContent className="p-8">
        <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-colors">
          <div className="text-blue-400">{icon}</div>
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur hover:border-blue-500 transition-all duration-300 relative z-10">
      <CardContent className="p-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 font-bold text-2xl">
          {number}
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="text-blue-400">{icon}</div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
      <span>{text}</span>
    </li>
  );
}
