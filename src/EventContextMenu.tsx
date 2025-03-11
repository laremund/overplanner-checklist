import { useState, useEffect } from "react";
import { Trash, Copy } from "lucide-react";

export default function EventContextMenu() {

    // Event context menu state
    const [eventContextMenu, setEventContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        eventId: null as number | null,
    })

    return (
        <>
        {/* Event Context Menu */}
          {eventContextMenu.visible && (
            <div
              className="fixed bg-gray-800 rounded-md shadow-lg z-50 py-1 min-w-40"
              style={{ left: `${eventContextMenu.x}px`, top: `${eventContextMenu.y}px` }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="px-4 py-2 hover:bg-gray-700 flex items-center cursor-pointer"
                onClick={handleDuplicateEvent}
              >
                <Copy className="w-4 h-4 mr-2" />
                <span>Duplicate</span>
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-700 flex items-center cursor-pointer text-red-400"
                onClick={handleDeleteEvent}
              >
                <Trash className="w-4 h-4 mr-2" />
                <span>Delete</span>
              </div>
            </div>
          )}
        </>
    )
}