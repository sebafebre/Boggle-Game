"use strict";

// Variables globales
var board, currentWord, foundWords, timer, score, timerInterval, playerName;
var selectedLetters = [];

// Inicialización del juego
document.getElementById("start-game").addEventListener("click", function() {
    playerName = document.getElementById("player-name").value;
    if (playerName.length < 3) {
        alert("El nombre del jugador debe tener al menos 3 letras.");
        return;
    }
    initGame();
});

function initGame() {
    // Inicializar variables
    board = generateBoard();
    currentWord = "";
    foundWords = [];
    score = 0;
    selectedLetters = [];
    
    // Mostrar el tablero
    displayBoard();

    // Iniciar el temporizador
    var timerDuration = parseInt(document.getElementById("timer-select").value) * 60;
    startTimer(timerDuration);

    // Limpiar el área de palabras encontradas y el puntaje
    document.getElementById("found-words").textContent = "";
    document.getElementById("score").textContent = "Puntaje: 0";
    document.getElementById("current-word").textContent = "";
}

function generateBoard() {
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var board = [];
    for (var i = 0; i < 16; i++) {
        var randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
        board.push(randomLetter);
    }
    return board;
}

function displayBoard() {
    var boardContainer = document.getElementById("board");
    boardContainer.innerHTML = "";
    for (var i = 0; i < board.length; i++) {
        var cell = document.createElement("div");
        cell.textContent = board[i];
        cell.dataset.index = i;
        cell.classList.add("board-cell");
        cell.addEventListener("click", selectLetter);
        boardContainer.appendChild(cell);
    }
}

function selectLetter(event) {
    var index = parseInt(event.target.dataset.index);
    if (selectedLetters.includes(index)) return;

    // Validar si la letra es contigua a la última seleccionada
    if (selectedLetters.length > 0) {
        var lastSelectedIndex = selectedLetters[selectedLetters.length - 1];
        if (!isAdjacent(lastSelectedIndex, index)) return;
    }

    selectedLetters.push(index);
    currentWord += board[index];
    document.getElementById("current-word").textContent = currentWord;

    // Mostrar las letras seleccionadas en el tablero
    event.target.classList.add("selected");

    // Quitar el borde especial de la letra anteriormente seleccionada
    var previousLastSelected = document.querySelector(".last-selected");
    if (previousLastSelected) {
        previousLastSelected.classList.remove("last-selected");
    }

    // Agregar el borde especial a la última letra seleccionada
    event.target.classList.add("last-selected");

    updateCellColors();
}

function updateCellColors() {
    var cells = document.querySelectorAll("#board div");
    cells.forEach(function(cell) {
        var index = parseInt(cell.dataset.index);
        cell.classList.remove("adjacent", "non-adjacent");

        if (selectedLetters.includes(index)) {
            return;
        }

        if (selectedLetters.length === 0) {
            cell.classList.add("non-adjacent");
        } else {
            var lastSelectedIndex = selectedLetters[selectedLetters.length - 1];
            if (isAdjacent(lastSelectedIndex, index)) {
                cell.classList.add("adjacent");
            } else {
                cell.classList.add("non-adjacent");
            }
        }
    });
}

function isAdjacent(index1, index2) {
    var row1 = Math.floor(index1 / 4);
    var col1 = index1 % 4;
    var row2 = Math.floor(index2 / 4);
    var col2 = index2 % 4;

    return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
}

function startTimer(duration) {
    timer = duration;
    displayTimer();
    timerInterval = setInterval(function() {
        timer--;
        displayTimer();
        if (timer <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function displayTimer() {
    var minutes = Math.floor(timer / 60);
    var seconds = timer % 60;
    document.getElementById("timer").textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function endGame() {
    alert("¡Tiempo terminado!");
    // Mostrar puntaje final y palabras encontradas
    document.getElementById("score").textContent = "Puntaje: " + score;
    document.getElementById("found-words").textContent = "Palabras encontradas: " + foundWords.join(", ");
}

// Función para validar palabra usando la API del DLE
function isValidWord(word, callback) {
    var xhr = new XMLHttpRequest();
    var url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            // Si la respuesta contiene definiciones, la palabra es válida
            if (response.length > 0 && response[0].meanings.length > 0) {
                callback(true);
            } else {
                callback(false);
            }
        } else if (xhr.readyState === 4) {
            callback(false);
        }
    };
    xhr.send();
}

// Validar palabra y actualizar puntaje
document.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        validateWord();
    }
});

function validateWord() {
    if (currentWord.length < 3) {
        alert("La palabra debe tener al menos 3 letras.");
        resetCurrentWord();
        return;
    }

    if (foundWords.includes(currentWord)) {
        alert("La palabra ya ha sido encontrada.");
        resetCurrentWord();
        return;
    }

    isValidWord(currentWord, function(isValid) {
        if (isValid) {
            foundWords.push(currentWord);
            updateScore(currentWord);
            document.getElementById("found-words").textContent = "Palabras encontradas: " + foundWords.join(", ");
        } else {
            alert("La palabra no es válida.");
            // Penalización
            score -= 1;
            document.getElementById("score").textContent = "Puntaje: " + score;
        }
        resetCurrentWord();
    });
}


function resetCurrentWord() {
    currentWord = "";
    selectedLetters = [];
    document.getElementById("current-word").textContent = "";
    // Resetear colores de las letras seleccionadas
    var cells = document.querySelectorAll("#board div");
    cells.forEach(function(cell) {
        cell.classList.remove("selected", "last-selected", "current-selected");
    });

    updateCellColors();
}

function updateScore(word) {
    var length = word.length;
    var points = 0;
    if (length === 3 || length === 4) points = 1;
    else if (length === 5) points = 2;
    else if (length === 6) points = 3;
    else if (length === 7) points = 5;
    else if (length >= 8) points = 11;
    score += points;
    document.getElementById("score").textContent = "Puntaje: " + score;
}
