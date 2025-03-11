import CalendarBlock from './CalendarBlock.tsx';
import CalendarDayView from './CalendarDayView.tsx';
import TimelineContextMenu from './TimelineContextMenu.tsx';
import EventContextMenu from './EventContextMenu.tsx';
import EventView from './EventView.tsx';

import './App.css'

function App() {

  return (
    <>
      <CalendarBlock/>
      <CalendarDayView/>
      <TimelineContextMenu/>
      <EventContextMenu/>
      <EventView/>
    </>
  )
}

export default App
