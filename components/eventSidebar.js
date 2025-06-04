// components/eventSidebar.js
import React from 'react';
import Link from 'next/link';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid';
// It's good practice to define or import the ClientUser type if you're using JSDoc or want better type checking
// For JSDoc:
/**
 * @typedef {object} ClientUser
 * @property {string} [role_name] - The name of the user's role.
 * // Add other properties of ClientUser as needed for JSDoc
 */

/**
 * Event-specific sidebar component.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Whether the sidebar is open or closed.
 * @param {function} props.toggleSidebar - Function to toggle the sidebar state.
 * @param {string} props.eventId - The ID of the current event.
 * @param {ClientUser | null | undefined} [props.user] - Optional authenticated user object or null/undefined.
 */
export default function EventSidebar({ isOpen, toggleSidebar, eventId, user = null }) { // Add 'user' prop
  const baseClasses = `relative bg-primary text-primary-content h-screen-minus-header flex flex-col transition-width duration-300 ease-in-out overflow-hidden`;
  const widthClasses = isOpen ? 'w-48' : 'w-16';

  // Base URL for event-specific links
  const eventBaseUrl = `/admin/events/${eventId}`;

  // --- Example: Define permissions based on user role for event sidebar links ---
  // You'll need to decide which roles can access which event-specific sections.
  // These are just examples; adjust them to your application's logic.
  const canManageEventSettings = user && ['Executive Director', 'Administrator', 'Chief of Competition'].includes(user.role_name);
  const canManageEventJudges = user && ['Executive Director', 'Administrator', 'Chief of Competition', 'Head Judge'].includes(user.role_name);
  const canViewEventReports = user && ['Executive Director', 'Administrator', 'Chief of Competition', 'Technical Director', 'Head Judge'].includes(user.role_name);
  // Everyone with access to the event sidebar might see the schedule and dashboard.

  return (
    <div className={`${baseClasses} ${widthClasses}`}>
      <nav className={`flex flex-col space-y-2 p-4 flex-grow transition-opacity duration-200 ease-in-out delay-150 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {isOpen && (
          <>
            <Link href={`${eventBaseUrl}`} className="hover:bg-primary-focus p-2 rounded block">
              Event Dashboard
            </Link>

            {/* Example: Conditionally render "Settings" link */}
            {canManageEventSettings && (
              <Link href={`${eventBaseUrl}/settings`} className="hover:bg-primary-focus p-2 rounded block">
                Settings
              </Link>
            )}

            <Link href={`${eventBaseUrl}/schedule`} className="hover:bg-primary-focus p-2 rounded block">
              Schedule
            </Link>

            {/* Example: Conditionally render "Judges" link */}
            {canManageEventJudges && (
              <Link href={`${eventBaseUrl}/judges`} className="hover:bg-primary-focus p-2 rounded block">
                Judges
              </Link>
            )}

            {/* Example: Conditionally render "Reports" link */}
            {canViewEventReports && (
              <Link href={`${eventBaseUrl}/reports`} className="hover:bg-primary-focus p-2 rounded block">
                Reports
              </Link>
            )}

            <Link href={`${eventBaseUrl}/links`} className="hover:bg-primary-focus p-2 rounded block">
              External Links
            </Link>

            {/* You could also display user info here if desired */}
            {/* {user && isOpen && <div className="mt-auto p-2 text-xs">Logged in as: {user.email}</div>} */}
          </>
        )}
        {!isOpen && (
          <div className="flex flex-col items-center space-y-4 mt-4">
            {/* Icons for collapsed state - TBD if needed */}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-primary-focus">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full text-primary-content/80 hover:text-primary-content focus:outline-none"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <ChevronDoubleLeftIcon className="h-6 w-6" />
          ) : (
            <ChevronDoubleRightIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
}


// // components/eventSidebar.js
// import React from 'react';
// import Link from 'next/link';
// import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid';

// // Receive eventId to build correct links
// export default function EventSidebar({ isOpen, toggleSidebar, eventId }) {
//   const baseClasses = `relative bg-primary text-primary-content h-screen-minus-header flex flex-col transition-width duration-300 ease-in-out overflow-hidden`; // Assuming h-screen-minus-header exists or define it
//   const widthClasses = isOpen ? 'w-48' : 'w-16';

//   // Base URL for event-specific links
//   const eventBaseUrl = `/admin/events/${eventId}`;

//   return (
//     <div className={`${baseClasses} ${widthClasses}`}>
//       <nav className={`flex flex-col space-y-2 p-4 flex-grow transition-opacity duration-200 ease-in-out delay-150 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}> {/* Hide links when collapsed */}
//         {isOpen && (
//           <>
//             {/* Use template literals for dynamic links */}
//             <Link href={`${eventBaseUrl}`} className="hover:bg-primary-focus p-2 rounded block">
//               Dashboard
//             </Link>
//             <Link href={`${eventBaseUrl}/settings`} className="hover:bg-primary-focus p-2 rounded block">
//               Settings
//             </Link>
//             <Link href={`${eventBaseUrl}/schedule`} className="hover:bg-primary-focus p-2 rounded block">
//               Schedule
//             </Link>
//              <Link href={`${eventBaseUrl}/judges`} className="hover:bg-primary-focus p-2 rounded block">
//               Judges
//             </Link>
//              <Link href={`${eventBaseUrl}/reports`} className="hover:bg-primary-focus p-2 rounded block">
//               Reports
//             </Link>
//              <Link href={`${eventBaseUrl}/links`} className="hover:bg-primary-focus p-2 rounded block">
//               External Links
//             </Link>
//           </>
//         )}
//          {/* Optionally show icons only when collapsed */}
//          {!isOpen && (
//             <div className="flex flex-col items-center space-y-4 mt-4">
//             </div>
//          )}
//       </nav>

//       {/* Toggle Button Area */}
//       <div className="p-4 border-t border-primary-focus"> {/* Adjust border color */}
//         <button
//           onClick={toggleSidebar}
//           className="flex items-center justify-center w-full text-primary-content/80 hover:text-primary-content focus:outline-none"
//           aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
//           aria-expanded={isOpen}
//         >
//           {isOpen ? (
//             <ChevronDoubleLeftIcon className="h-6 w-6" />
//           ) : (
//             <ChevronDoubleRightIcon className="h-6 w-6" />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }
