import CalendarBlock from './CalendarBlock.tsx';
import CalendarDayView from './CalendarDayView.tsx';
import ContextMenu from './ContextMenu.tsx';
import EventView from './EventView.tsx';
import './App.css'

function App() {

  return (
    <>
      <CalendarBlock/>
      <CalendarDayView></CalendarDayView>
      <ContextMenu></ContextMenu>
      <EventView></EventView>
    </>
  )
}

export default App
