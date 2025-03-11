import { useState, useEffect } from "react";
import { Plus, Calendar } from "lucide-react";

export default function TimelineContextMenu() {

    // Timeline context menu state
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        hour: 0,
    })

    return (
        <>
          {contextMenu.visible && (
            <div
              className="fixed bg-gray-800 rounded-md shadow-lg z-50 py-1 min-w-40"
              style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-2 hover:bg-gray-700 flex items-center cursor-pointer" onClick={handleCreateEvent}>
                <Plus className="w-4 h-4 mr-2" />
                <span>New Event at {formatTime(contextMenu.hour)}</span>
              </div>
              <div className="px-4 py-2 hover:bg-gray-700 flex items-center cursor-pointer">
                <Calendar className="w-4 h-4 mr-2" />
                <span>New Event with Details...</span>
              </div>
            </div>
          )}
        </>
    )
}