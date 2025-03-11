import CalendarDayView from './CalendarDayView.tsx';
import './App.css'

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="w-full max-w-6xl">
        <CalendarDayView />
      </div>
    </main>
  )
}

export default App
