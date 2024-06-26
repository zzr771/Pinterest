"use client"

import { usePathname } from "next/navigation"
import { FaSearch, FaUser } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"
import Link from "next/link"
import { SignInButton, SignOutButton } from "@clerk/nextjs"
import { useRef } from "react"
import Image from "next/image"
import { useAppSelector } from "@/lib/store/hook"

export default function NavBarBottom() {
  if (window.innerWidth >= 820) return null

  const pathname = usePathname()

  const hiddenClerkButtonsRef = useRef<HTMLDivElement>(null)
  function handleSignIn() {
    const signInButton = hiddenClerkButtonsRef?.current?.children[0] as HTMLButtonElement
    if (!signInButton) return
    signInButton.click()
  }
  function handleSignOut() {
    const signOutButton = hiddenClerkButtonsRef?.current?.children[1] as HTMLButtonElement
    if (!signOutButton) return
    signOutButton.click()
  }

  const user = useAppSelector((store) => store.user.user)

  return (
    <section className="sm:nav-float-bottom max-w3:nav-bottom bg-white">
      <div className="w-full h-full flex justify-around items-center max-w3:p-0">
        <Link href="/">
          <div className={`${pathname === "Home" ? "text-black" : "text-gray-font-3"}`}>
            <AiFillHome className="w-6 h-6" />
          </div>
        </Link>

        <Link href="/search">
          <div className={`${pathname === "Search" ? "text-black" : "text-gray-font-3"}`}>
            <FaSearch className="w-6 h-6" />
          </div>
        </Link>

        {/* avatar */}
        {user && (
          <Link href={`/user/${user?._id}`}>
            {user.imageUrl ? (
              <Image
                src={user?.imageUrl}
                alt="avatar"
                width={30}
                height={30}
                className="w-[30px] h-[30px] rounded-full object-cover"
                sizes="60px"
              />
            ) : (
              <FaUser className="w-6 h-6" />
            )}
          </Link>
        )}
        {!user && (
          <div onClick={handleSignIn}>
            <FaUser className="w-6 h-6" />
          </div>
        )}

        <div ref={hiddenClerkButtonsRef} className="hidden">
          <SignInButton mode="modal" />
          <SignOutButton />
        </div>
      </div>
    </section>
  )
}
