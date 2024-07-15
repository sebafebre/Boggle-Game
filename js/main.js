"use strict";

// Variables globales
var board, currentWord, foundWords, timer, score, timerInterval, playerName;
var selectedLetters = [];
var gameOver = false;
// Inicialización del juego
document.getElementById("start-game").addEventListener("click", function() {
    playerName = document.getElementById("player-name").value;
    if (playerName.length < 3) {
        showMessageModal("El nombre del jugador debe tener al menos 3 letras.");
        return;
    }

    if (timerInterval) {
        clearInterval(timerInterval);
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
    var gameOver = false;

    // Mostrar el tablero
    displayBoard();

    // Iniciar el temporizador
    var timerDuration = parseInt(document.getElementById("timer-select").value) * 60;
    // Obtener el elemento donde se mostrará el temporizador
    var timerDisplay = document.getElementById("timer"); // Asegúrate de tener un elemento con ID "timer" en tu HTML

    // Iniciar el temporizador y almacenar el intervalo en timerInterval
    timerInterval = startTimer(timerDuration, timerDisplay);

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

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    return setInterval(function() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // Actualizar el texto del temporizador en el elemento display
        display.textContent = minutes + ":" + seconds;

        // Cambiar el color del temporizador a rojo cuando llegue a 10 segundos o menos
        if (timer <= 10) {
            display.style.color = "#ff0000"; // Color rojo
        } else {
            display.style.color = "#000000"; // Color predeterminado (negro)
        }

        // Finalizar el juego cuando el temporizador llegue a cero
        if (--timer < 0) {
            clearInterval(timerInterval);
            display.textContent = "00:00";
            endGame();
        }
    }, 1000);
}


function displayTimer() {
    var minutes = Math.floor(timer / 60);
    var seconds = timer % 60;
    document.getElementById("timer").textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

/*
function endGame() {
    alert("¡Tiempo terminado!");
    // Mostrar puntaje final y palabras encontradas
    document.getElementById("score").textContent = "Puntaje: " + score;
    document.getElementById("found-words").textContent = "Palabras encontradas: " + foundWords.join(", ");
}*/

function endGame() {
    if (!gameOver) { // Verificar si el juego ya ha terminado para evitar guardar múltiples veces
        gameOver = true;

        // Guardar resultado de la partida
        var currentDate = new Date();
        var gameResult = {
            playerName: playerName,
            score: score,
            dateTime: currentDate.toLocaleString()
        };

        // Agregar el nuevo resultado al arreglo de resultados
        gameResults.push(gameResult);

        // Guardar los resultados actualizados en LocalStorage
        localStorage.setItem("gameResults", JSON.stringify(gameResults));

        // Actualizar los resultados ordenados y mostrar el modal
        sortedResults = gameResults.slice(0); // Copia los resultados para no modificar el original directamente
        openResultsModal();
    }
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
        showMessageModal("La palabra debe tener al menos 3 letras.");
        resetCurrentWord();
        return;
    }

    if (foundWords.includes(currentWord)) {
        showMessageModal("La palabra ya ha sido encontrada.");
        resetCurrentWord();
        return;
    }

    isValidWord(currentWord, function(isValid) {
        if (isValid) {
            foundWords.push(currentWord);
            updateScore(currentWord);
            document.getElementById("found-words").textContent = "Palabras encontradas: " + foundWords.join(", ");
        } else {
            showMessageModal("La palabra no es válida.");
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




// Función para mostrar el modal de mensajes
function showMessageModal(message) {
    var modal = document.getElementById("message-modal");
    var messageText = document.getElementById("message-text");
    var closeButton = document.getElementById("close-message-modal");

    messageText.textContent = message;
    modal.style.display = "block";

    closeButton.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

}













//



// Variables globales para mantener el estado del ordenamiento
var currentSortField = null;
var isAscending = true;

// Recuperar resultados del LocalStorage
var gameResults = JSON.parse(localStorage.getItem("gameResults")) || [];
var sortedResults = gameResults.slice(0); // Copia los resultados para no modificar el original directamente
var tableBody = document.getElementById("results-table");

// Función para llenar la tabla con los resultados
function fillTable(results) {
    tableBody.innerHTML = "";

    results.forEach(function(result) {
        var row = document.createElement("tr");
        row.innerHTML = "<td>" + result.playerName + "</td>" +
                        "<td class='score'>" + result.score + "</td>" +
                        "<td class='dateTime'>" + result.dateTime + "</td>";
        tableBody.appendChild(row);
    });
}




// Asignar eventos al botón de Ranking en el header y al botón de Volver al inicio en el modal
document.getElementById("button").addEventListener("click", openResultsModal);
document.getElementById("close-modal").addEventListener("click", closeModal);

// Función para volver al inicio
function goToHome() {
    window.location.href = "index.html"; // Reemplazar con el nombre de tu página inicial
}


function sortTable(field) {
    // Si se hace clic en el mismo campo de ordenamiento, alternar entre ascendente y descendente
    if (currentSortField === field) {
        isAscending = !isAscending; // Cambia el tipo de orden
    } else {
        currentSortField = field; // Establece el nuevo campo de ordenamiento
        isAscending = true; // Por defecto, comienza con orden ascendente
    }

    // Ordena los resultados según el campo y tipo de ordenamiento actual
    if (field === 'score') {
        sortedResults.sort(function(a, b) {
            return isAscending ? a.score - b.score : b.score - a.score;
        });
    } else if (field === 'dateTime') {
        sortedResults.sort(function(a, b) {
            var dateA = parseDate(a.dateTime);
            var dateB = parseDate(b.dateTime);
            var comparison = dateA - dateB;
            return isAscending ? comparison : -comparison;
        });
    }

    // Llena la tabla con los resultados ordenados
    fillTable(sortedResults);
}

// Función para parsear la fecha en el formato correcto
function parseDate(dateTimeString) {
    var parts = dateTimeString.split(", ");
    var dateParts = parts[0].split("/");
    var timeParts = parts[1].split(":");
    return new Date(
        dateParts[2],    // Año
        dateParts[1] - 1, // Mes (0-indexed en JavaScript)
        dateParts[0],    // Día
        timeParts[0],    // Hora
        timeParts[1],    // Minuto
        timeParts[2]     // Segundo
    );
}



// Función para abrir el modal de resultados
function openResultsModal() {
    var modal = document.getElementById("game-over-modal");
    modal.style.display = "block";

    // Recuperar resultados del LocalStorage
    gameResults = JSON.parse(localStorage.getItem("gameResults")) || [];
    sortedResults = gameResults.slice(0); // Copia los resultados para no modificar el original directamente

    // Llenar la tabla con los resultados almacenados
    fillTable(sortedResults);

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}
// Función para cerrar el modal
function closeModal() {
    var modal = document.getElementById("game-over-modal");
    modal.style.display = "none";
}












