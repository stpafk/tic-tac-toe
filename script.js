
//button handlings
const form = document.querySelector("#form");
const resetButton = document.querySelector(".newGame");
const restartButton = document.querySelector(".restartGame");

resetButton.addEventListener("click", () => {
    location.reload();
});

// variables that will keep track of game conditions

// handle form submission
form.addEventListener("submit", (event) => {
    event.preventDefault() //prevent page refresh

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    //document.querySelector('.players').setAttribute("hidden", true); //hide div when clicked
    document.querySelector('header').style.display = "none";
    document.querySelector('main').style.display = "flex";
    initalizeGame(data);
});

//"global" variables
const constructVariables = (data) => {
    data.choice = +data.choice;
    data.board = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // the game board
    data.player1 = "X";
    data.player2 = "O";
    data.round = 0 // keep track of round
    data.currPlayer = "X"; // mutable type to keep track of whose round is
    data.running = false; //changes to true when won
};

// winning conditions
const boardChecking = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

//event listener to gameBoard
const gameBoardHandling = (data) => {
    document.querySelectorAll(".marker").forEach((marker) => {
        marker.addEventListener("click", (event) => {
            gameMove(event.target, data);
        });
    });
    restartButton.addEventListener("click", () => {
        constructVariables(data);
        resetDom();
        changeDom("varTurn", `${data.player1Name}'s turn`)
    });
};

// handle game moves
const gameMove = (marker, data) => {
    if (data.running || data.round > 8) {
        return;
    };
    if (data.board[marker.id] === "X" || data.board[marker.id] === "O") {
        return;
    };

    data.board[marker.id] = data.currPlayer;
    marker.textContent = data.currPlayer;
    marker.style.cursor = "default";
    marker.classList.add(data.currPlayer === "X" ? "player1" : "player2");
    data.round++;

    if (endGame(data)) {
        return;
    };

    changePlayer(data);
};

//change round
const changePlayer = (data) => {
    data.currPlayer = data.currPlayer === "X" ? "O" : "X";
    //change DOM
    let markerTurn = data.currPlayer === "X" ? data.player1Name : data.player2Name;
    changeDom("varTurn", `${markerTurn}'s turn`);
};

// function to start the game
const initalizeGame = (data) => {
    //change dom
    document.querySelector(".varTurn").removeAttribute("hidden");
    changeDom("varTurn", `${data.player1Name}'s turn`)
    //init variables
    constructVariables(data);
    //gameBoardHandling
    gameBoardHandling(data);
};

//win condiiton checking
const winCondition = (data, player) => {
    let res = false;
    boardChecking.forEach((check) => {
        if (
            data.board[check[0]] === player &&
            data.board[check[1]] === player &&
            data.board[check[2]] === player
        ) {
            res = true;
        }
    });
    return res;
}

const toggleBoard = () => {
    const markers = document.querySelectorAll(".marker");
    markers.forEach(marker => {
        marker.style.cursor = "default"
    }) 
}

// function that check if game's gonna end 
const endGame = (data) => {
    // winner tie or game still running
    if (winCondition(data, data.currPlayer)) {
        let winner = data.currPlayer === "X" ? data.player1Name : data.player2Name;
        changeDom("varTurn", `${winner} has won the game!`);
        toggleBoard()
        return true;
    } else if (data.round === 9) {
        changeDom("varTurn", "It's a tie!");
        toggleBoard()
        data.running = true;
        return true
    }
    return false;
};

//change DOM and DIV
const changeDom = (class_, text) => {
    const elem = document.querySelector(`.${class_}`);
    elem.textContent = text;
};

const resetDom = () => {
    document.querySelectorAll(".marker").forEach((marker) => {
        marker.className = "marker";
        marker.style.cursor = "pointer";
        marker.textContent = "";
    });
};
