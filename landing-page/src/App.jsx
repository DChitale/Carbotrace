import { ThemeProvider } from './context/ThemeContext';
import { Analytics } from '@vercel/analytics/react';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { SocialProof } from './components/sections/SocialProof';
import { Problem } from './components/sections/Problem';
import { SolutionBento } from './components/sections/SolutionBento';
import { HowItWorks } from './components/sections/HowItWorks';
import { Faq } from './components/sections/Faq';
import { FinalCta } from './components/sections/FinalCta';
import { Footer } from './components/layout/Footer';

export function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-[#09090b] dark:text-[#fafafa] font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-900 dark:selection:text-emerald-200 transition-colors duration-200">
        <Analytics />

        {/* 1. Header (Sticky Glassmorphic Nav) */}
        <Header />

        <main className="flex-1">
          {/* 2. Hero (Viewport-fit Showcase + Quote) */}
          <Hero />

          {/* 3. Social Proof (Monochrome Ecosystem Logos) */}
          <SocialProof />

          {/* 4. Problem (The Invisible Carbon Debt) */}
          <Problem />

          {/* 5. Solution (3-Layer Intelligence Bento) */}
          <SolutionBento />

          {/* 6. How It Works (Interactive 3-Step Workflow) */}
          <HowItWorks />

          {/* 7. FAQ's (Keyboard Accessible Accordion) */}
          <Faq />

          {/* 8. Final CTA (CleanShot Aurora Banner) */}
          <FinalCta />
        </main>

        {/* 9. Footer (Multi-Column Developer Links) */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
