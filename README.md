# overplanner-checklist

Calendar / checklist app for high-functioning ADHD folks who love planning their daily schedule.

A prototype for an app I hope to develop in the future, created with help from v0.

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Tailwind CSS Animate**: Animation utilities for Tailwind CSS

## Features

- 24-hour scrollable timeline
- Context menu for creating events
- Drag-and-drop event positioning
- Event resizing with snapping to 15-minute intervals
- Event duplication and deletion
- Mini calendar for date selection
- Live current time indicator
- Event completion tracking
- Event duration display
- Responsive design

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation Steps

1. **Clone the repository**


```shellscript
git clone https://github.com/yourusername/apple-calendar-clone.git
cd apple-calendar-clone
```

2. **Install dependencies**


```shellscript
npm install
# or
yarn install
```

3. **Run the development server**


```shellscript
npm run dev
# or
yarn dev
```

4. **Open your browser**


Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```plaintext
apple-calendar-clone/
├── app/                  # Next.js App Router
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page component
├── components/           # React components
│   └── calendar-day-view.tsx  # Main calendar component
├── public/               # Static assets
├── tailwind.config.js    # Tailwind CSS configuration
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
```

## Key Components

- **CalendarDayView**: The main component that renders the calendar interface
- **Event Handling**: Logic for creating, editing, and managing calendar events
- **Time Formatting**: Utilities for formatting time and durations
- **Mini Calendar**: Component for date selection and navigation


## Configuration Files

### tailwind.config.js

This file configures Tailwind CSS with custom colors, animations, and other theme settings.

### next.config.js

A minimal Next.js configuration file.

### tsconfig.json

TypeScript configuration with Next.js-specific settings.

## Usage

- **Creating Events**: Right-click on the timeline to create a new event
- **Editing Events**: Click on an event to select it, then use the edit button in the sidebar
- **Moving Events**: Drag and drop events to reposition them
- **Resizing Events**: Drag the top or bottom edge of an event to resize it
- **Completing Events**: Click the checkbox on an event to mark it as completed
- **Changing Dates**: Select a date from the mini calendar to view events for that day


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Apple's Calendar application
- Built with Next.js and Tailwind CSS