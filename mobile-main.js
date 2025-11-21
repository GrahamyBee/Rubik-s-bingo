// Rubik's Cube Bingo Game - Mobile Version
console.log('🚀 Loading Mobile Rubiks Cube Bingo - Version 2025112101');

class RubiksCubeBingo {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.cube = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Game state
        this.calledNumbers = new Set();
        this.availableNumbers = [];
        this.currentCall = null;
        this.callCount = 0;
        this.calledBalls = []; // Store called balls for display
        
        // AI Players system
        this.aiPlayers = [];
        this.playerNames = [
            'Player 1', // Human player
            'BingoMaster88', 'LuckyStars', 'NumberCruncher', 'WinnerWins', 'GameChanger',
            'BallHunter', 'TicketKing', 'PrizeFighter', 'BingoQueen', 'NumberNinja',
            'LuckyDuck', 'WinWizard', 'BallChaser', 'PrizeSeeker', 'BingoAce',
            'NumberHero', 'TicketMaster', 'LuckyCaller', 'WinStreak', 'BingoBoss',
            'StarPlayer', 'GoldenTicket', 'NumberWhiz', 'LuckyCharm', 'WinnerCircle',
            'BingoKnight', 'PrizeMaster', 'NumberStar', 'LuckyWin', 'TicketWinner',
            'BallMaster', 'NumberGuru', 'LuckyBreak', 'WinMachine', 'BingoChamp',
            'PrizeHunter', 'NumberFan', 'LuckySeven', 'WinningWay', 'BingoLegend',
            'TicketAce', 'NumberPro', 'LuckyRoll', 'WinForce', 'BingoStar',
            'PrizeWinner', 'NumberBoss', 'LuckyShot', 'WinTime', 'BingoHero',
            'TicketChamp', 'NumberKing', 'LuckyPlay', 'WinZone', 'BingoMagic',
            'PrizeBoss', 'NumberLuck', 'LuckyHit', 'WinPower', 'BingoRush',
            'TicketStar', 'NumberWin', 'LuckyMove', 'WinWave', 'BingoBlitz',
            'PrizeRush', 'NumberJoy', 'LuckyGame', 'WinFun', 'BingoFlash',
            'TicketJoy', 'NumberRush', 'LuckyBall', 'WinSpirit', 'BingoVibe',
            'PrizeSpirit', 'NumberVibe', 'LuckyVibes', 'WinMood', 'BingoFlow',
            'TicketFlow', 'NumberFlow', 'LuckyFlow', 'WinGlow', 'BingoGlow',
            'PrizeGlow', 'NumberGlow', 'LuckyGlow', 'WinShine', 'BingoShine',
            'TicketShine', 'NumberShine', 'LuckyShine', 'WinSpark', 'BingoSpark',
            'PrizeSpark', 'NumberSpark', 'LuckySpark', 'WinFlash', 'BingoBeam',
            'TicketBeam', 'NumberBeam', 'LuckyBeam', 'WinBeam', 'BingoBurst'
        ];
        
        // Cube faces data (6 tickets)
        this.faceTickets = [];
        this.faceColors = [
            0xff0000, // Red
            0x00ff00, // Green  
            0x0000ff, // Blue
            0xffff00, // Yellow
            0xff8800, // Orange
            0xffffff  // White
        ];
        
        this.colorNames = ['Red', 'Green', 'Blue', 'Yellow', 'Orange', 'White'];
        
        // Prize winners tracking - updated for side prizes
        this.prizeWinners = {
            oneSide: [],
            twoSide: [],
            threeSide: [],
            fourSide: [],
            fiveSide: []
        };
        
        // Prize calculation system
        this.pricePerPlayer = 1.00; // Default £1
        this.sidePrizeRollover = {
            oneSide: 0,
            twoSide: 0,
            threeSide: 0,
            fourSide: 0,
            fiveSide: 0
        };
        
        // Auto-play system
        this.isAutoMode = false;
        this.autoPlayInterval = null;
        this.autoPlayTimeout = null;
        this.autoCallDelay = 2800; // Faster calls: 2.8 seconds total cycle
        this.rotationAnimationId = null; // Track rotation animations
        this.isResettingPosition = false; // Flag to prevent controls interference during reset
        this.animationStopped = false; // Flag to temporarily stop main animation loop
        this.gamePaused = false; // Flag to pause auto-play for winner announcements
        
        // Progressive prize system - tracks which prize levels have been completed
        this.completedPrizeLevels = new Set(); // 'oneSide', 'twoSide', etc.
        
        // Game state tracking
        this.gameStarted = false; // Track if game has been started by player
        
        this.init();
        this.setupEventListeners();
        this.initializeMobileElements(); // Initialize mobile-specific elements
        this.generateBingoTickets();
        this.generateAIPlayers();
        this.updateAllCountdowns();
        this.updatePrizeAmounts();
    }
    
    initializeMobileElements() {
        console.log('🔧 Initializing mobile-specific elements...');
        
        // Set initial price value from dropdown
        const priceSelect = document.getElementById('price-select');
        if (priceSelect) {
            this.pricePerPlayer = parseFloat(priceSelect.value) || 2.0;
        } else {
            // Fallback to input if it exists
            const priceInput = document.getElementById('price-per-player');
            if (priceInput) {
                this.pricePerPlayer = parseFloat(priceInput.value) || 10;
            }
        }
        
        // Ensure mode button has proper text and mobile styling
        const modeBtn = document.getElementById('play-mode-btn');
        if (modeBtn) {
            modeBtn.textContent = this.isAutoMode ? 'Auto' : 'Manual';
            modeBtn.className = `mode-btn ${this.isAutoMode ? 'auto' : 'manual'}`;
        }
        
        // Force mobile styling on key elements
        this.applyMobileForcedStyles();
        
        console.log('✅ Mobile elements initialized');
    }
    
    applyMobileForcedStyles() {
        // Force proper input sizing
        const inputs = document.querySelectorAll('input[type="number"], .mobile-input');
        inputs.forEach(input => {
            input.style.minWidth = '80px';
            input.style.fontSize = '16px';
            input.style.padding = '12px';
            input.style.textAlign = 'center';
        });
        
        // Ensure labels are visible and properly styled
        const labels = document.querySelectorAll('.input-group label');
        labels.forEach(label => {
            label.style.fontSize = '14px';
            label.style.fontWeight = 'bold';
            label.style.color = 'white';
        });
        
        // Force mobile prize box styling
        const prizeBoxes = document.querySelectorAll('.mobile-prize');
        prizeBoxes.forEach(box => {
            box.style.width = '100%';
            box.style.maxWidth = 'none';
            box.style.margin = '0 0 12px 0';
        });
        
        // Force mode button styling
        const modeBtns = document.querySelectorAll('.mode-btn');
        modeBtns.forEach(btn => {
            btn.style.minWidth = '80px';
            btn.style.fontSize = '14px';
            btn.style.padding = '10px 15px';
        });
    }
    
    getCurrentPrizeLevel() {
        // Return the next prize level that hasn't been completed yet
        const prizeLevels = ['oneSide', 'twoSide', 'threeSide', 'fourSide', 'fiveSide'];
        for (const level of prizeLevels) {
            if (!this.completedPrizeLevels.has(level)) {
                return level;
            }
        }
        return null; // All prizes completed
    }
    
    getPrizeLevelNumber(prizeLevel) {
        const levelMap = {
            'oneSide': 1,
            'twoSide': 2,
            'threeSide': 3,
            'fourSide': 4,
            'fiveSide': 5
        };
        return levelMap[prizeLevel];
    }
    
    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x222222);
        
        // Camera setup - positioned to show cube straight on (front face)
        this.camera = new THREE.PerspectiveCamera(75, 600 / 600, 0.1, 1000);
        this.camera.position.set(0, 0, 6);
        this.camera.lookAt(0, 0, 0);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(600, 600);
        
        const container = document.getElementById('cube-container');
        container.appendChild(this.renderer.domElement);
        
        // Controls - rotation only, no zoom or pan
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: null,
            RIGHT: null
        };
        // Disable scroll wheel zoom completely
        this.controls.addEventListener('change', () => {
            this.camera.position.normalize().multiplyScalar(6); // Lock distance for straight-on view
        });
        
        // Lighting - simplified for vibrant colors
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);
        
        // Create the cube
        this.createRubiksCube();
        
        // Initialize available numbers
        this.initializeAvailableNumbers();
        
        // Start render loop
        this.animate();
    }
    
    createRubiksCube() {
        // Create main cube group
        this.cube = new THREE.Group();
        
        // Cube core (black center, smaller to show individual squares)
        const cubeGeometry = new THREE.BoxGeometry(3.8, 3.8, 3.8);
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cube.add(cubeMesh);
        
        // Create 6 faces with bingo grids
        this.createBingoFaces();
        
        this.scene.add(this.cube);
    }
    
    createBingoFaces() {
        const facePositions = [
            { pos: [0, 0, 1.95], rot: [0, 0, 0] },           // Front (Z+)
            { pos: [0, 0, -1.95], rot: [0, Math.PI, 0] },    // Back (Z-)
            { pos: [1.95, 0, 0], rot: [0, Math.PI/2, 0] },   // Right (X+)
            { pos: [-1.95, 0, 0], rot: [0, -Math.PI/2, 0] }, // Left (X-)
            { pos: [0, 1.95, 0], rot: [-Math.PI/2, 0, 0] },  // Top (Y+)
            { pos: [0, -1.95, 0], rot: [Math.PI/2, 0, 0] }   // Bottom (Y-)
        ];
        
        // Create all 54 unique number-color combinations
        const allSquareData = [];
        this.colorNames.forEach((colorName, colorIndex) => {
            for (let num = 1; num <= 9; num++) {
                allSquareData.push({
                    number: num,
                    color: colorName,
                    colorIndex: colorIndex,
                    colorHex: this.faceColors[colorIndex]
                });
            }
        });
        
        // Shuffle to distribute randomly across faces
        this.shuffleArray(allSquareData);
        
        let squareIndex = 0;
        
        facePositions.forEach((face, faceIndex) => {
            const faceGroup = new THREE.Group();
            const faceSquares = allSquareData.slice(squareIndex, squareIndex + 9);
            faceGroup.userData = { faceIndex, squares: faceSquares, markedSquares: new Set() };
            
            // Create 3x3 grid for Rubik's cube squares
            const gridSize = 3;
            const squareSize = 1.2;
            const gap = 0.08; // Small gap between squares
            const totalSize = (squareSize + gap) * gridSize - gap;
            const startPos = -totalSize / 2 + squareSize / 2;
            
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    const squareGroup = new THREE.Group();
                    const squareDataIndex = row * 3 + col;
                    const squareData = faceSquares[squareDataIndex];
                    
                    // Individual colored square
                    const squareGeometry = new THREE.PlaneGeometry(squareSize, squareSize);
                    const squareMaterial = new THREE.MeshBasicMaterial({ 
                        color: squareData.colorHex
                    });
                    const squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
                    squareGroup.add(squareMesh);
                    
                    // Black border around each square
                    const borderGeometry = new THREE.PlaneGeometry(squareSize + 0.02, squareSize + 0.02);
                    const borderMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
                    const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
                    borderMesh.position.z = -0.001;
                    squareGroup.add(borderMesh);
                    
                    // Position square
                    squareGroup.position.set(
                        startPos + col * (squareSize + gap),
                        startPos + (gridSize - 1 - row) * (squareSize + gap),
                        0.01
                    );
                    
                    squareGroup.userData = { 
                        faceIndex, 
                        row, 
                        col, 
                        number: squareData.number,
                        color: squareData.color,
                        colorIndex: squareData.colorIndex,
                        colorHex: squareData.colorHex,
                        marked: false,
                        squareMesh: squareMesh,
                        squareData: squareData,
                        colorNumberKey: `${squareData.color}${squareData.number}` // For easy matching
                    };
                    

                    
                    faceGroup.add(squareGroup);
                }
            }
            
            // Position and rotate face
            faceGroup.position.set(...face.pos);
            faceGroup.rotation.set(...face.rot);
            
            this.cube.add(faceGroup);
            
            // Move to next set of 9 squares
            squareIndex += 9;
        });
    }
    
    generateBingoTickets() {
        // For Rubik's cube, each square has a number and color
        this.cube.children.slice(1).forEach((faceGroup, faceIndex) => {
            // Update face group with numbers and create text
            faceGroup.children.forEach((squareGroup, index) => {
                const number = squareGroup.userData.number;
                
                // Create text for the number
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = 256;
                canvas.height = 256;
                
                // Make background transparent
                context.clearRect(0, 0, 256, 256);
                
                // Use same font size as desktop to avoid mobile rendering thresholds
                const fontSize = 120;
                
                console.log(`📝 Creating number ${number} with font size ${fontSize}px`);
                
                // Add white text with black outline for visibility
                context.fillStyle = '#ffffff';
                context.strokeStyle = '#000000';
                context.font = `bold ${fontSize}px Arial`;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.lineWidth = 6;
                
                context.strokeText(number.toString(), 128, 128);
                context.fillText(number.toString(), 128, 128);
                
                const texture = new THREE.CanvasTexture(canvas);
                texture.needsUpdate = true; // Force texture update for mobile
                texture.flipY = false; // Ensure proper orientation
                
                const textMaterial = new THREE.MeshBasicMaterial({ 
                    map: texture, 
                    transparent: true,
                    side: THREE.DoubleSide // Ensure visibility from all angles
                });
                const textGeometry = new THREE.PlaneGeometry(1.0, 1.0);
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.position.z = 0.02;
                
                squareGroup.add(textMesh);
                squareGroup.userData.textMesh = textMesh;
                
                console.log(`✅ Added number ${number} mesh to square group`);
            });
            
            this.faceTickets[faceIndex] = faceGroup.userData.squares;
        });
    }
    
    initializeAvailableNumbers() {
        this.availableNumbers = [];
        // Universe of 54 combinations (1-9 for each of 6 colors)
        this.colorNames.forEach((colorName, colorIndex) => {
            for (let num = 1; num <= 9; num++) {
                this.availableNumbers.push({
                    number: num,
                    color: colorName,
                    colorIndex: colorIndex,
                    colorHex: this.faceColors[colorIndex]
                });
            }
        });
        this.shuffleArray(this.availableNumbers);
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    setupEventListeners() {
        // Call number button
        document.getElementById('call-number-btn').addEventListener('click', () => {
            this.handleGameStartOrCall();
        });
        
        // Reset game button
        document.getElementById('reset-game-btn').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Mouse click for marking numbers
        this.renderer.domElement.addEventListener('click', (event) => {
            this.onMouseClick(event);
        });
        
        // Disable wheel zoom completely
        this.renderer.domElement.addEventListener('wheel', (event) => {
            event.preventDefault();
            event.stopPropagation();
        }, { passive: false });
        
        // Close modal
        document.getElementById('close-modal-btn').addEventListener('click', () => {
            document.getElementById('win-modal').style.display = 'none';
        });
        
        // Close AI winner modal
        document.getElementById('close-ai-modal-btn').addEventListener('click', () => {
            document.getElementById('ai-win-modal').style.display = 'none';
        });
        
        // AI Players input change
        document.getElementById('ai-players-input').addEventListener('change', () => {
            this.generateAIPlayers();
            this.updatePrizeAmounts();
        });
        
        // Price change event - prioritize dropdown (mobile) over input (legacy)
        const priceSelect = document.getElementById('price-select');
        const priceInput = document.getElementById('price-per-player');
        
        if (priceSelect) {
            priceSelect.addEventListener('change', () => {
                this.pricePerPlayer = parseFloat(priceSelect.value);
                this.updatePrizeAmounts();
                console.log(`💰 Price updated to: ${this.pricePerPlayer}`);
            });
        } else if (priceInput) {
            priceInput.addEventListener('change', () => {
                this.pricePerPlayer = parseFloat(priceInput.value);
                this.updatePrizeAmounts();
                console.log(`💰 Price updated to: ${this.pricePerPlayer}`);
            });
        }
        
        // Play mode toggle
        document.getElementById('play-mode-btn').addEventListener('click', () => {
            this.togglePlayMode();
        });
        
        // Close winner dropdowns when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.prize-box')) {
                document.querySelectorAll('.winner-dropdown').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
    }
    
    handleGameStartOrCall() {
        if (!this.gameStarted) {
            // Game hasn't started yet - start the game
            this.gameStarted = true;
            console.log('🎮 Game started by player');
            
            // Hide AI settings and prize sections during gameplay
            this.hideGameSetupSections();
            
            // If in auto mode, start auto-play instead of manual call
            if (this.isAutoMode) {
                document.getElementById('call-number-btn').textContent = 'Auto Running...';
                console.log('🚀 Starting auto-play after manual game start');
                this.startAutoPlay();
            } else {
                document.getElementById('call-number-btn').textContent = 'Call Next Number';
                // Make the first call in manual mode
                this.callNextNumber();
            }
        } else {
            // Game is already running - make next call
            this.callNextNumber();
        }
    }
    
    callNextNumber() {
        if (this.availableNumbers.length === 0) {
            alert('All numbers have been called!');
            return;
        }
        
        const calledItem = this.availableNumbers.pop();
        const calledKey = `${calledItem.color}${calledItem.number}`;
        this.calledNumbers.add(calledKey);
        this.currentCall = calledItem;
        this.callCount++;
        
        // Update button text after first call
        if (this.callCount === 1) {
            document.getElementById('call-number-btn').textContent = 'Call Next Number';
        }
        
        // Add to called balls array
        this.calledBalls.push(calledItem);
        
        // Update UI
        document.getElementById('call-count').textContent = this.callCount;
        
        // Update bingo balls display
        this.updateBingoBallsDisplay();
        
        // Highlight matching number+color on cube
        this.highlightCalledNumber(calledItem);
        
        // Check AI players for wins
        this.checkAIPlayersForWins(calledItem);
        
        // Update countdown displays
        this.updateAllCountdowns();
    }
    
    getColorHex(colorHex) {
        return `#${colorHex.toString(16).padStart(6, '0')}`;
    }
    
    updateBingoBallsDisplay() {
        const currentBallContainer = document.getElementById('current-ball-position');
        const previousBallsContainer = document.getElementById('previous-balls-container');
        
        // Clear both containers
        currentBallContainer.innerHTML = '';
        previousBallsContainer.innerHTML = '';
        
        if (this.calledBalls.length === 0) return;
        
        // Get current ball (last called) - main position
        const currentBall = this.calledBalls[this.calledBalls.length - 1];
        
        // Create current ball element (main call position)
        const currentBallElement = document.createElement('div');
        currentBallElement.className = 'bingo-ball current';
        
        // Set ball color and text
        const colorHex = this.getColorHex(currentBall.colorHex);
        currentBallElement.style.backgroundColor = colorHex;
        
        const textColor = this.getContrastColor(currentBall.colorHex);
        currentBallElement.style.color = textColor;
        currentBallElement.style.textShadow = textColor === '#000000' ? 
            '1px 1px 2px rgba(255, 255, 255, 0.8)' : 
            '1px 1px 2px rgba(0, 0, 0, 0.8)';
        
        currentBallElement.textContent = currentBall.number;
        currentBallContainer.appendChild(currentBallElement);
        
        // Create previous balls - show last 5 calls in chronological order
        // Most recent previous call goes to first position, oldest to last position
        const previousBalls = this.calledBalls.slice(-6, -1).reverse(); // Last 5 excluding current, reversed for display order
        
        console.log(`📋 Displaying: Main call ${currentBall.number}, Previous calls: ${previousBalls.map(b => b.number).join(', ')}`);
        
        previousBalls.forEach((ballData, index) => {
            const ball = document.createElement('div');
            ball.className = 'bingo-ball previous';
            
            // Set ball color
            const colorHex = this.getColorHex(ballData.colorHex);
            ball.style.backgroundColor = colorHex;
            
            // Adjust text color for visibility
            const textColor = this.getContrastColor(ballData.colorHex);
            ball.style.color = textColor;
            ball.style.textShadow = textColor === '#000000' ? 
                '1px 1px 2px rgba(255, 255, 255, 0.8)' : 
                '1px 1px 2px rgba(0, 0, 0, 0.8)';
            
            // Set number
            ball.textContent = ballData.number;
            
            // Add position indicator for debugging
            ball.title = `Previous call #${index + 1}`;
            
            previousBallsContainer.appendChild(ball);
        });
    }
    
    getContrastColor(hexColor) {
        // Convert hex to RGB
        const r = (hexColor >> 16) & 255;
        const g = (hexColor >> 8) & 255;
        const b = hexColor & 255;
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return black for light colors, white for dark colors
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }
    
    generateAIPlayers() {
        const numAIPlayers = parseInt(document.getElementById('ai-players-input').value) || 0;
        this.aiPlayers = [];
        
        for (let i = 0; i < numAIPlayers; i++) {
            let playerName;
            if (i + 1 < this.playerNames.length) {
                playerName = this.playerNames[i + 1];
            } else {
                // Generate additional names if we exceed predefined list
                playerName = `Player${i + 2}`;
            }
            
            const aiPlayer = {
                name: playerName,
                tickets: this.generateAITickets(),
                markedSquares: new Set()
            };
            this.aiPlayers.push(aiPlayer);
        }
    }
    
    generateAITickets() {
        // Generate 6 face tickets for AI player (same as human player)
        const tickets = [];
        
        // Create all 54 unique number-color combinations
        const allSquareData = [];
        this.colorNames.forEach((colorName, colorIndex) => {
            for (let num = 1; num <= 9; num++) {
                allSquareData.push({
                    number: num,
                    color: colorName,
                    colorIndex: colorIndex,
                    colorHex: this.faceColors[colorIndex],
                    key: `${colorName}${num}`
                });
            }
        });
        
        // Shuffle to distribute randomly across faces
        this.shuffleArray(allSquareData);
        
        // Create 6 faces with 9 squares each
        for (let face = 0; face < 6; face++) {
            const faceSquares = allSquareData.slice(face * 9, (face + 1) * 9);
            tickets.push(faceSquares);
        }
        
        return tickets;
    }
    
    checkAIPlayersForWins(calledItem) {
        const calledKey = `${calledItem.color}${calledItem.number}`;
        
        // Mark squares for all AI players
        this.aiPlayers.forEach(player => {
            player.tickets.forEach((face, faceIndex) => {
                face.forEach(square => {
                    if (square.key === calledKey) {
                        player.markedSquares.add(`${faceIndex}-${square.key}`);
                    }
                });
            });
        });
        
        // Check for wins
        this.aiPlayers.forEach((player, playerIndex) => {
            this.checkAIPlayerWins(player, playerIndex);
        });
    }
    
    checkAIPlayerWins(player, playerIndex) {
        // Check each face for side completion
        const completedSides = [];
        
        for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
            const face = player.tickets[faceIndex];
            
            // Check if this face is complete
            let faceComplete = true;
            for (const square of face) {
                if (!player.markedSquares.has(`${faceIndex}-${square.key}`)) {
                    faceComplete = false;
                    break;
                }
            }
            
            if (faceComplete) {
                completedSides.push(faceIndex);
            }
        }
        
        // Check for side prizes (1-5 sides completed)
        const completedCount = completedSides.length;
        if (completedCount > 0) {
            // Check if player hasn't already won this level of side prize
            if (!player.sidePrizeWins) {
                player.sidePrizeWins = new Set();
            }
            
            // Get the current prize level everyone is competing for
            const currentPrizeLevel = this.getCurrentPrizeLevel();
            if (!currentPrizeLevel) {
                return; // All prizes have been completed
            }
            
            const requiredSides = this.getPrizeLevelNumber(currentPrizeLevel);
            
            // Check if player qualifies for the current prize level and hasn't won it yet
            if (completedCount >= requiredSides && !player.sidePrizeWins.has(currentPrizeLevel)) {
                player.sidePrizeWins.add(currentPrizeLevel);
                
                // Announce winner
                const prizeNames = {
                    'oneSide': 'One Side Prize',
                    'twoSide': 'Two Side Prize', 
                    'threeSide': 'Three Side Prize',
                    'fourSide': 'Four Side Prize',
                    'fiveSide': 'Five Side Prize'
                };
                
                this.announceAIWinner(player, prizeNames[currentPrizeLevel], `${requiredSides} sides completed`, currentPrizeLevel);
                return;
            }
        }
    }
    
    announceAIWinner(player, winType, winDetails, prizeKey) {
        // Calculate prize amount based on side prize type
        const numPlayers = parseInt(document.getElementById('ai-players-input').value) + 1;
        const totalPot = numPlayers * this.pricePerPlayer;
        
        let prizeAmount = '£0';
        let prizeType = winType;
        
        if (winType === 'One Side Prize') {
            prizeAmount = this.formatCurrency(totalPot * 0.05 + this.sidePrizeRollover.oneSide);
        } else if (winType === 'Two Side Prize') {
            prizeAmount = this.formatCurrency(totalPot * 0.10 + this.sidePrizeRollover.twoSide);
        } else if (winType === 'Three Side Prize') {
            prizeAmount = this.formatCurrency(totalPot * 0.15 + this.sidePrizeRollover.threeSide);
        } else if (winType === 'Four Side Prize') {
            prizeAmount = this.formatCurrency(totalPot * 0.20 + this.sidePrizeRollover.fourSide);
        } else if (winType === 'Five Side Prize') {
            prizeAmount = this.formatCurrency(totalPot * 0.30 + this.sidePrizeRollover.fiveSide);
        }
        
        document.getElementById('ai-winner-name').textContent = player.name;
        document.getElementById('ai-winner-prize').textContent = `${prizeType}: ${prizeAmount}`;
        document.getElementById('ai-winner-type').textContent = `${winType} - ${winDetails}`;
        
        // Store winner information for prize box display
        this.addWinnerToPrizeBox(prizeKey, player.name);
        
        // Mark this prize level as completed (so everyone moves to next level)
        this.completedPrizeLevels.add(prizeKey);
        console.log(`🏆 Prize level ${prizeKey} completed! Next prize: ${this.getCurrentPrizeLevel() || 'None - All completed'}`);
        
        // Pause the game for winner announcement
        this.gamePaused = true;
        console.log(`⏸️ Game paused for ${winType} winner announcement`);
        
        // Show winner modal immediately
        document.getElementById('ai-win-modal').style.display = 'block';
        
        // Only end game if Five Side Prize is won - other prizes continue the game
        if (prizeKey === 'fiveSide') {
            // Game over! Reset after showing winner (3 seconds)
            setTimeout(() => {
                document.getElementById('ai-win-modal').style.display = 'none';
                alert(`🎉 GAME OVER! ${player.name} won the ${winType}! Starting new game...`);
                this.resetGame();
            }, 3000);
        } else {
            // Continue game for 1-4 side prizes
            // Winner panel shows for 3 seconds, then 1 second wait, then resume
            setTimeout(() => {
                document.getElementById('ai-win-modal').style.display = 'none';
                console.log(`🏆 ${player.name} won ${winType} - Panel hidden, waiting 1 second...`);
                
                // Wait 1 more second then resume game
                setTimeout(() => {
                    this.gamePaused = false;
                    console.log(`▶️ Game resumed after ${winType} winner announcement`);
                }, 1000);
            }, 3000);
        }
    }
    
    addWinnerToPrizeBox(prizeType, winnerName) {
        // Add winner to the tracking array
        if (!this.prizeWinners[prizeType]) {
            this.prizeWinners[prizeType] = [];
        }
        this.prizeWinners[prizeType].push(winnerName);
        
        // Find the prize box by data-sides attribute
        let prizeBox;
        const prizeMapping = {
            'oneSide': '1',
            'twoSide': '2', 
            'threeSide': '3',
            'fourSide': '4',
            'fiveSide': '5'
        };
        
        const sidesValue = prizeMapping[prizeType];
        if (sidesValue) {
            prizeBox = document.querySelector(`[data-sides="${sidesValue}"]`);
        }
        
        if (prizeBox) {
            // Mark prize as won (reduce opacity to 50%)
            prizeBox.classList.add('won');
            
            // Update countdown to show "WON" immediately
            const countdown = prizeBox.querySelector('.prize-countdown');
            if (countdown) {
                countdown.textContent = 'WON';
                countdown.style.background = 'rgba(255, 215, 0, 0.8)';
                countdown.style.color = '#000';
                countdown.style.fontWeight = 'bold';
            }
            
            // Update the winner dropdown to show all winners
            const winnerDropdown = prizeBox.querySelector('.winner-dropdown');
            const winnerText = prizeBox.querySelector('.winner-text');
            
            if (winnerDropdown && winnerText) {
                // Display all winners for this prize level
                const allWinners = this.prizeWinners[prizeType];
                if (allWinners.length === 1) {
                    winnerText.textContent = allWinners[0];
                } else {
                    winnerText.textContent = `${allWinners.length} Winners: ${allWinners.join(', ')}`;
                }
            }
            
            // Add click handler to toggle between "WON" and winner names
            prizeBox.onclick = (e) => {
                e.stopPropagation();
                this.togglePrizeWinnerDisplay(prizeBox, prizeType);
            };
            
            console.log(`🏆 Prize ${prizeType} won by ${winnerName} - Total winners: ${this.prizeWinners[prizeType].length} - Countdown stopped`);
        } else {
            console.error(`❌ Could not find prize box for ${prizeType}`);
        }
    }
    
    togglePrizeWinnerDisplay(prizeBox, prizeType) {
        const countdown = prizeBox.querySelector('.prize-countdown');
        const winnerDropdown = prizeBox.querySelector('.winner-dropdown');
        const winnerText = prizeBox.querySelector('.winner-text');
        
        if (!countdown || !winnerDropdown || !winnerText || !this.prizeWinners[prizeType]) {
            return;
        }
        
        // Check current state - if showing "WON", switch to winner names
        if (countdown.textContent === 'WON') {
            // Show winner names instead of "WON"
            const allWinners = this.prizeWinners[prizeType];
            if (allWinners.length === 1) {
                countdown.textContent = allWinners[0];
            } else if (allWinners.length > 1) {
                countdown.textContent = `${allWinners.length} Winners`;
                // Show dropdown with all names
                winnerDropdown.style.display = 'block';
            }
            console.log(`📋 Showing winner names for ${prizeType}`);
        } else {
            // Currently showing winner names, switch back to "WON"
            countdown.textContent = 'WON';
            winnerDropdown.style.display = 'none';
            console.log(`🏆 Showing "WON" for ${prizeType}`);
        }
    }
    
    togglePrizeExpansion(prizeBox) {
        prizeBox.classList.toggle('expanded');
    }
    
    updateAllCountdowns() {
        // Calculate TG (To Go) for each side
        const sideStatus = this.calculateSideStatus();
        
        // Update each side prize countdown with best combination
        this.updateSidePrizeCountdowns(sideStatus);
    }
    
    calculateSideStatus() {
        const sides = [];
        
        // Check each face (side) of the cube
        for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
            const faceGroup = this.cube.children[faceIndex + 1];
            let markedCount = 0;
            let totalSquares = 0;
            
            faceGroup.children.forEach(squareGroup => {
                totalSquares++;
                if (squareGroup.userData.marked) {
                    markedCount++;
                }
            });
            
            const toGo = totalSquares - markedCount;
            const faceNames = ['Red', 'Green', 'Blue', 'Orange', 'Yellow', 'White'];
            
            sides.push({
                faceIndex: faceIndex,
                name: faceNames[faceIndex],
                markedCount: markedCount,
                toGo: toGo,
                isComplete: toGo === 0
            });
        }
        
        // Sort by closest to completion (lowest TG first)
        sides.sort((a, b) => a.toGo - b.toGo);
        
        return sides;
    }
    
    updateSidePrizeCountdowns(sideStatus) {
        // Only update countdowns for prizes that haven't been completed yet
        
        // One Side Prize - closest side to completion
        if (!this.completedPrizeLevels.has('oneSide')) {
            this.updatePrizeCountdown('one-side-prize', sideStatus.slice(0, 1));
        }
        
        // Two Side Prize - two closest sides combined
        if (!this.completedPrizeLevels.has('twoSide')) {
            this.updatePrizeCountdown('two-side-prize', sideStatus.slice(0, 2));
        }
        
        // Three Side Prize - three closest sides combined
        if (!this.completedPrizeLevels.has('threeSide')) {
            this.updatePrizeCountdown('three-side-prize', sideStatus.slice(0, 3));
        }
        
        // Four Side Prize - four closest sides combined
        if (!this.completedPrizeLevels.has('fourSide')) {
            this.updatePrizeCountdown('four-side-prize', sideStatus.slice(0, 4));
        }
        
        // Five Side Prize - all five closest sides combined
        if (!this.completedPrizeLevels.has('fiveSide')) {
            this.updatePrizeCountdown('five-side-prize', sideStatus.slice(0, 5));
        }
    }
    
    updatePrizeCountdown(prizeClass, selectedSides) {
        const prizeBox = document.querySelector(`.${prizeClass}`);
        if (!prizeBox) return;
        
        const countdown = prizeBox.querySelector('.prize-countdown');
        if (!countdown) return;
        
        // Calculate total TG for the selected sides
        let totalTG = 0;
        let allComplete = true;
        
        selectedSides.forEach(side => {
            if (!side.isComplete) {
                allComplete = false;
                totalTG += side.toGo;
            }
        });
        
        // Update countdown display
        if (allComplete) {
            countdown.textContent = 'WON';
            countdown.style.background = 'rgba(255, 215, 0, 0.8)';
            countdown.style.color = '#333';
        } else {
            countdown.textContent = `${totalTG}TG`;
            countdown.style.background = '';
            countdown.style.color = '';
        }
    }
    
    getCalledCountForColor(colorName) {
        let count = 0;
        for (let num = 1; num <= 9; num++) {
            const key = `${colorName}${num}`;
            if (this.calledNumbers.has(key)) {
                count++;
            }
        }
        return count;
    }
    
    getMinimumNeededForSidePrize() {
        // Calculate the minimum numbers still needed to complete any face on Player 1's cube
        let minNeeded = 9;
        let closestFace = -1;
        let maxMarked = 0;
        
        // Check each face of the human player's cube
        for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
            const faceGroup = this.cube.children[faceIndex + 1];
            const squares = faceGroup.children;
            
            let markedCount = 0;
            // Count how many squares are marked on this face
            for (let i = 0; i < squares.length; i++) {
                if (squares[i].userData.marked) {
                    markedCount++;
                }
            }
            
            const neededForThisFace = 9 - markedCount;
            
            // Find the face with the most marked squares (closest to completion)
            // If tied, take the one that needs fewer (closer to winning)
            if (markedCount > maxMarked || (markedCount === maxMarked && neededForThisFace < minNeeded)) {
                maxMarked = markedCount;
                minNeeded = neededForThisFace;
                closestFace = faceIndex;
            }
        }
        
        // Debug logging
        if (this.callCount > 0 && closestFace >= 0) {
            console.log(`Side Prize Countdown: ${this.getColorName(closestFace)} face has ${maxMarked} marked squares, needs ${minNeeded} more (${minNeeded}TG)`);
        }
        
        return Math.max(0, minNeeded);
    }
    
    updatePrizeAmounts() {
        const numPlayers = parseInt(document.getElementById('ai-players-input').value) + 1; // +1 for human player
        const totalPot = numPlayers * this.pricePerPlayer;
        
        // Calculate side prize amounts (updated percentages)
        const oneSideAmount = totalPot * 0.05; // 5% for 1 side
        const twoSideAmount = totalPot * 0.10; // 10% for 2 sides
        const threeSideAmount = totalPot * 0.15; // 15% for 3 sides
        const fourSideAmount = totalPot * 0.20; // 20% for 4 sides
        const fiveSideAmount = totalPot * 0.30; // 30% for 5 sides
        
        // Update side prizes with rollover
        const sidePrizes = [
            { key: 'oneSide', class: 'one-side-prize', amount: oneSideAmount },
            { key: 'twoSide', class: 'two-side-prize', amount: twoSideAmount },
            { key: 'threeSide', class: 'three-side-prize', amount: threeSideAmount },
            { key: 'fourSide', class: 'four-side-prize', amount: fourSideAmount },
            { key: 'fiveSide', class: 'five-side-prize', amount: fiveSideAmount }
        ];
        
        sidePrizes.forEach(prize => {
            const totalPrize = prize.amount + this.sidePrizeRollover[prize.key];
            const prizeBox = document.querySelector(`.${prize.class}`);
            if (prizeBox) {
                const prizeValue = prizeBox.querySelector('.prize-value');
                if (prizeValue) {
                    prizeValue.textContent = this.formatCurrency(totalPrize);
                }
            }
        });
    }
    
    formatCurrency(amount) {
        if (amount >= 1) {
            return `£${amount.toFixed(2)}`;
        } else {
            return `${Math.round(amount * 100)}p`;
        }
    }
    
    addToSidePrizeRollover(sideCount, amount) {
        const keys = ['oneSide', 'twoSide', 'threeSide', 'fourSide', 'fiveSide'];
        if (sideCount >= 1 && sideCount <= 5) {
            const key = keys[sideCount - 1];
            this.sidePrizeRollover[key] += amount;
        }
    }
    
    clearSidePrizeRollover(sideCount) {
        const keys = ['oneSide', 'twoSide', 'threeSide', 'fourSide', 'fiveSide'];
        if (sideCount >= 1 && sideCount <= 5) {
            const key = keys[sideCount - 1];
            this.sidePrizeRollover[key] = 0;
        }
    }
    
    togglePlayMode() {
        this.isAutoMode = !this.isAutoMode;
        const button = document.getElementById('play-mode-btn');
        
        if (this.isAutoMode) {
            button.textContent = 'Auto';
            button.className = 'mode-btn auto';
            
            console.log('🔄 Switching to Auto Mode - INSTANT cube reset');
            
            // INSTANT visual reset to starting position
            this.forceVisualReset();
            
            // Only start auto-play if game has been started
            if (this.gameStarted) {
                console.log('🚀 Starting auto-play from clean position');
                this.startAutoPlay();
            } else {
                console.log('⏳ Auto mode ready - click "Game Start" to begin auto-play');
            }
            
        } else {
            button.textContent = 'Manual';
            button.className = 'mode-btn manual';
            this.stopAutoPlay();
            
            // Update button text for manual mode
            if (this.gameStarted) {
                document.getElementById('call-number-btn').textContent = 'Call Next Number';
            } else {
                document.getElementById('call-number-btn').textContent = 'Game Start';
            }
            
            // Re-enable manual controls when switching back to manual mode
            this.controls.enabled = true;
            
            // Stop any ongoing rotation animations
            if (this.rotationAnimationId) {
                cancelAnimationFrame(this.rotationAnimationId);
                this.rotationAnimationId = null;
            }
            
            console.log('📱 Switched to Manual Mode - Cube controls enabled');
        }
    }
    
    resetCubePosition() {
        console.log('🔄 Resetting cube to front face (using same method as auto-play)...');
        
        // Use the exact same rotation method that works for auto-play
        // Target face 0 = front face = (0, 0, 0)
        this.spinToTargetFace(0, () => {
            console.log('✅ Cube reset to front face complete - Ready for auto-play');
        });
    }

    forceVisualReset() {
        console.log('⚡ INSTANT SNAP to starting position...');
        
        // Stop any existing animations completely
        if (this.rotationAnimationId) {
            cancelAnimationFrame(this.rotationAnimationId);
            this.rotationAnimationId = null;
        }
        
        console.log(`📍 Before: X=${(this.cube.rotation.x * 180/Math.PI).toFixed(1)}°, Y=${(this.cube.rotation.y * 180/Math.PI).toFixed(1)}°, Z=${(this.cube.rotation.z * 180/Math.PI).toFixed(1)}°`);
        
        // INSTANT SNAP - no animation whatsoever
        this.cube.rotation.x = 0;
        this.cube.rotation.y = 0; 
        this.cube.rotation.z = 0;
        
        // Also reset the OrbitControls target and position to default
        this.controls.reset();
        
        // Force complete matrix rebuild
        this.cube.updateMatrix();
        this.cube.updateMatrixWorld(true);
        
        console.log(`📐 After: X=${(this.cube.rotation.x * 180/Math.PI).toFixed(1)}°, Y=${(this.cube.rotation.y * 180/Math.PI).toFixed(1)}°, Z=${(this.cube.rotation.z * 180/Math.PI).toFixed(1)}°`);
        
        // Disable controls for auto mode
        this.controls.enabled = false;
        
        console.log('✅ INSTANT SNAP COMPLETE - Cube at (0,0,0)');
    }
    
    performActualReset() {
        console.log('🎬 Starting actual reset animation...');
        this.isResettingPosition = true;
        console.log(`🚦 Reset flag set to: ${this.isResettingPosition}`);
        
        // Record the actual current position
        const startPosition = {
            x: this.cube.rotation.x,
            y: this.cube.rotation.y,
            z: this.cube.rotation.z
        };
        
        const targetPosition = { x: 0, y: 0, z: 0 }; // Absolute starting position
        
        console.log(`📍 STARTING FROM: X=${(startPosition.x * 180/Math.PI).toFixed(1)}°, Y=${(startPosition.y * 180/Math.PI).toFixed(1)}°, Z=${(startPosition.z * 180/Math.PI).toFixed(1)}°`);
        console.log(`🎯 MOVING TO: X=0°, Y=0°, Z=0° (front face)`);
        
        // Calculate distance to see if animation is needed
        const totalDistance = Math.abs(startPosition.x) + Math.abs(startPosition.y) + Math.abs(startPosition.z);
        console.log(`📏 Total rotation distance: ${(totalDistance * 180/Math.PI).toFixed(1)}°`);
        
        if (totalDistance < 0.01) {
            console.log('✅ Already at starting position - no animation needed');
            this.isResettingPosition = false;
            console.log(`🚦 Reset flag cleared: ${this.isResettingPosition}`);
            return;
        }
        
        // Calculate shortest path for each axis
        const getShortestPath = (from, to) => {
            let diff = to - from;
            while (diff > Math.PI) diff -= 2 * Math.PI;
            while (diff < -Math.PI) diff += 2 * Math.PI;
            return from + diff;
        };
        
        const finalX = getShortestPath(startPosition.x, targetPosition.x);
        const finalY = getShortestPath(startPosition.y, targetPosition.y);
        const finalZ = getShortestPath(startPosition.z, targetPosition.z);
        
        console.log(`🔀 SHORTEST PATH TO: X=${(finalX * 180/Math.PI).toFixed(1)}°, Y=${(finalY * 180/Math.PI).toFixed(1)}°, Z=${(finalZ * 180/Math.PI).toFixed(1)}°`);
        
        const duration = 1500;
        const startTime = Date.now();
        let lastLoggedProgress = -1;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Log progress every 20%
            const progressPercent = Math.floor(progress * 5) * 20;
            if (progressPercent > lastLoggedProgress) {
                console.log(`🔄 Reset animation: ${progressPercent}%`);
                lastLoggedProgress = progressPercent;
            }
            
            if (progress < 1) {
                // Use cosine easing for smooth movement
                const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI);
                
                // Set cube rotation values - main animate loop will handle rendering
                this.cube.rotation.x = startPosition.x + (finalX - startPosition.x) * ease;
                this.cube.rotation.y = startPosition.y + (finalY - startPosition.y) * ease;
                this.cube.rotation.z = startPosition.z + (finalZ - startPosition.z) * ease;
                
                // Continue animation
                this.rotationAnimationId = requestAnimationFrame(animate);
            } else {
                // Set exact final position
                this.cube.rotation.x = 0;
                this.cube.rotation.y = 0;
                this.cube.rotation.z = 0;
                
                console.log(`✅ CUBE RESET COMPLETE!`);
                console.log(`📐 Final position: X=${(this.cube.rotation.x * 180/Math.PI).toFixed(1)}°, Y=${(this.cube.rotation.y * 180/Math.PI).toFixed(1)}°, Z=${(this.cube.rotation.z * 180/Math.PI).toFixed(1)}°`);
                
                this.rotationAnimationId = null;
                this.isResettingPosition = false; // Re-enable controls update in main loop
                console.log(`🚦 Reset flag cleared: ${this.isResettingPosition}`);
                
                // Keep controls disabled for auto mode
                console.log('🚀 Ready for auto-play with clean starting position');
            }
        };
        
        // Start the animation immediately
        console.log('� Starting reset animation loop...');
        this.rotationAnimationId = requestAnimationFrame(animate);
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        
        // Don't start auto-play until game has been manually started
        if (!this.gameStarted) {
            console.log('🚫 Auto-play blocked - game must be manually started first');
            return;
        }
        
        // Start the first call immediately
        this.autoPlayNext();
    }
    
    autoPlayNext() {
        if (!this.isAutoMode || this.availableNumbers.length === 0) {
            this.stopAutoPlay();
            return;
        }
        
        // Check if game is paused for winner announcement
        if (this.gamePaused) {
            console.log('⏸️ Auto-play paused for winner announcement');
            // Schedule to check again in 500ms
            this.autoPlayTimeout = setTimeout(() => {
                this.autoPlayNext();
            }, 500);
            return;
        }
        
        // Call the next number
        this.callNextNumber();
        
        // Auto-mark the called number after a brief delay
        setTimeout(() => {
            this.autoMarkCalledNumber();
        }, 500);
        
        // Schedule the next call after the complete sequence
        // 500ms (call delay) + 1000ms (rotation) + immediate marking + 2000ms (result viewing) = 3500ms
        this.autoPlayTimeout = setTimeout(() => {
            this.autoPlayNext();
        }, 3500);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        if (this.autoPlayTimeout) {
            clearTimeout(this.autoPlayTimeout);
            this.autoPlayTimeout = null;
        }
    }
    
    autoMarkCalledNumber() {
        if (!this.currentCall) return;
        
        // Find the matching square first to know which face to show
        let targetFaceIndex = -1;
        let targetSquare = null;
        let faceColorInfo = "";
        let foundSquares = []; // Debug: track all matches
        
        this.cube.children.slice(1).forEach((faceGroup, faceIndex) => {
            faceGroup.children.forEach((squareGroup) => {
                const userData = squareGroup.userData;
                if (userData.number === this.currentCall.number && 
                    userData.color === this.currentCall.color) {
                    
                    // Record this match for debugging
                    const faceNames = ['Front', 'Back', 'Right', 'Left', 'Top', 'Bottom'];
                    foundSquares.push({
                        face: faceNames[faceIndex],
                        faceIndex: faceIndex,
                        marked: userData.marked,
                        position: `${squareGroup.position.x.toFixed(1)}, ${squareGroup.position.y.toFixed(1)}`
                    });
                    
                    // Only use unmarked squares
                    if (!userData.marked && targetFaceIndex === -1) {
                        targetFaceIndex = faceIndex;
                        targetSquare = squareGroup;
                        faceColorInfo = `${faceNames[faceIndex]} (${userData.color}${userData.number})`;
                        
                        console.log(`=== FOUND TARGET ===`);
                        console.log(`Number: ${userData.number}, Color: ${userData.color}`);
                        console.log(`Located on: ${faceColorInfo} (Face Index ${faceIndex})`);
                        console.log(`Square position in face: ${squareGroup.position.x.toFixed(2)}, ${squareGroup.position.y.toFixed(2)}`);
                    }
                }
            });
        });
        
        // Debug: Show all found squares
        console.log(`🔍 All squares with ${this.currentCall.color}${this.currentCall.number}:`);
        foundSquares.forEach(square => {
            console.log(`  ${square.face}: marked=${square.marked}, pos=(${square.position})`);
        });
        
        if (targetFaceIndex !== -1 && targetSquare) {
            console.log(`✅ Using unmarked square on ${faceColorInfo}`);
            console.log(`Current cube rotation before spin: X=${this.cube.rotation.x.toFixed(3)}, Y=${this.cube.rotation.y.toFixed(3)}, Z=${this.cube.rotation.z.toFixed(3)}`);
            
            // Spin to face and mark
            this.spinToFaceAndMark(targetFaceIndex, targetSquare, faceColorInfo);
        } else {
            console.log('❌ No unmarked matching square found for', this.currentCall);
            if (foundSquares.length > 0) {
                console.log('ℹ️ All matching squares are already marked');
            }
        }
    }
    
    spinToFaceAndMark(targetFaceIndex, targetSquare, faceInfo) {
        console.log(`🎯 SPINNING TO SHOW: ${faceInfo}`);
        
        // Rotate to the face first
        this.spinToTargetFace(targetFaceIndex, () => {
            console.log(`✅ Rotation complete. Face visible: ${faceInfo}`);
            
            // Mark immediately when rotation stops - no delay
            console.log(`🔴 Marking square immediately: ${faceInfo}`);
            
            // Mark the square right away
            this.markSquare(targetSquare);
            this.checkForWins(targetSquare.userData.faceIndex);
            this.updateAllCountdowns();
            
            console.log('=== MARKING COMPLETE ===\n');
        });
    }
    
    spinToTargetFace(faceIndex, onComplete) {
        console.log(`🔄 TESTING rotation to face ${faceIndex}`);
        
        // Based on cube creation: faces are positioned but NOT rotated individually
        // We need to rotate the whole cube to bring the desired face to front
        const rotationTargets = [
            { x: 0, y: 0, z: 0 },                    // 0: Front face (no rotation needed)
            { x: 0, y: Math.PI, z: 0 },              // 1: Back face (rotate Y 180°)
            { x: 0, y: -Math.PI/2, z: 0 },           // 2: Right face (rotate Y -90°)
            { x: 0, y: Math.PI/2, z: 0 },            // 3: Left face (rotate Y 90°)  
            { x: Math.PI/2, y: 0, z: 0 },            // 4: Top face (rotate X 90°)
            { x: -Math.PI/2, y: 0, z: 0 }            // 5: Bottom face (rotate X -90°)
        ];
        
        const target = rotationTargets[faceIndex];
        if (!target) {
            console.error(`❌ Invalid face index: ${faceIndex}`);
            onComplete();
            return;
        }
        
        // Disable controls
        this.controls.enabled = false;
        
        // Stop existing animations
        if (this.rotationAnimationId) {
            cancelAnimationFrame(this.rotationAnimationId);
            this.rotationAnimationId = null;
        }
        
        const current = {
            x: this.cube.rotation.x,
            y: this.cube.rotation.y,
            z: this.cube.rotation.z
        };
        
        console.log(`📍 Current: X=${(current.x * 180/Math.PI).toFixed(0)}°, Y=${(current.y * 180/Math.PI).toFixed(0)}°`);
        console.log(`🎯 Target: X=${(target.x * 180/Math.PI).toFixed(0)}°, Y=${(target.y * 180/Math.PI).toFixed(0)}°`);
        
        // Calculate shortest path for smooth rotation
        const shortestPath = (from, to) => {
            let diff = to - from;
            while (diff > Math.PI) diff -= 2 * Math.PI;
            while (diff < -Math.PI) diff += 2 * Math.PI;
            return from + diff;
        };
        
        const finalX = shortestPath(current.x, target.x);
        const finalY = shortestPath(current.y, target.y);
        const finalZ = shortestPath(current.z, target.z);
        
        // Simple, direct rotation without easing complications
        const duration = 1000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            if (progress < 1) {
                // Linear interpolation for testing
                const t = progress;
                
                this.cube.rotation.x = current.x + (finalX - current.x) * t;
                this.cube.rotation.y = current.y + (finalY - current.y) * t;
                this.cube.rotation.z = current.z + (finalZ - current.z) * t;
                
                this.rotationAnimationId = requestAnimationFrame(animate);
            } else {
                // Snap to exact target
                this.cube.rotation.x = target.x;
                this.cube.rotation.y = target.y;
                this.cube.rotation.z = target.z;
                
                console.log(`✅ Should be showing face ${faceIndex} now`);
                console.log(`📐 Final: X=${(this.cube.rotation.x * 180/Math.PI).toFixed(0)}°, Y=${(this.cube.rotation.y * 180/Math.PI).toFixed(0)}°`);
                
                this.rotationAnimationId = null;
                this.controls.enabled = true;
                
                onComplete();
            }
        };
        
        this.rotationAnimationId = requestAnimationFrame(animate);
    }
    
    highlightCalledNumber(calledItem) {
        // Disabled to prevent color jumping during auto-rotation
        // The rotation system already shows the correct square clearly
        console.log(`Called ${calledItem.color}${calledItem.number} - rotation will show the square`);
        return;
    }

    handleCubeClick(event) {
        // Prevent rotation while in auto mode
        if (this.isAutoMode) {
            return;
        }
        
        event.stopPropagation();
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const rect = this.renderer.domElement.getBoundingClientRect();
        
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, this.camera);
        
        // Check for intersections with all square meshes
        const intersectableObjects = [];
        this.cube.children.slice(1).forEach((faceGroup) => {
            faceGroup.children.forEach((squareGroup) => {
                const squareMesh = squareGroup.userData.squareMesh;
                if (squareMesh) {
                    intersectableObjects.push(squareMesh);
                }
            });
        });
        
        const intersects = raycaster.intersectObjects(intersectableObjects);
        
        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            
            // Find the parent square group
            let squareGroup = null;
            this.cube.children.slice(1).forEach((faceGroup) => {
                faceGroup.children.forEach((sg) => {
                    if (sg.userData.squareMesh === clickedMesh) {
                        squareGroup = sg;
                    }
                });
            });
            
            if (squareGroup && !squareGroup.userData.marked) {
                const userData = squareGroup.userData;
                const key = `${userData.color}${userData.number}`;
                
                if (this.calledNumbers.has(key)) {
                    this.markSquare(squareGroup);
                    this.checkForWins(squareGroup.userData.faceIndex);
                    this.updateAllCountdowns();
                } else {
                    console.log(`${userData.color}${userData.number} has not been called yet`);
                }
            }
        }
    }

    markSquare(squareGroup) {
        if (!exactEndPosition) {
            console.error('❌ Invalid face index:', faceIndex);
            onComplete();
            return;
        }
        
        const faceNames = ['Front(Red)', 'Back(Green)', 'Right(Blue)', 'Left(Orange)', 'Top(Yellow)', 'Bottom(White)'];
        console.log(`🎯 TARGET: ${faceNames[faceIndex]} (Face ${faceIndex})`);
        console.log(`� EXACT END POSITION: X=${(exactEndPosition.x * 180/Math.PI).toFixed(1)}°, Y=${(exactEndPosition.y * 180/Math.PI).toFixed(1)}°, Z=${exactEndPosition.z}°`);
        
        // Step 2: Record current position 
        const startPosition = {
            x: this.cube.rotation.x,
            y: this.cube.rotation.y,
            z: this.cube.rotation.z
        };
        console.log(`🏁 START POSITION: X=${(startPosition.x * 180/Math.PI).toFixed(1)}°, Y=${(startPosition.y * 180/Math.PI).toFixed(1)}°, Z=${startPosition.z.toFixed(1)}°`);
        
        // Step 3: Calculate the DIRECT path to end position (with visual spins)
        // Add visual rotations but ensure we end up EXACTLY at target
        const visualSpins = 1.5; // Reduced for accuracy
        const animationEndX = exactEndPosition.x + (visualSpins * 2 * Math.PI);
        const animationEndY = exactEndPosition.y + (visualSpins * 2 * Math.PI);
        const animationEndZ = exactEndPosition.z;
        
        console.log(`🎬 ANIMATION TARGET: X=${(animationEndX * 180/Math.PI).toFixed(1)}°, Y=${(animationEndY * 180/Math.PI).toFixed(1)}°`);
        
        // Step 4: Stop any conflicting animations
        if (this.rotationAnimationId) {
            cancelAnimationFrame(this.rotationAnimationId);
            this.rotationAnimationId = null;
        }
        
        // Step 5: Animate DIRECTLY to calculated end position
        const startTime = Date.now();
        const duration = 2500; // Slightly faster
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            if (progress < 1) {
                // Smooth easing - directly interpolate to target
                const ease = progress * progress * (3 - 2 * progress);
                
                // Direct interpolation from start to calculated end
                this.cube.rotation.x = startPosition.x + (animationEndX - startPosition.x) * ease;
                this.cube.rotation.y = startPosition.y + (animationEndY - startPosition.y) * ease;
                this.cube.rotation.z = startPosition.z + (animationEndZ - startPosition.z) * ease;
                
                this.rotationAnimationId = requestAnimationFrame(animate);
            } else {
                // Step 6: SNAP to exact final position (no corrections needed)
                this.cube.rotation.x = exactEndPosition.x;
                this.cube.rotation.y = exactEndPosition.y;
                this.cube.rotation.z = exactEndPosition.z;
                
                console.log(`✅ LANDED PERFECTLY: X=${(this.cube.rotation.x * 180/Math.PI).toFixed(1)}°, Y=${(this.cube.rotation.y * 180/Math.PI).toFixed(1)}°, Z=${this.cube.rotation.z}°`);
                console.log(`🎯 ${faceNames[faceIndex]} showing correctly - NO CORRECTIONS NEEDED`);
                
                this.rotationAnimationId = null;
                onComplete();
            }
        };
        
        this.rotationAnimationId = requestAnimationFrame(animate);
    }
    
    highlightCalledNumber(calledItem) {
        // Disabled duplicate - already handled above
        return;
    }
    
    onMouseClick(event) {
        // Calculate mouse position
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Cast ray
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Find intersections with all cube faces
        const cubeGroups = this.cube.children.slice(1); // Skip the black core
        const allSquares = [];
        
        cubeGroups.forEach(faceGroup => {
            faceGroup.children.forEach(squareGroup => {
                if (squareGroup.userData && squareGroup.userData.hasOwnProperty('colorNumberKey')) {
                    allSquares.push(squareGroup);
                }
            });
        });
        
        const intersects = this.raycaster.intersectObjects(allSquares, true);
        
        if (intersects.length > 0) {
            // Find the closest square group that was clicked
            let squareGroup = intersects[0].object.parent;
            
            // Find the square group with userData
            while (squareGroup && (!squareGroup.userData || !squareGroup.userData.hasOwnProperty('colorNumberKey'))) {
                squareGroup = squareGroup.parent;
            }
            
            if (squareGroup && squareGroup.userData.hasOwnProperty('colorNumberKey')) {
                const userData = squareGroup.userData;
                
                // Only mark if this exact color+number combination has been called
                if (this.calledNumbers.has(userData.colorNumberKey)) {
                    this.markSquare(squareGroup);
                    this.checkForWins(squareGroup.userData.faceIndex);
                    // Update countdown displays after marking a square
                    this.updateAllCountdowns();
                }
            }
        }
    }
    
    markSquare(squareGroup) {
        if (squareGroup.userData.marked) return;
        
        squareGroup.userData.marked = true;
        
        // Add X mark for marked squares
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;
        
        context.clearRect(0, 0, 256, 256);
        context.strokeStyle = '#000000';
        context.lineWidth = 20;
        context.beginPath();
        context.moveTo(40, 40);
        context.lineTo(216, 216);
        context.moveTo(216, 40);
        context.lineTo(40, 216);
        context.stroke();
        
        const texture = new THREE.CanvasTexture(canvas);
        const markMaterial = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true 
        });
        const markGeometry = new THREE.PlaneGeometry(1.1, 1.1);
        const markMesh = new THREE.Mesh(markGeometry, markMaterial);
        markMesh.position.z = 0.03;
        
        squareGroup.add(markMesh);
    }
    
    checkForWins(faceIndex) {
        console.log(`Checking for wins on face ${faceIndex}`);
        
        // Get current side completion status
        const sideStatus = this.calculateSideStatus();
        const completedSides = sideStatus.filter(side => side.isComplete);
        const completedCount = completedSides.length;
        
        console.log(`Total completed sides: ${completedCount}`);
        
        // Progressive prize system - check only for the current active prize level
        const currentPrizeLevel = this.getCurrentPrizeLevel();
        if (!currentPrizeLevel) {
            console.log('All prize levels completed');
            return; // All prizes have been completed
        }
        
        const requiredSides = this.getPrizeLevelNumber(currentPrizeLevel);
        
        // Check if player qualifies for the current prize level and hasn't won it yet
        if (completedCount >= requiredSides && !this.prizeWinners[currentPrizeLevel].includes('Player 1')) {
            const prizeNames = {
                'oneSide': 'ONE SIDE PRIZE!',
                'twoSide': 'TWO SIDE PRIZE!',
                'threeSide': 'THREE SIDE PRIZE!',
                'fourSide': 'FOUR SIDE PRIZE!',
                'fiveSide': 'FIVE SIDE PRIZE!'
            };
            
            this.showSideWin(prizeNames[currentPrizeLevel], completedSides.slice(0, requiredSides), currentPrizeLevel);
        }
    }
    
    showSideWin(title, completedSides, prizeKey) {
        // Get the side names
        const sideNames = completedSides.map(side => side.name).join(', ');
        const details = `Completed ${completedSides.length} side${completedSides.length > 1 ? 's' : ''}: ${sideNames}`;
        
        // Add winner to prize tracking
        this.addWinnerToPrizeBox(prizeKey, 'Player 1');
        
        // Mark this prize level as completed (so everyone moves to next level)
        this.completedPrizeLevels.add(prizeKey);
        console.log(`🏆 Prize level ${prizeKey} completed! Next prize: ${this.getCurrentPrizeLevel() || 'None - All completed'}`);
        
        // Show win modal
        this.showWin(title, details);
        
        // Pause the game for winner announcement
        this.gamePaused = true;
        console.log(`⏸️ Game paused for Player ${title} winner announcement`);
        
        console.log(`🎉 ${title} - ${details}`);
        
        // Check if this is the five side prize (highest prize)
        if (prizeKey === 'fiveSide') {
            // Five side prize - reset game for new session
            setTimeout(() => {
                document.getElementById('win-modal').style.display = 'none';
                alert(`🎉 CONGRATULATIONS! You won the FIVE SIDE PRIZE! Game will reset for a new session.`);
                this.resetGame();
            }, 3000);
        } else {
            // 1-4 side prizes - continue game
            setTimeout(() => {
                document.getElementById('win-modal').style.display = 'none';
                console.log(`� Player won ${title} - Game continues!`);
                // Resume game by clearing pause state
                this.gamePaused = false;
                console.log(`▶️ Game resumed after ${title} winner announcement`);
                // Game continues automatically - no reset needed
            }, 3000);
        }
    }
    
    getColorName(faceIndex) {
        const colorNames = ['Red', 'Green', 'Blue', 'Yellow', 'Orange', 'White'];
        return colorNames[faceIndex];
    }
    
    showWin(title, details) {
        const colorMatch = details.match(/on (\w+) face/);
        const colorName = colorMatch ? colorMatch[1] : '';
        const prizeAmount = title === 'FULL HOUSE!' ? '£50' : '£20';
        const prizeType = title === 'FULL HOUSE!' ? 'Side Prize' : `${colorName} Prize`;
        
        document.getElementById('win-message').textContent = title;
        document.getElementById('win-details').textContent = details;
        document.getElementById('winner-name').textContent = 'Player 1';
        document.getElementById('winner-prize').textContent = `${prizeType}: ${prizeAmount}`;
        document.getElementById('win-modal').style.display = 'block';
    }
    
    resetGame() {
        // Stop auto-play if running (but don't change the mode preference)
        this.stopAutoPlay();
        
        // Reset game pause state
        this.gamePaused = false;
        
        // Reset progressive prize system
        this.completedPrizeLevels.clear();
        console.log('🔄 Progressive prize system reset - Starting with One Side Prize');
        
        // Reset game state
        this.calledNumbers.clear();
        this.currentCall = null;
        this.callCount = 0;
        this.calledBalls = [];
        
        // Reset prize winners and handle side prize rollovers
        const numPlayers = parseInt(document.getElementById('ai-players-input').value) + 1; // +1 for human player
        const totalPot = numPlayers * this.pricePerPlayer;
        
        // Handle unclaimed side prizes - add to rollover
        const sideKeys = ['oneSide', 'twoSide', 'threeSide', 'fourSide', 'fiveSide'];
        const percentages = [0.05, 0.10, 0.15, 0.20, 0.30];
        
        sideKeys.forEach((key, index) => {
            if (this.prizeWinners[key].length === 0) {
                // Prize wasn't won, add to rollover
                const prizeAmount = totalPot * percentages[index] + this.sidePrizeRollover[key];
                this.addToSidePrizeRollover(index + 1, prizeAmount);
            }
        });
        
        this.prizeWinners = {
            oneSide: [],
            twoSide: [],
            threeSide: [],
            fourSide: [],
            fiveSide: []
        };
        
        // Clear winner indicators from prize boxes
        document.querySelectorAll('.winner-indicator, .winners-list').forEach(element => {
            element.remove();
        });
        
        // Reset prize headers (remove trophies) and winner usernames
        document.querySelectorAll('.prize-header, .side-prize-header').forEach(header => {
            header.textContent = header.textContent.replace('🏆 ', '');
        });
        
        // Clear won states from prize boxes and reset visual appearance
        document.querySelectorAll('.prize-box').forEach(prizeBox => {
            prizeBox.classList.remove('won');
            prizeBox.onclick = null; // Remove click handlers
            
            // Hide winner dropdowns
            const dropdown = prizeBox.querySelector('.winner-dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
            
            // Clear winner text
            const winnerText = prizeBox.querySelector('.winner-text');
            if (winnerText) {
                winnerText.textContent = '';
            }
        });
        
        console.log('🔄 Prize boxes reset - All won states cleared');
        
        document.querySelectorAll('.winner-username').forEach(username => {
            username.remove();
        });
        
        // Remove expanded class and click handlers from prize boxes
        document.querySelectorAll('.prize-box, .side-prize-box').forEach(box => {
            box.classList.remove('expanded');
            box.onclick = null;
        });
        
        // Reset countdown colors
        document.querySelectorAll('.prize-countdown').forEach(countdown => {
            countdown.style.background = 'rgba(0, 0, 0, 0.3)';
            countdown.style.color = 'white';
        });
        
        // Reset UI
        document.getElementById('call-count').textContent = '0';
        document.getElementById('call-number-btn').textContent = 'Game Start';
        document.getElementById('current-ball-position').innerHTML = '';
        document.getElementById('previous-balls-container').innerHTML = '';
        
        // Reset game start state - require manual start for new game
        this.gameStarted = false;
        
        // Show AI settings and prize sections for new game setup
        this.showGameSetupSections();
        
        // Reset cube - remove and recreate
        this.scene.remove(this.cube);
        this.createRubiksCube();
        this.generateBingoTickets();
        this.initializeAvailableNumbers();
        
        // Regenerate AI players
        this.generateAIPlayers();
        
        // Update countdowns and prize amounts
        this.updateAllCountdowns();
        this.updatePrizeAmounts();
        
        // If still in auto mode (user preference unchanged), resume auto play
        if (this.isAutoMode) {
            console.log('🔄 Resuming auto mode after game reset');
            
            // Reset cube position for auto mode and resume
            this.resetCubePosition();
            
            // Resume auto play after cube reset
            setTimeout(() => {
                if (this.isAutoMode) { // Double-check in case user changed it
                    this.startAutoPlay();
                }
            }, 1000); // Wait for cube reset to complete
        }
    }
    
    // Hide AI settings during gameplay (but keep prizes visible)
    hideGameSetupSections() {
        const aiSettingsRow = document.getElementById('ai-settings-row');
        
        if (aiSettingsRow) {
            aiSettingsRow.style.display = 'none';
        }
        
        console.log('🎮 Hiding AI settings for gameplay (prizes remain visible)');
    }
    
    // Show AI settings when game ends
    showGameSetupSections() {
        const aiSettingsRow = document.getElementById('ai-settings-row');
        
        if (aiSettingsRow) {
            aiSettingsRow.style.display = 'flex';
        }
        
        console.log('🎮 Showing AI settings for game setup');
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new RubiksCubeBingo();
});