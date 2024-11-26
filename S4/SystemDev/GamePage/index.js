const playerShips = [
    [ 0, 1, 1, 1, 0, 0, 0, 1, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1, 0, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 1, 1, 0, 0 ],
    [ 0, 0, 1, 0, 0, 1, 0, 1, 0, 0 ],
    [ 0, 0, 1, 0, 0, 1, 1, 1, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
];

const enemyShips = [
    [ 0, 0, 0, 0, 1, 0, 0, 1, 1, 1 ],
    [ 0, 0, 0, 1, 1, 1, 0, 0, 1, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 1, 1, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 1, 1, 1, 0, 0 ],
    [ 0, 0, 1, 0, 0, 1, 0, 1, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
]

const renderBoards = () => {
    for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 10; j++) {
            if(playerShips[i][j] === 1) {
                document.getElementById(`p-${i}-${j}`).classList.add("ship");
            }
            
            /*
            // for testing only
            if(enemyShips[i][j] === 1) {
                document.getElementById(`e-${i}-${j}`).classList.add("ship");
            }
            //*/
        }
    }
}

renderBoards();

let hitCountPlayer = 0;
let isGameOver = false;

document.getElementById("enemy-board").addEventListener(
    "click", (e) => {
        const { id = "" } = e.target;

        if(id.includes("e-")) {
            const [ _, row, col ] = id.split('-');
            
            if(enemyShips[row][col] >= 0) {
                enemyShips[row][col] -= 2;
                
                e.target.classList.remove("ship");
                
                if(enemyShips[row][col] == -1) {
                    e.target.classList.add("hit");
                    hitCountPlayer++;
                } else {
                    e.target.classList.add("miss");
                }

                checkVictory();

                if(!isGameOver) {
                    moveAI();
                    checkVictory();
                }
            }
        }
    }
)

let dropCountAI = 0;
let hitCountAI = 0;


const findPlayerShip = () => {
    while(true) {
        for(let i = random(0, 9); i < 10; i++) {
            for(let j = 0; j < 10; j++) {
                if(playerShips[i][j] === 1) {
                    return [i, j];
                }
            }
        }
    }
}

const difficulty = ["easy", "medium", "hard"][0];

const moveAI = () => {
    if(dropCountAI === 100) return;

    let moved = false;

    while(!moved) {
        let row = random(0, 9);
        let col = random(0, 9);

        if(difficulty === "easy") {
            if(Math.random() < 0.025 ) {
                [row, col] = findPlayerShip();
            }
        } else if(difficulty === "medium") {
            console.log({ hitCountPlayer, hitCountAI })
            if(Math.random() < (hitCountPlayer - hitCountAI) / 10) {
                [row, col] = findPlayerShip();
            }
        } else if(difficulty === "hard") {
            if(Math.random() < 0.5 ) {
                [row, col] = findPlayerShip();
            }
        }

        if(playerShips[row][col] >= 0) {
            moved = true;
            dropCountAI++;

            playerShips[row][col] -= 2;

            const cell = document.getElementById(`p-${row}-${col}`);

            cell.classList.remove("ship");

            if(playerShips[row][col] == -1) {
                cell.classList.add("hit");
                hitCountAI++;
            } else {
                cell.classList.add("miss");
            }
        }
    }
}

document.getElementById("fireBtn").addEventListener('click', moveAI);

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const checkVictory = () => {
    let [ didPlayerWin, didAIWin ] = [ true, true ];

    for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 10; j++) {
            if(playerShips[i][j] === 1) { 
                didAIWin = false;
            }
            
            if(enemyShips[i][j] === 1) {
                didPlayerWin = false;
            }
        }
    }

    if(didPlayerWin) {
        alert("you won!");
        isGameOver = true;
        location.reload();
    }

    if(didAIWin) {
        alert("AI won, better luck next time :)");
        isGameOver = true;
        location.reload();
    }

}