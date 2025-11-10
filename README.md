# Rubix Bingo

An interactive 3D Rubik's Cube Bingo game built with Three.js featuring progressive prizes and auto-play functionality.

## Features

- **3D Interactive Cube**: Fully interactive Rubik's cube with smooth rotations
- **Progressive Prize System**: Win prizes sequentially (1→2→3→4→5 sides completed)
- **Auto-Play Mode**: Automated number calling and square marking
- **Manual Mode**: Player-controlled number calling
- **Winner Tracking**: Click prize boxes to toggle between "WON" display and winner names
- **AI Players**: Compete against computer-controlled players
- **Dynamic Pricing**: Prize amounts based on number of players and rollovers

## How to Play

1. **Choose Mode**: Toggle between Manual and Auto play modes
2. **Start Game**: Click "Game Start" to begin (required for all games)
3. **Progressive Prizes**: Complete sides of the cube to win prizes in order:
   - 1 Side Prize (5% of pot)
   - 2 Side Prize (10% of pot)  
   - 3 Side Prize (15% of pot)
   - 4 Side Prize (20% of pot)
   - 5 Side Prize (30% of pot + remaining 20%)
4. **Winner Display**: Click on won prize boxes to toggle between "WON" and winner names

## Game Modes

### Manual Mode
- Click "Call Next Number" to draw numbers
- Manually mark squares on the cube
- Full control over game timing

### Auto Mode  
- Automated number calling every 3.5 seconds
- Automatic square marking with cube rotation
- Hands-free gameplay experience

## Technical Features

- **Three.js**: 3D graphics and cube manipulation
- **Progressive System**: Set-based prize level tracking
- **Countdown Optimization**: Skips calculations for completed prizes
- **Winner Panel Toggle**: Elegant display switching
- **Game State Management**: Comprehensive state tracking

## Live Demo

Play the game live at: [GitHub Pages URL will be here]

## Local Development

1. Clone the repository
2. Open `index.html` in a web browser
3. Or run a local server: `python3 -m http.server 8000`

## Files

- `index.html` - Main game interface
- `main.js` - Game logic and Three.js implementation  
- `styles.css` - Game styling and visual effects
- `logo.jpg` - Game logo/branding

Built with ❤️ using Three.js and vanilla JavaScript.