import Image from 'next/image'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import NetflixImage from '../../public/netflix-logo.svg'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-between items-center px-4 py-6">
        <Image
          src={NetflixImage}
          alt="Netflix"
          width={167}
          height={45}
          className="cursor-pointer"
        />
        <Link 
          href="#" 
          className="text-zinc-800 hover:underline font-medium"
        >
          Help
        </Link>
      </header>

      <main className="max-w-[440px] mx-auto px-4 py-12">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-medium text-zinc-900">
            Welcome to Netflix!
          </h1>
          
          <p className="text-lg text-zinc-600">
            Remember you can cancel anytime in the Account section.
          </p>

          <div className="bg-zinc-100 p-6 rounded-md space-y-4 mt-8">
            <h2 className="text-lg text-zinc-700 font-medium">
              Set up password recovery
            </h2>
            
            <p className="text-zinc-600">
              Your phone number will be used to help you access and recover your account. Message and data rates may apply.
            </p>

            <div className="relative mt-4">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span className="text-zinc-500">🇺🇸</span>
              </div>
              <div className="absolute inset-y-0 left-9 flex items-center pointer-events-none">
                <span className="text-zinc-500 border-r pr-2">+1</span>
              </div>
              <Input
                type="tel"
                placeholder="Mobile phone number"
                className="pl-20 py-6 bg-white"
              />
            </div>
          </div>

          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-xl mt-6"
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  )
}

