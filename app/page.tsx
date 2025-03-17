import CalendarDayView from "@/components/calendar-day-view"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="w-full max-w-6xl">
        <CalendarDayView />
      </div>
    </main>
  )
}
