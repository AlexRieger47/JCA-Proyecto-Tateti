class TicTacToe {
    constructor() {
        this.board = Array(9).fill("");
        this.currentPlayer = "X";
        this.scores = {
            X: 0,
            O: 0
        }
        this.gameActive = true;

        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], //Filas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], //Columnas
            [0, 4, 8], [2, 4, 6] //Diagonales
        ];

        this.sounds = {
            zoomIn: new Audio('./assets/mp3/CellZoomIn.mp3'),
            zoomOut: new Audio('./assets/mp3/CellZoomOut.mp3'),
            press: new Audio('./assets/mp3/CellPress.mp3'),
            newReset: new Audio('./assets/mp3/NewRstButton.mp3'),
            gameWin: new Audio('./assets/mp3/GameWin.mp3')
        };
        
        // Flag para saber si el audio está habilitado
        this.audioEnabled = false;
        
        // Precargar los sonidos
        this.preloadSounds();

        this.initGame();
    }

    initGame() {
        this.cells = document.querySelectorAll(".cell");
        this.currentPlayerDisplay = document.getElementById("current-player");
        this.resetBtn = document.getElementById("reset-btn");
        this.newGameBtn = document.getElementById("new-game-btn");
        this.scoreX = document.getElementById("score-x");
        this.scoreO = document.getElementById("score-o");

        const titulo = document.getElementById("game-title");
        if (titulo) {
            titulo.textContent = "tateti";
            titulo.addEventListener("click", () => {
                titulo.style.color = "red";
            });
        }

        this.addEventListeners();
        this.updateDisplay();
        this.enableAudioOnFirstInteraction();
    }

    addEventListeners() {
        this.cells.forEach(cell => {
            // Evento de click para hacer jugada
            cell.addEventListener("click", this.handleCellClick.bind(this));
            
            cell.addEventListener("mouseenter", () => {
                this.playSound('zoomIn');
            });
            
            cell.addEventListener("mouseleave", () => {
                this.playSound('zoomOut');
            });
        });

        this.resetBtn.addEventListener("click", this.resetGame.bind(this));
        this.newGameBtn.addEventListener("click", this.newGame.bind(this));
    }

    handleCellClick(event) {
        const cell = event.target;
        const index = parseInt(cell.getAttribute("data-index"));

        if (this.board[index] !== "" || !this.gameActive) {
            return;
        }

        this.playSound('press');
        this.makeMove(index, cell);
    }

    updateDisplay() {
        this.currentPlayerDisplay.textContent = this.currentPlayer;
        this.currentPlayerDisplay.style.color = (this.currentPlayer === 'X') ? 'red' : 'blue'; // Cambia el color según el jugador
    }

    makeMove(index, cell) {
        this.board[index] = this.currentPlayer;
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase()); 

        if (this.checkWinner()) {
            this.handleGameEnd('win');
        } else if (this.checkDraw()) {
            this.handleGameEnd('draw');
        } else {
            this.switchPlayer();
        }
    }

    checkWinner() {
        for (const condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.highlightWinningCondition(condition);
                return true;
            }
        }
        return false;
    }

    checkDraw() {
        return this.board.every(cell => cell !== "");
    }

    highlightWinningCondition(winningConditions) {
        winningConditions.forEach(index => {
            this.cells[index].classList.add("winning");
        })
    }

    handleGameEnd(gameResult) {
        this.gameActive = false;

        if (gameResult == "win") {
            this.scores[this.currentPlayer]++;
            this.playSound('gameWin');
        } else {

        }

        this.updateDisplayScores();
    }

    switchPlayer() {
        this.currentPlayer = (this.currentPlayer === "X") ? "O" : "X";
        this.updateDisplay();
    }

    updateDisplayScores() {
        this.scoreX.textContent = this.scores.X;
        this.scoreO.textContent = this.scores.O;
    }

    // Método para precargar sonidos
    preloadSounds() {
        Object.values(this.sounds).forEach(audio => {
            audio.preload = 'auto';
            audio.volume = 0.7; // Volumen al 70%
        });
    }
    
    // Habilitar audio después de la primera interacción del usuario
    enableAudioOnFirstInteraction() {
        const enableAudio = () => {
            if (!this.audioEnabled) {
                Object.values(this.sounds).forEach(audio => {
                    audio.play().then(() => {
                        audio.pause();
                        audio.currentTime = 0;
                    }).catch(() => {});
                });
                this.audioEnabled = true;
                console.log('Audio habilitado');
            }
        };
        
        // Agregar listeners para habilitar audio en la primera interacción
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });
    }

    // Método para reproducir sonidos
    playSound(soundName) {
        if (this.sounds[soundName] && this.audioEnabled) {
            try {
                // Reiniciar el sonido al principio para permitir múltiples reproducciones rápidas
                this.sounds[soundName].currentTime = 0;
                const playPromise = this.sounds[soundName].play();
                
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log('Error al reproducir sonido:', soundName, error);
                    });
                }
            } catch (error) {
                console.log('Error al reproducir sonido:', soundName, error);
            }
        } else if (!this.audioEnabled) {
            console.log('Audio no habilitado aún. Haz click en cualquier lugar para habilitar los sonidos.');
        }
    }

    resetGame() {
        this.playSound('newReset');
        this.board = Array(9).fill("");
        this.gameActive = true;
        this.cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("x", "o", "winning");
        });
        this.currentPlayer = "X";
        this.updateDisplay();
        document.getElementById("game-status").textContent = "";
    }

    newGame() {
        this.playSound('newReset');
        this.resetGame();
        this.scores = { X: 0, O: 0 };
        this.updateDisplayScores();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});