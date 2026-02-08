"use client";

import Link from "next/link";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">
              HIMASAKTA ITS
            </h2>
            <p className="mb-6 max-w-sm text-slate-400">
              Himpunan Mahasiswa Teknik Aktuaria Institut Teknologi Sepuluh
              Nopember. Mewadahi aspirasi dan kreasi mahasiswa Aktuaria ITS.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-slate-800 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigasi</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="hover:text-primary transition-colors"
                >
                  Berita
                </Link>
              </li>
              <li>
                <Link
                  href="/#departments"
                  className="hover:text-primary transition-colors"
                >
                  Departemen
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="hover:text-primary transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* External */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tautan</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Kalender Akademik
                </a>
              </li>
              <li>
                <a
                  href="https://its.ac.id"
                  className="hover:text-primary transition-colors"
                >
                  Website ITS
                </a>
              </li>
              <li>
                <a
                  href="https://actuarial.its.ac.id"
                  className="hover:text-primary transition-colors"
                >
                  Aktuaria ITS
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} HIMASAKTA ITS. All rights reserved.
          </p>
          <p>Designed & Developed by Medfo HIMASAKTA</p>
        </div>
      </div>
    </footer>
  );
}
