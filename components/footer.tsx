import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <Link
              href="https://shafat21.dragondesignstudio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-purple-500/30 transition-all group-hover:border-purple-500/70">
                <Image
                  src="/images/shafat-avatar.png"
                  alt="P-B | Shafat"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
            <div>
              <p className="text-sm text-gray-400">Developed by</p>
              <Link
                href="https://shafat21.dragondesignstudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white hover:text-purple-400 transition-colors"
              >
                P-B | Shafat
              </Link>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 hidden md:block"></div>

          <div className="flex gap-4">
            <Link
              href="https://discord.gg/2WgXGbcvYN"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              Discord
            </Link>
            <Link
              href="https://gtacnr.net/servers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              CNRV Servers
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Peaky Blinders. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
