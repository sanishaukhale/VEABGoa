
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (
    <footer className="bg-secondary text-secondary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3 text-primary">
              <Image src={`${basePath}/veab-logo.png`} alt="VEAB Logo" width={28} height={28} />
              <h3 className="text-xl font-semibold">Goa</h3>
            </Link>
            <p className="text-sm">
              A non-profit organization based in Keri- Sattari- Goa, dedicated towards environment education & wildlife conservation.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Events</Link></li>
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
              veab.goa@gmail.com <br />
              8806413360 / 9130555168
            </p>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm">
          <p>Made totally using AI and maintained by Sanish and Abhishek. © {new Date().getFullYear()} VEAB Goa.</p>
        </div>
      </div>
    </footer>
  );
}
