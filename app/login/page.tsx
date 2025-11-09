import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="relative w-32 h-32 md:w-40 md:h-40">
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

        <LoginForm />

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-4 space-y-1">
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
