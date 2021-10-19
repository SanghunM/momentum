class Todo {
    static id = 1;
    #id_; 
    
    constructor(content = '', price = 0, type = 'study') {
        this.#id_ = Todo.id++;
        /**
         * @private { string }
         */
        this.content_ = content;
        this.price_ = price;
        this.type_ = type;
        this.isDone_ = false;
    }

    get getId() {
        return this.#id_;
    }

    get getPrice() {
        return this.price_;
    }

    set setPrice(value) {
        this.price_ = value;
    }

    set setContent(c) {
        this.content_ = c;
    }

    get getPriceFormat() {
        return `$${this.price_}`;
    }


    toString() {
        if(typeof this.content_ !== 'string') {
            this.content_ = this.content_ + "";
        }
        return this.content_;
    }
}

function Todo2() {
    let content = "";

    return {
        getContent: () => content,
        setContent: (c) => {
            content = c;
        }
    }
}

// 
class TodoList {
    /*
    new Todo('study React', 30, 'study'), 
    new Todo('study English', 20, 'study'), 
    new Todo('play guitar', 25, 'hobby'), 
    new Todo('meet friends', 100, 'social'),
    new Todo('play games', 50, 'hobby')
    */

    #todoList;
    
    constructor() {
        this.#todoList = [
            new Todo('study React', 30, 'study'), 
            new Todo('study English', 20, 'study'), 
            new Todo('play guitar', 25, 'hobby'), 
            new Todo('meet friends', 100, 'social'),
            new Todo('play games', 50, 'hobby')
        ]
    }

    push(value) {
        this.#todoList.push(value);
    }

    getTotal() {
        const sum = (total, e) => e + total;
        return this.#todoList.map(e => e.price_).reduce(sum);
    }

    getTargetId(id) {
        console.log(this.#todoList, id)
        return this.#todoList.find(e => e.getId === Number(id));
    }

    getTodoList() {
        return this.#todoList;
    }

    setTodoList(value) {
        this.#todoList = value;
    }

}

class MyNavigation {
    constructor() {
        this.current = {};
        this.success = this.success.bind(this);
        this.key = '1a26dfe137f842cd802a968c037973eb';
        navigator.geolocation.getCurrentPosition(this.success, this.error);
        setTimeout(() => {
            console.log(this.current);
        }, 5000);
    }

    async success(pos) { // success = (pos) => {}
        console.log(this);
        const crd = pos.coords;
        console.log(crd);
        // console.log('Your current position is:');
        // console.log('Latitude : ' + crd.latitude);
        // console.log('Longitude: ' + crd.longitude);
        // console.log('More or less ' + crd.accuracy + ' meters.');
        const res = await fetch(this.getApiUrl(crd.latitude, crd.longitude)).then(res => res.json());
        // console.log(res.main.temp - 273.15, res.weather, res.name);
        // console.log(this.getIcon(res.weather[0].icon));
        this.current = {
            city: res.name,
            temp: (res.main.temp - 273.15).toFixed(2),
            icon: res.weather[0].icon
        };
    };

    error(err) {
        console.error(err);
        console.warn('ERROR(' + err.code + '): ' + err.message);
    };
    
    getApiUrl(lat, lng) {
        return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${this.key}`;
    }

    getIcon() {
        return `http://openweathermap.org/img/w/${this.current.icon}.png`;
    }

    toString() {
        return `Temp: ${this.current.temp}, ${this.current.city}`;
    }
}

class Watch {
    constructor() {
        this.date = new Date();
    }

    getCurrentTime() {
        return `${this.convertTimeWithZero(this.date.getHours())}:${this.convertTimeWithZero(this.date.getMinutes())}:${this.convertTimeWithZero(this.date.getSeconds())}`
    }

    convertTimeWithZero(value) {
        return value < 10 ? `0${value}` : `${value}`;
    }
}

function renderTodoList(parent, list) {
    parent.innerHTML = '';
    console.log("tesT:", list.getTodoList());
    for(const element of list.getTodoList()) {
        console.log(element.toString())
        parent.innerHTML += `<li class="todo-item" data-id=${element.getId}>
            <span class="left-info">
                <input class="todo-check" type="checkbox" />
                <span class="content">${element}</span>
            </span>
            <span class="right-info">
                <span class="price-info">
                    <span class="price">${element.getPriceFormat}</span>
                    <span class="arrows">
                        <i class="fas fa-chevron-up up"></i>
                        <i class="fas fa-chevron-down down"></i>
                    </span>
                </span>
                <button class="remove-btn"><i class="far fa-trash-alt remove"></i></button>
            </span>
        </li>`
    }
}

function renderWatch() {
    const watch = document.querySelector('#watch');
    setInterval(function() {
        const today = new Watch();
        watch.innerHTML = `${today.getCurrentTime()}`;
    }, 1000);
    
}

function main() {
    console.log('Hello Javascript');

    renderWatch();

    const todoForm = document.querySelector('#todo-form');
    const todoInput = document.querySelector('#todo-input');
    const todoList = document.querySelector('#todo-list');
    const navigation = document.querySelector('#navigation');
    const weather = document.querySelector('#weather');

    const state = {
        todo: '',
        todoList: new TodoList()
    }

    console.log(state.todoList)

    renderTodoList(todoList, state.todoList);
    setTimeout(() => {
        const myNavigation = new MyNavigation()
        navigation.innerHTML = myNavigation.toString();
        weather.innerHTML = `<img src="${myNavigation.getIcon()}" alt="weather" />`;
    }, 5000);

    // Event listener
    todoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("submit");
        state.todoList.push(new Todo(state.todo));
        renderTodoList(todoList, state.todoList);
        state.todo = '';
    });

    todoInput.addEventListener('change', function(event) {
        // Event function
        state.todo = event.target.value;
        event.target.value = '';
    });

    todoInput.addEventListener('input', function(event) {
        // Event function
        const inputTag = event.target;
        console.log(inputTag.value);
    });

    todoList.addEventListener('click', function(event) {
        console.log(event.target.nodeName);
        if(event.target.nodeName === 'INPUT') {
            if(event.target.checked) {
                const nextSibling = event.target.nextElementSibling;
                nextSibling.classList.add('done');
            } else {
                const nextSibling = event.target.nextElementSibling;
                nextSibling.classList.remove('done');
            }
        } else if(event.target.nodeName === 'BUTTON' || (event.target.nodeName === 'I' && event.target.classList.contains('remove'))) {
            let targetElement = event.target.parentElement;
            if(event.target.nodeName === 'I') {
                targetElement = event.target.parentElement.parentElement;
            }
            state.todoList.setTodoList(state.todoList.getTodoList.filter(e => e.id !== parseInt(targetElement.dataset.id)));
            renderTodoList(todoList, state.todoList);
        } else if(event.target.classList.contains('up')) {
            const getId = event.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
            const targetTodo = state.todoList.getTargetId(getId);
            
            targetTodo.setPrice = targetTodo.getPrice + 1;
          
            const targetElement = event.target.parentElement.previousElementSibling;
            targetElement.innerText = targetTodo.getPriceFormat;
            const totalElement = document.querySelector('.total');
            console.log(state.todoList, targetTodo.getPriceFormat); 
            totalElement.innerText = `$${state.todoList.getTotal()}`;
        } else if(event.target.classList.contains('down')) {
            const getId = event.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
            const targetTodo = state.todoList.getTargetId(getId);
            targetTodo.setPrice = targetTodo.getPrice - 1;
            const targetElement = event.target.parentElement.previousElementSibling;
            targetElement.innerText = targetTodo.getPriceFormat;
            const totalElement = document.querySelector('.total');
            totalElement.innerText = `$${state.todoList.getTotal()}`;
        }
    });
}

main();

