// import React from "react";
// import { Link } from "react-router-dom";
// import { format, parseISO } from "date-fns"; // Use date-fns for formatting
// import { useDispatch } from "react-redux";
// // Import actions for approve/decline if handling here
// // import { approveRequestAction, declineRequestAction } from '...';

// // Helper to format date/time nicely
// const formatSessionTime = (isoDateString) => {
//   try {
//     const date = parseISO(isoDateString);
//     // Example: "May 4, 2025, 2:00 PM" (adjust format as needed)
//     // Uses browser's local timezone implicitly
//     return format(date, "PPp");
//   } catch (e) {
//     console.error("Error formatting date:", isoDateString, e);
//     return "Invalid Date";
//   }
// };

// const SessionCard = ({ session, type, onApprove, onDecline }) => {
//   const isPending = type === "pending";
//   const isUpcoming = type === "upcoming";
//   const dispatch = useDispatch(); // If handling actions here

//   const handleApprove = () => {
//     console.log("Approving request:", session._id);
//     // dispatch(approveRequestAction(session._id)); // Dispatch your approve action
//     onApprove(session._id); // Or call parent handler
//   };

//   const handleDecline = () => {
//     console.log("Declining request:", session._id);
//     // dispatch(declineRequestAction(session._id)); // Dispatch your decline action
//     onDecline(session._id); // Or call parent handler
//   };

//   return (
//     <div className="p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
//       <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
//         <p className="text-sm font-semibold text-indigo-700">
//           {formatSessionTime(session.requestedStartTimeUTC)}
//         </p>
//         {isPending && (
//           <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full mt-1 sm:mt-0">
//             Pending
//           </span>
//         )}
//         {isUpcoming && (
//           <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full mt-1 sm:mt-0">
//             Upcoming
//           </span>
//         )}
//       </div>

//       <div className="mb-2">
//         {isPending && (
//           <p className="text-gray-800">
//             Request from:{" "}
//             <span className="font-medium">{session.mentee?.name || "N/A"}</span>{" "}
//             ({session.mentee?.email || "N/A"})
//           </p>
//         )}
//         {isUpcoming && (
//           <p className="text-gray-800">
//             With:{" "}
//             <span className="font-medium">
//               {session.mentor?._id === session.currentUser?._id // Check if current user is mentor
//                 ? session.mentee?.name
//                 : session.mentor?.name}
//             </span>
//           </p>
//         )}
//       </div>

//       {isPending && session.notes && (
//         <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 mb-3">
//           <span className="font-medium">Notes:</span> {session.notes}
//         </p>
//       )}

//       <div className="flex flex-wrap gap-2 justify-end">
//         {isPending && onApprove && onDecline && (
//           <>
//             <button
//               onClick={handleDecline}
//               className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
//             >
//               Decline
//             </button>
//             <button
//               onClick={handleApprove}
//               className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500"
//             >
//               Approve
//             </button>
//           </>
//         )}
//         {isUpcoming && session.googleMeetLink && (
//           <a
//             href={session.googleMeetLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
//           >
//             Join Session
//           </a>
//         )}
//         {isUpcoming && !session.googleMeetLink && (
//           <span className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded">
//             No Meeting Link
//           </span>
//         )}
//         {/* Link to session details page? */}
//         {/* <Link to={`/sessions/${session._id}`} className="px-3 py-1 text-xs text-indigo-600 hover:underline">Details</Link> */}
//       </div>
//     </div>
//   );
// };

// const SessionList = ({
//   sessions = [],
//   title,
//   type = "upcoming",
//   currentUser,
//   onApproveRequest,
//   onDeclineRequest,
// }) => {
//   if (!sessions || sessions.length === 0) {
//     return <p className="text-gray-500 mt-2">No {type} sessions found.</p>;
//   }

//   // Pass current user down to card if needed for display logic
//   const sessionsWithUser = sessions.map((s) => ({ ...s, currentUser }));

//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-3 text-gray-700">{title}</h3>
//       <div>
//         {sessionsWithUser.map((session) => (
//           <SessionCard
//             key={session._id}
//             session={session}
//             type={type}
//             onApprove={onApproveRequest} // Pass handlers down
//             onDecline={onDeclineRequest}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SessionList;
