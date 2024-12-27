"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="relative text-white py-12 md:h-[45vh] mt-auto border-t-4 border-white">
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
              <div className="h-[30px] w-[30px] relative">
                <Image
                  src="/icon/snalv.jpg"
                  alt="Phone"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  SNALV CONFSAL - Segreteria nazionale
                </h3>
                <p>Via di Porta Maggiore, 9 - Roma</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-[30px] w-[30px] relative">
                  <Image
                    src="/icon/phone.jpg"
                    alt="Phone"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <p>06 70492451</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-[30px] w-[30px] relative">
                  <Image
                    src="/icon/whatsapp.jpg"
                    alt="WhatsApp"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <p>345 0511636</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-[30px] w-[30px] relative">
                  <Image
                    src="/icon/email.jpg"
                    alt="Email"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <p>snalv@pec.it / info@snalv.it</p>
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="h-[45px] w-[45px] relative">
                <Image
                  src="/icon/facebook.jpg"
                  alt="Facebook"
                  fill
                  className="object-contain p-1 hover:opacity-70 transition-opacity"
                />
              </Link>
              <Link href="#" className="h-[45px] w-[45px] relative">
                <Image
                  src="/icon/instagram.jpg"
                  alt="Instagram"
                  fill
                  className="object-contain p-1 hover:opacity-70 transition-opacity"
                />
              </Link>
              <Link href="#" className="h-[45px] w-[45px] relative">
                <Image
                  src="/icon/x.jpg"
                  alt="X"
                  fill
                  className="object-contain p-1 hover:opacity-70 transition-opacity"
                />
              </Link>
              <Link href="#" className="h-[45px] w-[45px] relative">
                <Image
                  src="/icon/linkedin.jpg"
                  alt="LinkedIn"
                  fill
                  className="object-contain p-1 hover:opacity-70 transition-opacity"
                />
              </Link>
              <Link href="#" className="h-[45px] w-[45px] relative">
                <Image
                  src="/icon/youtube.jpg"
                  alt="YouTube"
                  fill
                  className="object-contain p-1 hover:opacity-70 transition-opacity"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
