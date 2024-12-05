"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Building2,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="relative text-white py-12 md:h-[45vh] mt-auto">
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/footer.jpg"
          alt="Footer background"
          fill
          className="object-cover brightness-50"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image
              src="/img/logo_white.jpg"
              alt="SNALV CONFSAL"
              width={300}
              height={80}
              className="mb-6"
            />
            <nav className="space-y-2">
              <Link
                href="/privacy-policy"
                className="block hover:text-gray-300"
              >
                Privacy Policy
              </Link>
              <Link href="/cookie-policy" className="block hover:text-gray-300">
                Cookie Policy
              </Link>
              <Link href="/termini" className="block hover:text-gray-300">
                Termini e Condizioni
              </Link>
            </nav>
          </div>

          <div className="flex items-center justify-center">
            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-2 rounded-md text-lg">
              ISCRIVITI
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 size={20} />
              <div>
                <h3 className="font-semibold mb-1">
                  SNALV CONFSAL - Segreteria nazionale
                </h3>
                <p>Via di Porta Maggiore, 9 - Roma</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone size={20} />
                <p>06 70492451</p>
              </div>
              <div className="flex items-center gap-2">
                <FaWhatsapp size={20} />
                <p>345 0511636</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={20} />
                <p>snalv@pec.it / info@snalv.it</p>
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="hover:text-gray-300">
                <Facebook size={24} />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Instagram size={24} />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <FaXTwitter size={24} />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Linkedin size={24} />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Youtube size={24} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
