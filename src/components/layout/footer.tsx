
import { Leaf, Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3 text-primary">
              <Leaf size={28} />
              <h3 className="text-xl font-semibold">VEAB Goa</h3>
            </Link>
            <p className="text-sm">
              Dedicated to conserving and protecting the vibrant ecosystems of Goa.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Events</Link></li>
              <li><Link href="/donate" className="hover:text-primary transition-colors">Donate</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-primary transition-colors">
                <Facebook size={24} /> <span className="sr-only">Facebook</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-primary transition-colors">
                <Twitter size={24} /> <span className="sr-only">Twitter</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground hover:text-primary transition-colors">
                <Instagram size={24} /> <span className="sr-only">Instagram</span>
              </a>
            </div>
            <p className="text-sm mt-4">
              info@veabgoa.org <br />
              +91-123-456-7890 (Placeholder)
            </p>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} VEAB Goa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
