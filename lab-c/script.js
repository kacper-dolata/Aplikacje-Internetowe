let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        if (err) {
            console.error(err);
            return;
        }

        if (document.getElementById('grid') !== null) {
            document.getElementById('board').removeChild(document.getElementById('grid'));
        }

        let rasterMap = document.createElement('canvas');
        rasterMap.id = "rasterMap";
        document.getElementById('board').appendChild(rasterMap);

        let rasterContext = rasterMap.getContext("2d");
        rasterContext.drawImage(canvas, 0, 0, 300, 150);
        console.log("Image saved.");

        let empty_board = createBoard();
        rasterMap.parentNode.replaceChild(empty_board, rasterMap);

        createPuzzlePieces(canvas);

        const dropTargets = document.querySelectorAll('.drop-target');
        dropTargets.forEach(target => {
            target.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            target.addEventListener("dragenter", function (event) {
                this.style.background = "orange";
            });
            target.addEventListener("dragleave", function (event) {
                this.style.background = "red";
            });
            target.addEventListener('drop', (e) => {
                e.preventDefault();
                const data = e.dataTransfer.getData('text');
                const draggableElement = document.getElementById(data);
                if (target.children.length === 0) {
                    const currentParent = draggableElement.parentNode;
                    if (currentParent !== target) {
                        if (currentParent) {
                            currentParent.removeChild(draggableElement);
                        }
                        target.appendChild(draggableElement);
                        checkPuzzleCompletion();
                    }
                }
            });
        });
    });
});

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        if (marker) {
            map.removeLayer(marker);
        }

        map.setView([lat, lon]);
        marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`Twoja lokalizacja: ${lat}, ${lon}`);
    }, positionError => {
        console.error(positionError);
    });
});

function createBoard() {
    let grid = document.createElement("div");
    grid.classList.add("grid");
    grid.id = "grid";

    for (let i = 0; i < 16; i++) {
        let cell = document.createElement("div");
        cell.classList.add("drop-target");
        cell.id = "cell_" + (i + 1);
        grid.appendChild(cell);
    }

    console.log(grid);
    return grid;
}

function createPuzzleContainer(){
    if(document.getElementById("puzzleContainer") !== null) {
        document.body.removeChild(document.getElementById("puzzleContainer"));
    }

    let puzzleContainer = document.createElement('div');
    puzzleContainer.id = "puzzleContainer";
    document.body.appendChild(puzzleContainer);
}

function createPuzzlePieces(sourceCanvas) {
    createPuzzleContainer();

    const numRows = 4;
    const numCols = 4;

    const pieceWidth = sourceCanvas.width / numCols;
    const pieceHeight = sourceCanvas.height / numRows;

    const pieces = [];

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const pieceCanvas = document.createElement('canvas');
            pieceCanvas.width = pieceWidth;
            pieceCanvas.height = pieceHeight;
            const pieceContext = pieceCanvas.getContext('2d');

            pieceContext.drawImage(
                sourceCanvas,
                col * pieceWidth, row * pieceHeight,
                pieceWidth, pieceHeight,
                0, 0,
                pieceWidth, pieceHeight
            );

            pieceCanvas.classList.add('draggable');
            pieceCanvas.id = `piece_${row * numCols + col + 1}`;
            pieceCanvas.draggable = true;

            pieces.push(pieceCanvas);
        }
    }

    shuffleArray(pieces);

    pieces.forEach(piece => {
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', e.target.id);
        });
        document.getElementById('puzzleContainer').appendChild(piece);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

function checkPuzzleCompletion() {
    const dropTargets = document.querySelectorAll('.drop-target');
    let correctCount = 0;
    let filledCount = 0;

    dropTargets.forEach(target => {
        const pieceId = target.children[0]?.id;
        if (pieceId) {
            const pieceIndex = parseInt(pieceId.split('_')[1], 10);
            const targetIndex = parseInt(target.id.split('_')[1], 10);
            if (pieceIndex === targetIndex) {
                correctCount++;
            }
        }

        if (target.children.length > 0) {
            filledCount++;
        }
    });

    if (correctCount === dropTargets.length) {
        notifyMe("Gratulacje, Wyrgałeś!");
    }

    else if (filledCount === dropTargets.length) {
        notifyMe("Niestety nie udało się tym razem, spróbuj ponownie!");
    }
}

function notifyMe(message) {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications");
    } else if (Notification.permission === "granted") {
        new Notification(message);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification(message);
            }
        });
    }
}