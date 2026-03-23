# Client Tracker - AI Coding Guidelines

## Project Overview
Client Tracker is a React-based personal application for managing client activities and pending tasks. It uses localStorage for data persistence and features a dark UI with Spanish localization.

## Architecture
- **State Management**: Centralized in `App.js` with React hooks
- **Data Structure**:
  - `clients`: Array of client objects `{id, name, company?, notes?, createdAt}`
  - `activities`: Object keyed by clientId, arrays of `{id, text, date, createdAt}`
  - `pendingItems`: Object keyed by clientId, arrays of `{id, text, done, createdAt}`
  - `psaItems`: Object keyed by clientId, arrays of `{id, text, createdAt}`
- **Component Hierarchy**:
  - `App` (root state)
  - `Sidebar` (client list/search)
  - `ClientView` (tabbed interface)
  - `ActivityFeed` (chat-like activity display)
  - `PendingList` (todo list with filters)
  - `PSAList` (PSA task list)
  - `AddClientModal` (client creation)

## Key Patterns
- **IDs**: Generated with `Date.now().toString()` for uniqueness
- **Dates**: Stored as ISO strings, displayed in Spanish locale (`es-ES`)
- **Colors**: Client avatars use hash-based color assignment from predefined palette
- **Sorting**: Activities sorted by date ascending (chronological)
- **Persistence**: Automatic localStorage sync with `STORAGE_KEY = 'client_tracker_v1'`
- **Styling**: Inline styles using CSS variables (dark theme, DM Sans/Mono fonts). Improved contrast ratios and larger font sizes for better accessibility.

## Development Workflow
- **Start**: `npm start` (Create React App dev server)
- **Build**: `npm run build` (production build for Vercel)
- **Deploy**: Push to GitHub, auto-deploy via Vercel integration
- **State Updates**: All mutations go through App.js handlers, triggering localStorage save

## UI/UX Guidelines
- **Accessibility**: High contrast color palette with improved readability
- **Typography**: Larger font sizes across all components (0.9-0.95rem for body text, 1.1-1.2rem for headings)
- **Color Contrast**: Enhanced text colors (--text3: #9090a0, --bg: #0a0a0c) for better visibility
- **Responsive Design**: Consistent spacing and sizing across all screen sizes
- **Dark Theme**: Maintained dark aesthetic while improving legibility

## Component Conventions
- **Props**: Pass data and callbacks down from App
- **Inline Styles**: Use CSS variables for consistency
- **Icons**: lucide-react for UI elements
- **Modals**: Overlay with backdrop blur, ESC to close
- **Interactions**: Hover states, smooth transitions
- **Confirmation**: Delete actions require double-click/timed confirmation

## Data Flow Examples
```javascript
// Adding activity
const addActivity = (clientId, text, date) => {
  const activity = { id: Date.now().toString(), text, date: date || new Date().toISOString(), createdAt: new Date().toISOString() };
  setData(prev => ({
    ...prev,
    activities: { ...prev.activities, [clientId]: [...(prev.activities[clientId] || []), activity] }
  }));
};

// Client selection updates active tab
onSelectClient={(id) => { setSelectedClientId(id); setActiveTab('activities'); }}
```

## File Organization
- `src/App.js`: Main state and layout
- `src/components/`: Reusable UI components
- `src/index.css`: Global styles and CSS variables
- `public/`: Static assets
- `vercel.json`: Deployment config

## Common Tasks
- **Add Feature**: Update App.js state structure, pass handlers to components
- **Style Changes**: Modify CSS variables in `index.css` for theme consistency
- **Data Migration**: Update `STORAGE_KEY` and handle version compatibility
- **Internationalization**: Use Spanish date formats and text labels throughout