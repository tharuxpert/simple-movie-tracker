# Simple Movie Tracker

A React Native application that helps you keep track of movies and TV series you've watched, along with tracking watch time and episodes.

## Features

- Add movies and TV series to your watch list
- Track episodes watched for TV series
- Track total watch time
- Beautiful UI with Tailwind CSS
- Persistent storage using AsyncStorage

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npx expo start
```

3. Use the Expo Go app on your mobile device to scan the QR code and run the app

## Usage

- To add a new movie/series:

  1. Enter the title in the input field
  2. Select whether it's a movie or TV series
  3. Tap "Add Movie" or "Add Series"

- To track episodes:

  - For TV series, tap "+1 Episode" to increment the episode count
  - For movies, tap "Watched" to mark it as watched

- The total watch time is displayed at the top of the list

## Technologies Used

- React Native
- Expo
- TailwindCSS/NativeWind
- AsyncStorage for persistence
- TypeScript
