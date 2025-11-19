# Rubix Bingo

An interactive 3D Rubik's Cube Bingo game built with Three.js featuring progressive prizes and auto-play functionality.

**🎮 [Play Desktop Version](https://grahamybee.github.io/Rubik-s-bingo/)**  
**📱 [Play Mobile Version](https://grahamybee.github.io/Rubik-s-bingo/mobile.html)**

## Features

- **3D Interactive Cube**: Fully interactive Rubik's cube with smooth rotations
- **Progressive Prize System**: Win prizes sequentially (1→2→3→4→5 sides completed)
- **Auto-Play Mode**: Automated number calling and square marking
- **Manual Mode**: Player-controlled number calling
- **Winner Tracking**: Click prize boxes to toggle between "WON" display and winner names
- **AI Players**: Compete against computer-controlled players
- **Dynamic Pricing**: Prize amounts based on number of players and rollovers
- **📱 Mobile Responsive**: Optimized mobile version with touch controls

## Versions

### Desktop Version (`index.html`)
- Full desktop layout with side-by-side interface
- Mouse controls for cube manipulation
- Optimized for larger screens

### Mobile Version (`mobile.html`)  
- Vertical stack layout optimized for mobile devices
- Touch-friendly controls and larger buttons
- Responsive design that adapts to device orientation
- Full-width cube display for easy mobile interaction

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
- **Mobile Responsive**: Touch event support and orientation handling
- **Cross-Platform**: Works on desktop and mobile browsers

## Live Demo

🎮 **Desktop Version**: https://grahamybee.github.io/Rubik-s-bingo/  
📱 **Mobile Version**: https://grahamybee.github.io/Rubik-s-bingo/mobile.html

## Local Development

1. Clone the repository
2. Open `index.html` (desktop) or `mobile.html` (mobile) in a web browser
3. Or run a local server: `python3 -m http.server 8000`

## Files

- `index.html` - Desktop game interface
- `mobile.html` - Mobile-optimized interface  
- `main.js` - Desktop game logic and Three.js implementation
- `mobile-main.js` - Mobile-optimized game logic
- `styles.css` - Desktop styling and visual effects
- `mobile-styles.css` - Mobile-responsive styling
- `logo.jpg` - Game logo/branding

Built with ❤️ using Three.js and vanilla JavaScript.