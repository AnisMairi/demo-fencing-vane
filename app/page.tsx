import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="relative w-48 h-48 md:w-64 md:h-64 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
            <Image
              src="/logo_white.svg"
              alt="Fédération Française d'Escrime"
              fill
              className="object-contain dark:opacity-100 opacity-0"
              priority
            />
            <Image
              src="/logo_blue.svg"
              alt="Fédération Française d'Escrime"
              fill
              className="object-contain dark:opacity-0 opacity-100"
              priority
            />
          </Link>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Détection de Talents
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Plateforme d'évaluation et de suivi des jeunes escrimeurs
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Button asChild size="lg" className="text-base px-8 py-6">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>

        {/* Footer */}
        <footer className="pt-12 pb-6 text-sm text-muted-foreground space-y-1">
          <p>© {new Date().getFullYear()} Fédération Française d'Escrime</p>
          <p>
            Développé par{" "}
            <Link
              href="https://vane-solutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline underline-offset-4"
            >
              Vane Solutions
            </Link>
          </p>
        </footer>
      </div>
    </div>
  )
}

