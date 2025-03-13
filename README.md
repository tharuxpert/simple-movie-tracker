# Simple Movie Tracker

A React Native application that helps you keep track of movies and TV series you've watched, along with tracking watch time and episodes.

## Features

- Add movies and TV series to your watch list
- Track episodes watched for TV series
- Track total episodes and current season for TV series
- Mark movies as watched/unwatched
- Filter by:
  - All content
  - Movies only
  - TV Series only
  - Watched items
  - Completed items (movies watched or series with all episodes watched)
- Sort by date added or title
- Search through your collection
- Toggle between list and grid view
- Dark/Light theme support
- Beautiful UI with custom styling
- Local storage using AsyncStorage
- Pull-to-refresh functionality
- Responsive empty states for different filters

## Setup

1. Clone the repository:

```bash
git clone https://github.com/tharuxpert/simple-movie-tracker.git
cd simple-movie-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npx expo start
```

4. Use the Expo Go app on your mobile device to scan the QR code and run the app

## Usage

### Adding Content
- To add a new movie:
  1. Enter the title in the input field
  2. Select "Movie" as the type
  3. Optionally mark it as watched
  4. Tap "Add Movie"

- To add a new TV series:
  1. Enter the title in the input field
  2. Select "TV Series" as the type
  3. Enter the number of episodes watched
  4. Optionally enter total episodes and current season
  5. Tap "Add Series"

### Managing Content
- For TV series:
  - Tap "+1 Episode" to increment the episode count
  - Tap "-1 Episode" to decrement the episode count
  - View progress bar and percentage for completed series
  - Track current season and total episodes
  - Series is marked as "watched" when all episodes are completed

- For movies:
  - Toggle the "Watched" status
  - View watch status with a badge

### Organization
- Filter your collection by:
  - All content
  - Movies only
  - TV Series only
  - Watched items (watched movies or completed series)
  - Completed items (same as watched)
- Sort your collection by:
  - Date Added (newest first)
  - Title (alphabetically)
- Search through your collection by title
- Toggle between list and grid view for different layouts
- Switch between light and dark themes
- Pull down to refresh the list

## Technologies Used

- React Native
- Expo
- TypeScript
- AsyncStorage for local data persistence
- Custom styling with React Native StyleSheet
- Feather icons for UI elements

## Contributing

Feel free to submit issues and enhancement requests!
