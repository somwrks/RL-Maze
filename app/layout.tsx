import { ClerkProvider, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RL-Maze',
  description: 'Reinforcement Learning for maze simulation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
   <ClerkProvider publishableKey='pk_test_dW5pcXVlLWdvYmxpbi04Mi5jbGVyay5hY2NvdW50cy5kZXYk'>
      <SignedOut>
        <html>
          <body>
            <div className="flex text-white bg-[#001F30] flex-col w-full gap-y-5 min-h-screen items-center p-5 justify-center">
              <div className="flex flex-col gap-y-4">
              <div className="flex text-center text-5xl flex-col">
                RL-Maze  
              </div>
              <div className="flex text-center text-2xl flex-col">
                 Reinforcement Agent Simulation
              </div>

              </div>
              <div className='p-3 border text-md rounded-2xl'>
            <SignInButton>
          
              Sign in
              </SignInButton>

              </div>
            </div>
          </body>
        </html>
      </SignedOut>
      <SignedIn>
      <html lang="en">
      <body style={{background:"#001F30"}} className={inter.className}>
        <div className='flex overflow-hidden'>
          {children}
          </div>
          </body>
    </html>
    </SignedIn>
     </ClerkProvider>
  )
}
