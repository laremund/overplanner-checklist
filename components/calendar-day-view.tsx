"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Plus, Calendar, Trash, Copy, Edit, Check, X } from "lucide-react"

// Event POJO (Maybe POTO would be a better acronym?)
type CalendarEvent = {
  id: number
  title: string
  start: number
  end: number
  notes: string
  date: string // Date in ISO format (YYYY-MM-DD)
  completed: boolean
}

export default function CalendarDayView() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 3)) // Test day is March 3, 2025 for now

/* -------------------------------------------------------------------------- */
/*                      Current Time, Update Current Time                     */
/* -------------------------------------------------------------------------- */
  // Current time state (initially whenever the program is executed)
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date()
    return {
      hour: now.getHours(),
      minute: now.getMinutes(),
    }
  })

  // Updates current time state (every minute)
  useEffect(() => {
    // Creates function to update current time
    const updateCurrentTime = () => {
      const now = new Date()
      setCurrentTime({
        hour: now.getHours(),
        minute: now.getMinutes(),
      })
    }

    // Executes function to update current time
    updateCurrentTime()

    // Set up interval to update every minute
    const intervalId = setInterval(updateCurrentTime, 60000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [])
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                  Timeline                                  */
/* -------------------------------------------------------------------------- */
  // Constants
  const HOUR_HEIGHT = 80 // Height of each hour slot in pixels (increased by 1.25x)
  const MINUTE_INTERVAL = 15 // Snap to 15-minute intervals
  const MIN_EVENT_DURATION = 15 / 60 // Minimum event duration in hours (15 minutes)

  // Generate time slots from 12 AM to 12 AM
  const timeSlots = Array.from({ length: 24 }, (_, i) => i)

  // Add a new state to track the selected event ID
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  // Auto-scroll to current time when component mounts
  useEffect(() => {
    if (timelineRef.current) {
      const scrollPosition = (currentTime.hour + currentTime.minute / 60) * HOUR_HEIGHT - window.innerHeight / 2
      timelineRef.current.scrollTop = Math.max(0, scrollPosition)
    }
  }, [currentTime.hour, currentTime.minute])
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    Event                                   */
/* -------------------------------------------------------------------------- */
  // Drag state
  const [dragState, setDragState] = useState({
    isDragging: false,
    eventId: null as number | null,
    startY: 0,
    originalStart: 0,
    duration: 0,
  })

  // Resize state
  const [resizeState, setResizeState] = useState({
    isResizing: false,
    eventId: null as number | null,
    handle: "" as "top" | "bottom" | "",
    startY: 0,
    originalStart: 0,
    originalEnd: 0,
  })

  const [editMode, setEditMode] = useState(false)
  const [editingEvent, setEditingEvent] = useState<{
    id: number | null
    title: string
    notes: string
  }>({
    id: null,
    title: "",
    notes: "",
  })

    // REMOVE FOR FINAL PRODUCT, Creates a test event to start with when the app starts
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "New Event",
      start: 16,
      end: 17,
      notes: "",
      date: new Date(2025, 2, 3).toISOString().split("T")[0], // March 3, 2025
      completed: false,
    },
  ])

    // Start dragging an event
  const startDrag = (e: React.MouseEvent, eventId: number) => {
    e.preventDefault()
    e.stopPropagation()

    const event = events.find((ev) => ev.id === eventId)
    if (!event) return

    setSelectedEventId(eventId)
    setDragState({
      isDragging: true,
      eventId,
      startY: e.clientY,
      originalStart: event.start,
      duration: event.end - event.start,
    })
  }

  // Start resizing an event
  const startResize = (e: React.MouseEvent, eventId: number, handle: "top" | "bottom") => {
    e.preventDefault()
    e.stopPropagation()

    const event = events.find((ev) => ev.id === eventId)
    if (!event) return

    setSelectedEventId(eventId)
    setResizeState({
      isResizing: true,
      eventId,
      handle,
      startY: e.clientY,
      originalStart: event.start,
      originalEnd: event.end,
    })
  }
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                Context Menus                               */
/* -------------------------------------------------------------------------- */

/* -------------------------- Timeline Context Menu ------------------------- */
  // State
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    hour: 0,
  })

  // Handle right click on timeline
  const handleContextMenu = (e: React.MouseEvent, hour: number) => {
    e.preventDefault()

    // Calculate the minute based on the click position within the hour slot
    const rect = e.currentTarget.getBoundingClientRect()
    const relativeY = e.clientY - rect.top
    const minute = Math.floor((relativeY / HOUR_HEIGHT) * 60)

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      hour: hour + minute / 60,
    })

    // Hide Event Context Menu if Timeline Context Menu is open
    if (eventContextMenu.visible) {
      setEventContextMenu({
        ...eventContextMenu,
        visible: false,
      })
    }
  }

  // Create Event
  const handleCreateEvent = () => {
    const startHour = Math.floor(contextMenu.hour)
    const startMinute = Math.floor(((contextMenu.hour - startHour) * 60) / MINUTE_INTERVAL) * MINUTE_INTERVAL
    const start = startHour + startMinute / 60
    const end = start + 1

    const newEventId = Date.now()
    const newEvent = {
      id: newEventId,
      title: "New Event",
      start,
      end,
      notes: "",
      date: currentDate.toISOString().split("T")[0],
      completed: false,
    }

    setEvents([...events, newEvent])
    setSelectedEventId(newEventId)
    setContextMenu({ ...contextMenu, visible: false })
  }
/* -------------------------------------------------------------------------- */

/* --------------------------- Event Context Menu --------------------------- */
  // State
  const [eventContextMenu, setEventContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    eventId: null as number | null,
  })

  // Handle right click on event
  const handleEventContextMenu = (e: React.MouseEvent, eventId: number) => {
    e.preventDefault()
    e.stopPropagation()

    setSelectedEventId(eventId)
    setEventContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      eventId,
    })

    // Hide Timeline Context Menu if Event Context Menu is open
    if (contextMenu.visible) {
      setContextMenu({
        ...contextMenu,
        visible: false,
      })
    }
  }

  // Duplicate Event
  const handleDuplicateEvent = () => {
    if (eventContextMenu.eventId === null) return

    const eventToDuplicate = events.find((event) => event.id === eventContextMenu.eventId)
    if (!eventToDuplicate) return

    // Create a duplicate event 30 minutes later
    const newStart = eventToDuplicate.start + 0.5
    const newEnd = eventToDuplicate.end + 0.5
    const newEventId = Date.now()

    // Ensure the new event is within the 24-hour range
    if (newEnd <= 24) {
      const newEvent = {
        id: newEventId,
        title: `${eventToDuplicate.title} (Copy)`,
        start: newStart,
        end: newEnd,
        notes: eventToDuplicate.notes,
        date: eventToDuplicate.date,
        completed: false, // Always start as not completed
      }

      setEvents([...events, newEvent])
      setSelectedEventId(newEventId)
    } else {
      // If it would go past midnight, place it at the same time
      const newEvent = {
        id: newEventId,
        title: `${eventToDuplicate.title} (Copy)`,
        start: eventToDuplicate.start,
        end: eventToDuplicate.end,
        notes: eventToDuplicate.notes,
        date: eventToDuplicate.date,
        completed: false, // Always start as not completed
      }

      setEvents([...events, newEvent])
      setSelectedEventId(newEventId)
    }

    setEventContextMenu({ ...eventContextMenu, visible: false })
  }

  // Delete Event
  const handleDeleteEvent = () => {
    if (eventContextMenu.eventId === null) return

    setEvents(events.filter((event) => event.id !== eventContextMenu.eventId))
    setEventContextMenu({ ...eventContextMenu, visible: false })

    // If we deleted the selected event, select the first available event
    if (selectedEventId === eventContextMenu.eventId) {
      const remainingEvents = events.filter((event) => event.id !== eventContextMenu.eventId)
      setSelectedEventId(remainingEvents.length > 0 ? remainingEvents[0].id : null)
    }
  }
/* -------------------------------------------------------------------------- */

  // Close context menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false })
      }
      if (eventContextMenu.visible) {
        setEventContextMenu({ ...eventContextMenu, visible: false })
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [contextMenu, eventContextMenu])
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */

  // Refs
  const timelineRef = useRef<HTMLDivElement>(null)

  // Handle mouse move during drag or resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Handle dragging
      if (dragState.isDragging && dragState.eventId !== null) {
        // Calculate drag distance in pixels
        const deltaY = e.clientY - dragState.startY

        // Convert pixels to hours
        const deltaHours = deltaY / HOUR_HEIGHT

        // Calculate new start time with 15-minute snapping
        let newStart = dragState.originalStart + deltaHours
        const fractionalHours = newStart - Math.floor(newStart)
        const minutes = Math.round((fractionalHours * 60) / MINUTE_INTERVAL) * MINUTE_INTERVAL
        newStart = Math.floor(newStart) + minutes / 60

        // Ensure event stays within 24-hour range
        if (newStart < 0) newStart = 0
        if (newStart + dragState.duration > 24) newStart = 24 - dragState.duration

        // Update all events with the dragged one at new position
        setEvents(
          events.map((event) => {
            if (event.id === dragState.eventId) {
              return {
                ...event,
                start: newStart,
                end: newStart + dragState.duration,
              }
            }
            return event
          }),
        )
      }

      // Handle resizing
      if (resizeState.isResizing && resizeState.eventId !== null) {
        // Calculate resize distance in pixels
        const deltaY = e.clientY - resizeState.startY

        // Convert pixels to hours
        const deltaHours = deltaY / HOUR_HEIGHT

        if (resizeState.handle === "top") {
          // Resizing from the top - adjust start time
          let newStart = resizeState.originalStart + deltaHours
          const fractionalHours = newStart - Math.floor(newStart)
          const minutes = Math.round((fractionalHours * 60) / MINUTE_INTERVAL) * MINUTE_INTERVAL
          newStart = Math.floor(newStart) + minutes / 60

          // Ensure minimum duration and within bounds
          if (newStart < 0) newStart = 0
          if (resizeState.originalEnd - newStart < MIN_EVENT_DURATION) {
            newStart = resizeState.originalEnd - MIN_EVENT_DURATION
          }

          // Update the event
          setEvents(
            events.map((event) => {
              if (event.id === resizeState.eventId) {
                return {
                  ...event,
                  start: newStart,
                }
              }
              return event
            }),
          )
        } else if (resizeState.handle === "bottom") {
          // Resizing from the bottom - adjust end time
          let newEnd = resizeState.originalEnd + deltaHours
          const fractionalHours = newEnd - Math.floor(newEnd)
          const minutes = Math.round((fractionalHours * 60) / MINUTE_INTERVAL) * MINUTE_INTERVAL
          newEnd = Math.floor(newEnd) + minutes / 60

          // Ensure minimum duration and within bounds
          if (newEnd > 24) newEnd = 24
          if (newEnd - resizeState.originalStart < MIN_EVENT_DURATION) {
            newEnd = resizeState.originalStart + MIN_EVENT_DURATION
          }

          // Update the event
          setEvents(
            events.map((event) => {
              if (event.id === resizeState.eventId) {
                return {
                  ...event,
                  end: newEnd,
                }
              }
              return event
            }),
          )
        }
      }
    }

    const handleMouseUp = () => {
      // Reset drag state
      if (dragState.isDragging) {
        setDragState({
          isDragging: false,
          eventId: null,
          startY: 0,
          originalStart: 0,
          duration: 0,
        })
      }

      // Reset resize state
      if (resizeState.isResizing) {
        setResizeState({
          isResizing: false,
          eventId: null,
          handle: "",
          startY: 0,
          originalStart: 0,
          originalEnd: 0,
        })
      }
    }

    if (dragState.isDragging || resizeState.isResizing) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [dragState, resizeState, events])

  // Generate calendar days for the mini calendar
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    // Get last few days of previous month to fill first week
    const prevMonthDays = []
    if (firstDayOfMonth > 0) {
      const daysInPrevMonth = new Date(year, month, 0).getDate()
      for (let i = daysInPrevMonth - firstDayOfMonth + 1; i <= daysInPrevMonth; i++) {
        prevMonthDays.push({ day: i, currentMonth: false, isToday: false })
      }
    }

    // Current month days
    const currentMonthDays = []
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === currentDate.getDate()
      currentMonthDays.push({ day: i, currentMonth: true, isToday })
    }

    // Next month days to fill last week
    const totalDaysSoFar = prevMonthDays.length + currentMonthDays.length
    const daysNeeded = Math.ceil(totalDaysSoFar / 7) * 7
    const nextMonthDays = []
    for (let i = 1; i <= daysNeeded - totalDaysSoFar; i++) {
      nextMonthDays.push({ day: i, currentMonth: false, isToday: false })
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }

  // Update the handleDateSelection function to reset selectedEventId when changing dates
  const handleDateSelection = (day, isCurrentMonth) => {
    // If clicking on a day from previous or next month, we'd need to adjust the month
    // For simplicity, we'll only allow selecting days from the current month for now
    if (!isCurrentMonth) return

    const newDate = new Date(currentDate)
    newDate.setDate(day)
    setCurrentDate(newDate)

    // Reset selected event when changing dates
    setSelectedEventId(null)
  }

  // Format time for display
  const formatTime = (time: number) => {
    const hour = Math.floor(time)
    const minute = Math.round((time - hour) * 60)

    let hourDisplay = hour
    let ampm = "AM"

    if (hour === 0) {
      hourDisplay = 12
    } else if (hour === 12) {
      hourDisplay = 12
      ampm = "PM"
    } else if (hour > 12) {
      hourDisplay = hour - 12
      ampm = "PM"
    }

    if (minute === 0) {
      return hour === 12 && ampm === "PM" ? "Noon" : `${hourDisplay} ${ampm}`
    }

    return `${hourDisplay}:${minute.toString().padStart(2, "0")} ${ampm}`
  }

  // Format hour label on the timeline
  const formatHourLabel = (hour: number) => {
    if (hour === 0 || hour === 24) return "12 AM"
    if (hour === 12) return "Noon"
    return `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`
  }

  // Format time range for display
  const formatTimeRange = (start: number, end: number) => {
    return `${formatTime(start)} to ${formatTime(end)}`
  }

  // Format event duration
  const formatEventDuration = (start: number, end: number) => {
    const durationHours = Math.floor(end - start)
    const durationMinutes = Math.round((end - start - durationHours) * 60)

    if (durationHours === 0) {
      return `${durationMinutes}m`
    } else if (durationMinutes === 0) {
      return `${durationHours}h`
    } else {
      return `${durationHours}h ${durationMinutes}m`
    }
  }

  // Check if an event is currently active
  const isEventActive = (start: number, end: number) => {
    const currentTimeDecimal = currentTime.hour + currentTime.minute / 60
    return currentTimeDecimal >= start && currentTimeDecimal < end
  }

  // Add a function to filter events for the current date
  const getEventsForCurrentDate = () => {
    const currentDateString = currentDate.toISOString().split("T")[0]
    return events.filter((event) => event.date === currentDateString)
  }

  // Update the getSelectedEvent function to filter by current date
  const getSelectedEvent = () => {
    const currentDateEvents = getEventsForCurrentDate()

    // If an event is being dragged or resized, show its details
    if (dragState.isDragging && dragState.eventId !== null) {
      return events.find((event) => event.id === dragState.eventId)
    }
    if (resizeState.isResizing && resizeState.eventId !== null) {
      return events.find((event) => event.id === resizeState.eventId)
    }
    // If an event has context menu open
    if (eventContextMenu.visible && eventContextMenu.eventId !== null) {
      return events.find((event) => event.id === eventContextMenu.eventId)
    }
    // If an event is explicitly selected
    if (selectedEventId !== null) {
      return events.find((event) => event.id === selectedEventId)
    }
    // Default to first event for current date if nothing is selected
    return currentDateEvents.length > 0 ? currentDateEvents[0] : null
  }

  // Add a click handler for events
  const handleEventClick = (e: React.MouseEvent, eventId: number) => {
    // Prevent this from interfering with drag and resize
    if (!dragState.isDragging && !resizeState.isResizing) {
      e.stopPropagation()
      setSelectedEventId(eventId)
    }
  }

  const startEventEdit = (event) => {
    setEditMode(true)
    setEditingEvent({
      id: event.id,
      title: event.title,
      notes: event.notes || "",
    })
  }

  const cancelEventEdit = () => {
    setEditMode(false)
    setEditingEvent({
      id: null,
      title: "",
      notes: "",
    })
  }

  const saveEventEdit = () => {
    if (editingEvent.id === null) return

    setEvents(
      events.map((event) => {
        if (event.id === editingEvent.id) {
          return {
            ...event,
            title: editingEvent.title,
            notes: editingEvent.notes,
          }
        }
        return event
      }),
    )

    setEditMode(false)
  }

  const handleInputChange = (field, value) => {
    setEditingEvent({
      ...editingEvent,
      [field]: value,
    })
  }

  // Add a function to toggle the completed status of an event
  const toggleEventCompleted = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation() // Prevent event selection

    setEvents(
      events.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            completed: !event.completed,
          }
        }
        return event
      }),
    )
  }

  const selectedEvent = getSelectedEvent()
  const calendarDays = generateCalendarDays()
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"]

  // Calculate current time position for the red line
  const currentTimePosition = currentTime.hour + currentTime.minute / 60
  const currentTimeFormatted = formatTime(currentTimePosition)
  const currentTimeAmPm = currentTimeFormatted.includes("AM") ? "AM" : "PM"

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left side - Day view */}
      <div className="flex-1 border-r border-gray-700">
        <div className="p-4 sticky top-0 bg-black z-10">
          <h1 className="text-3xl font-bold">
            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getDate()},{" "}
            <span className="text-gray-400">{currentDate.getFullYear()}</span>
          </h1>
          <h2 className="text-xl">{currentDate.toLocaleString("default", { weekday: "long" })}</h2>
          <div className="mt-2 text-gray-500 text-sm border-b border-gray-700 pb-2">all-day</div>
        </div>

        <div ref={timelineRef} className="relative pr-10 overflow-y-auto h-[calc(100vh-100px)]">
          {/* Time slots */}
          {timeSlots.map((hour) => (
              <div key={hour} className="relative" onContextMenu={(e) => handleContextMenu(e, hour)}>
                <div className="absolute -top-2.5 left-12 text-xs text-gray-500">{formatHourLabel(hour)}</div>
                <div className="relative left-10 right-5 h-20 border-t border-gray-700 mx-12"></div>
              </div>
          ))}

          {/* Current time indicator - now dynamic */}
          <div className="absolute left-0 right-0 z-20" style={{ top: `${currentTimePosition * HOUR_HEIGHT}px` }}>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 ml-12"></div>
              <div className="text-xs text-red-500 ml-1">
                {`${currentTime.hour % 12 || 12}:${currentTime.minute.toString().padStart(2, "0")} ${currentTimeAmPm}`}
              </div>
              <div className="flex-1 border-t border-red-500 ml-1 mr-12"></div>
            </div>
          </div>

          {/* Events */}
          {getEventsForCurrentDate().map((event) => {
            const isActive =
              (dragState.isDragging && dragState.eventId === event.id) ||
              (resizeState.isResizing && resizeState.eventId === event.id)

            const duration = event.end - event.start
            const isShortEvent = duration <= 0.5 // 30 minutes or less
            const eventDuration = formatEventDuration(event.start, event.end)
            const isCurrentlyActive = isEventActive(event.start, event.end)

            // Determine the background color based on completion status and activity
            let bgColor = "bg-blue-700"
            if (event.completed) {
              bgColor = "bg-gray-600" // Done events
            } else if (isCurrentlyActive) {
              bgColor = "bg-green-700" // Not done but happening
            }

            return (
              <div
                key={event.id}
                className={`absolute left-[5.5rem] right-12 rounded-md p-2 z-10 select-none
                  ${isActive ? "opacity-75 ring-2 ring-white" : ""}
                  ${selectedEventId === event.id ? "ring-2 ring-blue-400" : ""}
                  ${bgColor}`}
                style={{
                  top: `${event.start * HOUR_HEIGHT}px`,
                  height: `${(event.end - event.start) * HOUR_HEIGHT}px`,
                  cursor: "move",
                }}
                onClick={(e) => handleEventClick(e, event.id)}
                onMouseDown={(e) => startDrag(e, event.id)}
                onContextMenu={(e) => handleEventContextMenu(e, event.id)}
              >
                {/* Top resize handle */}
                <div
                  className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize"
                  onMouseDown={(e) => startResize(e, event.id, "top")}
                />

                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {isShortEvent ? (
                      <div className="flex items-center">
                        <span className="text-sm font-normal text-white/80">{eventDuration}</span>
                        <span
                          className={`text-sm font-semibold ml-4 ${event.completed ? "line-through text-white/60" : ""}`}
                        >
                          {event.title}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm font-normal text-white/80">{eventDuration}</div>
                        <div className={`text-sm font-semibold ${event.completed ? "line-through text-white/60" : ""}`}>
                          {event.title}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded border ${event.completed ? "bg-blue-500 border-blue-500" : "border-white/60"} flex items-center justify-center cursor-pointer`}
                    onClick={(e) => toggleEventCompleted(e, event.id)}
                  >
                    {event.completed && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>

                {/* Bottom resize handle */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
                  onMouseDown={(e) => startResize(e, event.id, "bottom")}
                />
              </div>
            )
          })}

          {/* Timeline Context Menu */}
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
        </div>
      </div>

      {/* Right side - Mini calendar and event details */}
      <div className="w-80 bg-black">
        {/* Mini calendar */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <div className="grid grid-cols-7 w-full text-center text-xs text-gray-500">
              {weekDays.map((day, index) => (
                <div key={index}>{day}</div>
              ))}
            </div>
            <div className="flex items-center gap-1 absolute right-4">
              <button className="p-1 rounded-full bg-gray-800">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-2 py-1 rounded-md bg-gray-800 text-sm">Today</button>
              <button className="p-1 rounded-full bg-gray-800">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`w-6 h-6 flex items-center justify-center rounded-full mx-auto 
                  ${day.isToday ? "bg-red-500 text-white" : day.currentMonth ? "text-white" : "text-gray-600"}
                  ${currentDate.getDate() === day.day && day.currentMonth ? "ring-2 ring-blue-500" : ""}
                  ${day.currentMonth ? "cursor-pointer hover:bg-gray-700" : "cursor-not-allowed"}
                `}
                onClick={() => handleDateSelection(day.day, day.currentMonth)}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>

        {selectedEvent && (
          <div className="p-4">
            {/* Event title with edit button */}
            <div className="flex justify-between items-center">
              {editMode && editingEvent.id === selectedEvent.id ? (
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="text-lg font-medium bg-gray-800 border border-gray-600 rounded px-2 py-1 w-full"
                  placeholder="Event title"
                />
              ) : (
                <h3 className="text-lg font-medium">{selectedEvent.title}</h3>
              )}

              {!editMode ? (
                <button onClick={() => startEventEdit(selectedEvent)} className="p-1 rounded-full hover:bg-gray-700">
                  <Edit className="w-4 h-4" />
                </button>
              ) : editingEvent.id === selectedEvent.id ? (
                <div className="flex gap-2">
                  <button onClick={saveEventEdit} className="p-1 rounded-full hover:bg-gray-700 text-green-400">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={cancelEventEdit} className="p-1 rounded-full hover:bg-gray-700 text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : null}
            </div>

            {/* Date and Time - not editable here as it's managed by drag & resize */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm">
                {currentDate.toLocaleString("default", { weekday: "long" })},{" "}
                {currentDate.toLocaleString("default", { month: "short" })} {currentDate.getDate()}
              </div>
              <div className="text-sm">{formatTimeRange(selectedEvent.start, selectedEvent.end)}</div>
            </div>

            {/* Notes field */}
            <div className="mt-4 border-b border-gray-700 py-2">
              {editMode && editingEvent.id === selectedEvent.id ? (
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-gray-400">Notes</span>
                  </div>
                  <textarea
                    value={editingEvent.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 w-full text-sm h-20"
                    placeholder="Add notes about this event"
                  />
                </div>
              ) : (
                <div className="text-gray-400 text-sm">{selectedEvent.notes || "Add Notes"}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
