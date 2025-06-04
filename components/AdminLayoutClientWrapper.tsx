// // File: components/AdminLayoutClientWrapper.tsx
// 'use client';

// import React, { useState, ReactNode } from 'react';
// import { usePathname, useParams } from 'next/navigation';
// import Header from '@/components/header'; // Your header.js
// import Sidebar from '@/components/sidebar';
// import EventSidebar from '@/components/eventSidebar';
// import type { ClientUser } from './ClientSideAuthWrapper';

// interface AdminLayoutClientWrapperProps {
//     children: ReactNode;
//     user: ClientUser | null; // This 'user' is for sidebars or other components needing pre-fetched user data
// }

// export default function AdminLayoutClientWrapper({ children, user }: AdminLayoutClientWrapperProps) {
//     const [isRegularSidebarOpen, setIsRegularSidebarOpen] = useState(true);
//     const toggleRegularSidebar = () => setIsRegularSidebarOpen(prev => !prev);

//     const [isEventSidebarOpen, setIsEventSidebarOpen] = useState(true);
//     const toggleEventSidebar = () => setIsEventSidebarOpen(prev => !prev);

//     const pathname = usePathname();
//     const params = useParams();

//     const isEventSpecificPage = /^\/admin\/events\/[^/]+(\/.*)?$/.test(pathname);
//     const eventId = isEventSpecificPage ? (params.eventId as string) : undefined;

//     // Determine what eventName to pass to the Header, if any
//     // This is a simplified example. You might fetch the actual event name in the
//     // /app/admin/(detail)/events/[eventId]/page.tsx and pass it down via context or props if needed.
//     const eventNameForHeader = isEventSpecificPage ? "Event Details" : null; // Or fetch dynamically

//     return (
//         <div className="flex flex-col h-screen">
//             <Header
//                 // user={user} // <--- REMOVE THIS LINE
//                 eventName={eventNameForHeader} // You are already passing eventName
//                 // Pass toggle functions if Header has a global sidebar toggle button
//                 // toggleSidebar={isEventSpecificPage ? toggleEventSidebar : toggleRegularSidebar}
//                 // isSidebarOpen={isEventSpecificPage ? isEventSidebarOpen : isRegularSidebarOpen}
//             />
//             <div className="flex flex-1 overflow-hidden">
//                 {isEventSpecificPage ? (
//                     eventId ? (
//                         <EventSidebar
//                             eventId={eventId}
//                             isOpen={isEventSidebarOpen}
//                             toggleSidebar={toggleEventSidebar}
//                             user={user} // EventSidebar now uses this
//                         />
//                     ) : (
//                         <div className="p-4">Error: Event ID missing.</div>
//                     )
//                 ) : (
//                     <Sidebar
//                         isOpen={isRegularSidebarOpen}
//                         toggleSidebar={toggleRegularSidebar}
//                         user={user} // Sidebar uses this
//                     />
//                 )}
//                 <main className="flex-1 bg-base-100 overflow-y-auto p-4 md:p-6 lg:p-8">
//                     {children}
//                 </main>
//             </div>
//         </div>
//     );
// }




// components/AdminLayoutClientWrapper.tsx
'use client'; // This component manages state, must be client

import React, { useState, ReactNode } from 'react';
import Header from '@/components/header'; // Adjust paths
import Sidebar from '@/components/sidebar';
import type { ClientUser } from './ClientSideAuthWrapper';

interface AdminLayoutClientWrapperProps {
    children: ReactNode;
    user: ClientUser | null; // Receive the user data pre-fetched by the server layout
}

export default function AdminLayoutClientWrapper({ children, user }: AdminLayoutClientWrapperProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state lives here

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex flex-col h-screen">
            <Header /* user={user} */ />
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar receives state, toggle function, AND user data */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                    user={user} // Pass user down
                />
                {/* Main content area */}
                <main className="flex-1 bg-base-100 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children} {/* Render the actual page content */}
                </main>
            </div>
        </div>
    );
}