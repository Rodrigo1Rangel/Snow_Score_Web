// /components/header.js
"use client"; // <-- IMPORTANT: Add this to make it a Client Component

import React from "react";
import Link from 'next/link';
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"; // <-- Import Clerk components

const placeholderKey = 'pk_test_12345678901234567890';
const authEnabled = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== placeholderKey;

/**
 * Header component for the application.
 * Can optionally display an event name.
 *
 * @param {object} props - Component props.
 * @param {string | null | undefined} [props.eventName] - The name of the event to display.
 */
export default function Header({ eventName = null }) {
    const logoSize = 140;

    return (
        <div className="navbar bg-primary text-primary-content shadow-sm">
            {/* Left Side: Logo and Optional Event Name */}
            <div className="flex-1 flex items-center h-20">
                <Link href="/admin" className="cursor-pointer"> {/* Added cursor-pointer class to Link */}
                   <Image
                        src="/assets/goggles_borderless.png"
                        alt="Goggles Logo"
                        width={logoSize}
                        height={logoSize}
                        className="ml-5 rounded-full" // Removed cursor-pointer from Image, Link handles it
                        priority
                    />
                </Link>
                {eventName && (
                    <span className="ml-4 pl-2 text-3xl font-semibold hidden sm:inline">
                        {eventName}
                    </span>
                )}
            </div>

            {/* Right Side: Navigation Links and Auth Button */}
            <div className="flex-none flex items-center gap-8 mr-4"> {/* Ensure items-center for vertical alignment */}
                 <Link href="/admin/athletes" className="btn btn-ghost text-primary-content hover:bg-primary-focus text-2xl">
                    Athletes
                 </Link>
                 <Link href="/admin/events" className="btn btn-ghost text-primary-content hover:bg-primary-focus text-2xl mr-2">
                    Events
                 </Link>

                {/* Clerk Authentication Section */}
                {authEnabled && (
                    <>
                        <SignedIn>
                            <div className="ml-2">
                                <UserButton afterSignOutUrl="/" appearance={{
                                    elements: {
                                        userButtonTrigger: {
                                            "width": "2.5rem", // 48px
                                            "height": "2.5rem"
                                        },
                                        userButtonAvatarBox: {
                                            "width": "2.5rem",
                                            "height": "2.5rem"
                                        },
                                        userButtonPopoverCard: "bg-base-100 text-base-content"
                                    }
                                }}/>
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <Link href="/sign-in" className="btn btn-accent hover:btn-accent-focus ml-2">
                                Log In
                            </Link>
                        </SignedOut>
                    </>
                )}
            </div>
        </div>
    );
}
