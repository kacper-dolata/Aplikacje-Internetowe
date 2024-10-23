class ToDo {
    constructor() {
        this.tasks = [];
        this.dates = [];
        this.draw();
        this.bindEvents();
    }

    draw() {
        const storageTasks = localStorage.getItem('tasks');
        const storageDates = localStorage.getItem('dates');

        if (storageDates && storageTasks) {
            this.tasks = JSON.parse(storageTasks);
            this.dates = JSON.parse(storageDates);
        }

        const ul = document.getElementById('taskList');
        ul.innerHTML = "";

        const searchText = document.getElementById('searchInput').value.toLowerCase();
        const searchLength = searchText.length;

        for (let i = 0; i < this.tasks.length; i++) {
            const taskText = this.tasks[i];

            if (searchLength < 2 || taskText.toLowerCase().includes(searchText)) {
                let li = document.createElement('li');
                let div = document.createElement('div');

                let startIndex = taskText.toLowerCase().indexOf(searchText);
                let endIndex = startIndex + searchText.length;

                if (searchLength > 1 && startIndex !== -1) {
                    let highlightedText = taskText.substring(0, startIndex) +
                        "<span style='background-color: yellow;'>" +
                        taskText.substring(startIndex, endIndex) +
                        "</span>" +
                        taskText.substring(endIndex);
                    li.innerHTML = highlightedText;
                } else {
                    li.textContent = taskText;
                }

                let date = document.createElement('input');
                date.setAttribute('type', 'date');
                date.value = this.dates[i] ? this.dates[i] : '';
                date.onchange = () => {
                    this.dates[i] = date.value;
                    localStorage.setItem('dates', JSON.stringify(this.dates));
                };

                let removeButton = document.createElement('button');
                removeButton.id = 'remove';
                removeButton.onclick = () => {
                    this.dates.splice(i, 1);
                    this.tasks.splice(i, 1);
                    localStorage.setItem('tasks', JSON.stringify(this.tasks));
                    localStorage.setItem('dates', JSON.stringify(this.dates));
                    this.draw();
                };

                let remove_text = document.createTextNode('Usuń');
                removeButton.appendChild(remove_text);

                div.appendChild(date);
                div.appendChild(removeButton);
                li.appendChild(div);
                ul.appendChild(li);

                li.onclick = () => {
                    const inputObject = document.createElement('input');
                    inputObject.setAttribute('type', 'text');
                    inputObject.setAttribute('id', 'inputObject');
                    inputObject.setAttribute('value', this.tasks[i]);
                    inputObject.onblur = () => {
                        this.tasks[i] = inputObject.value;
                        if (this.tasks[i].length > 2 && this.tasks[i].length < 256) {
                            let startIndex = this.tasks[i].toLowerCase().indexOf(searchText);
                            let endIndex = startIndex + searchText.length;

                            if (startIndex !== -1) {
                                let highlightedText = this.tasks[i].substring(0, startIndex) +
                                    "<span style='background-color: yellow;'>" +
                                    this.tasks[i].substring(startIndex, endIndex) +
                                    "</span>" +
                                    this.tasks[i].substring(endIndex);
                                li.innerHTML = highlightedText;
                            } else {
                                li.textContent = this.tasks[i];
                            }
                            li.appendChild(date);
                            li.appendChild(removeButton);
                            localStorage.setItem('tasks', JSON.stringify(this.tasks));
                            this.draw();
                        } else {
                            alert("Długość nie może być mniejsza niż 3 i większa niż 255");
                        }
                    };
                    li.innerHTML = "";
                    li.appendChild(inputObject);
                    this.getFocus('inputObject');
                };
            }
        }
    }
    getFocus(id) {
        document.getElementById(id).focus();
    }
    addTask() {
        let taskInput = document.getElementById("taskInput");
        let dateInput = document.getElementById('dateInput').value;

        if (taskInput.value.length > 2 && taskInput.value.length < 256) {
            if (dateInput === '' || new Date(dateInput) > new Date()) {
                this.tasks.push(taskInput.value);
                this.dates.push(dateInput);
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
                localStorage.setItem('dates', JSON.stringify(this.dates));
                taskInput.value = "";
                document.getElementById('dateInput').value = "";
            } else {
                alert("Data musi być w przyszłości lub pusta");
                document.getElementById('dateInput').value = "";
            }
        } else {
            alert("Długość tekstu musi być dłuższa niż 2 i krótsza niż 256 znaków");
            taskInput.value = "";
        }

        this.draw();
    }
    bindEvents() {
        document.getElementById('addTaskButton').onclick = () => this.addTask();
        document.getElementById('searchInput').oninput = () => this.draw();
    }
}

const to_do = new ToDo();