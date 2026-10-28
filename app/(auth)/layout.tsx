import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/better-auth/auth";
import {headers} from "next/headers";

const Layout = async ({ children }: { children : React.ReactNode }) => {

    const session = await auth.api.getSession({headers: await headers()})
    if(session ?.user) redirect('/')
    return (
        <main className="auth-layout">
            <section className="auth-left-section scrollbar-hide-default">
                <Link href="/" className="auth-logo">
                    <Image src="/assets/icons/logo.png" alt="logo" width={140} height={32} className='h-15 w-auto' />
                </Link>

                <div className="pb-6 lg:pb-8 flex-1">{children}</div>
            </section>

            <section className="auth-right-section">
                <div className="z-10 relative lg:mt-4 lg:mb-16">
                    <blockquote className="auth-blockquote">

                        <span
                            className="absolute inset-0 blur-xl opacity-50 animate-ai-glow bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent select-none"
                            aria-hidden="true"
                        >
            Our ✨AI engine runs thousands of market scenarios in seconds, giving you the data-backed confidence to make your next move.
        </span>


                        <span className="relative z-10 animate-ai-glow bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent">
            Our ✨AI engine runs thousands of market scenarios in seconds, giving you the data-backed confidence to make your next move.
        </span>
                    </blockquote>

                </div>

                <div className="flex-1 relative">
                    <Image src="/assets/images/dashboard2.png" alt="Dashboard Preview" width={1440} height={1150} className="auth-dashboard-preview absolute top-0" />
                </div>
            </section>
        </main>
    )
}
export default Layout
