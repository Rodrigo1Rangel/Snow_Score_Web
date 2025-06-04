// // File: /app/admin/(detail)/events/[eventId]/layout.tsx

// // This layout might no longer need to be a 'use client' component
// // if it's just passing children or doing server-side data fetching.
// // However, if it sets up Context or something client-side for its children, keep 'use client'.

// import React from 'react';

// interface EventDetailLayoutProps {
//     children: React.ReactNode;
//     // params will still be available here if you need them for other purposes
//     // params: { eventId: string };
// }

// // This can be an async function if you need to fetch data here
// // for the event page or components within this layout's scope (not the sidebar).
// export default function EventDetailLayout({ children }: EventDetailLayoutProps) {
//     // No need to render Header or EventSidebar here anymore.
//     // AdminLayoutClientWrapper is handling that.

//     // This layout now primarily serves as a segment marker for Next.js routing
//     // and a place to put any shared logic/data fetching for the /events/[eventId]/* routes
//     // that isn't the sidebar itself.

//     // If you don't need any specific wrapper or data fetching at this level,
//     // you could even simplify it to:
//     // return <>{children}</>;

//     // Or, if you want to maintain a specific structure for the content area
//     // within the <main> tag provided by AdminLayoutClientWrapper:
//     return (
//         // This div is now directly inside the <main> tag from AdminLayoutClientWrapper
//         // and will contain the page.tsx content.
//         // The EventSidebar will be a sibling to this <main> tag, handled by AdminLayoutClientWrapper.
//         // So, this component doesn't need to flex with a sidebar anymore.
//         <div className="h-full"> {/* Or simply <>{children}</> if no extra div is needed */}
//             {children}
//         </div>
//     );
// }


// app/admin/(detail)/events/[eventId]/layout.tsx
'use client'; // Needs client state for sidebar toggle

import React, { useState } from "react";
import Header from "@/components/header";
import EventSidebar from "@/components/eventSidebar";
import { useParams } from "next/navigation";

interface EventDetailLayoutProps {
    children: React.ReactNode;
}

export default function EventDetailLayout({ children }: EventDetailLayoutProps) {
    const params = useParams();
    const eventId = params.eventId as string; // Get eventId from dynamic route

    // State for the event-specific sidebar
    const [isEventSidebarOpen, setIsEventSidebarOpen] = useState(false);
    const toggleEventSidebar = () => setIsEventSidebarOpen(!isEventSidebarOpen);

    // We might not have eventName readily available here without an extra fetch
    const eventName = "Event Details";

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Render event-specific header (might need name later) */}
            <Header eventName={eventName} />
            <div className="flex flex-1 overflow-hidden">
                {/* Render the event-specific sidebar */}
                <EventSidebar
                    isOpen={isEventSidebarOpen}
                    toggleSidebar={toggleEventSidebar}
                    eventId={eventId} // Pass eventId from params
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children} {/* Render the actual page content */}
                </main>
            </div>
        </div>
    );
}