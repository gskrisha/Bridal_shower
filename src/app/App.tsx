import { HeroSection } from './components/HeroSection';
import { BrideSection } from './components/BrideSection';
import { EventDetails } from './components/EventDetails';
import { ThemeSection } from './components/ThemeSection';
import { PhotoGallery } from './components/PhotoGallery';
import { MessageCards } from './components/MessageCards';
import { MessageForm } from './components/MessageForm';
import { HostsSection } from './components/HostsSection';
import { Footer } from './components/Footer';
import { DevDiagnostics } from './components/DevDiagnostics';

export default function App() {
  if (import.meta.env.DEV) console.log('App mounting (DEV)');
  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      {import.meta.env.DEV && (
        <div className="fixed top-4 right-4 bg-blue-50 text-blue-700 px-3 py-1 rounded shadow z-50 text-sm">DEV</div>
      )}
      {import.meta.env.DEV && <DevDiagnostics />}
      {/* Hero Section - Full Screen */}
      <HeroSection />

      {/* Bride Photo Section */}
      <BrideSection />

      {/* Event Details Section */}
      <EventDetails />

      {/* Theme Section */}
      <ThemeSection />

      {/* Photo Memories Gallery */}
      <PhotoGallery />

      {/* Message Cards Display */}
      <MessageCards />

      {/* Message Submission Form - Moved to end */}
      <MessageForm />

      {/* Hosts Section */}
      <HostsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}