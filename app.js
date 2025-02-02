import { addTodoAction, removeTodoAction, doTodoAction } from "./Redux/actionCreators.js";
import { addTodo, removeTodo, doTodo } from "./Redux/action.js";

window.completeTodoHandler = completeTodoHandler;
window.removeTodoHandler = removeTodoHandler;

// DOM Elem
const addInput = document.querySelector('.add-input')
const searchInput = document.querySelector('.search-input')
const addBtn = document.querySelector('.add-btn')
const searchBtn = document.querySelector('.search-btn')
const todosContainerElem = document.querySelector('.todos-container')
const statusContainerElem = document.querySelector('.status-container')

// Declare Reducer
function todoReducer(state = [], action) {
    switch (action.type) {
        case addTodo: {
            const newState = [...state]
            const newTodo = {
                id: crypto.randomUUID(),
                title: action.title,
                isComplete: false
            }
            newState.push(newTodo)
            return newState
        }
        case removeTodo: {
            const copyState = [...state]
            const newState = copyState.filter(todo => {
                return todo.id !== action.id
            })
            return newState
        }
        case doTodo: {
            const newState = [...state]
            newState.some(todo => {
                if (todo.id === action.id) {
                    todo.isComplete = !todo.isComplete
                }
            })
            return newState
        }
        default: {
            return state
        }
    }
}

// Declare Store
const store = Redux.createStore(todoReducer)

// Declare Events
window.addEventListener('load', () => {
    statusHandler()
})

addBtn.addEventListener('click', event => {
    event.preventDefault()
    const newTodoTitle = addInput.value;
    store.dispatch(addTodoAction(newTodoTitle))
    const allTodos = store.getState()
    addInput.value = ''
    generateTodoLi(allTodos)
    statusHandler()
})

addInput.addEventListener('keypress', event => {
    if (event.keyCode === 13) {
        const newTodoTitle = event.target.value;
        store.dispatch(addTodoAction(newTodoTitle))
        const allTodos = store.getState()
        event.target.value = ''
        generateTodoLi(allTodos)
        statusHandler()
    }
})

searchBtn.addEventListener('click', event => {
    const searchInputValue = searchInput.value.toLowerCase()
    const allTodos = store.getState()

    const filteredTodos = []
    allTodos.forEach(todo => {
        const todoTitle = todo.title.toLowerCase()
        if (todoTitle.includes(searchInputValue)) {
            filteredTodos.push(todo)
        }
    })
    searchInput.value = ''
    generateTodoLi(filteredTodos)
})

searchInput.addEventListener('keypress', event => {
    if (event.keyCode === 13) {
        const searchInputValue = searchInput.value.toLowerCase()
        const allTodos = store.getState()

        const filteredTodos = []
        allTodos.forEach(todo => {
            const todoTitle = todo.title.toLowerCase()
            if (todoTitle.includes(searchInputValue)) {
                filteredTodos.push(todo)
            }
        })
        searchInput.value = ''
        generateTodoLi(filteredTodos)
    }
})

// Functions
function generateTodoLi(todos) {
    todosContainerElem.innerHTML = ''
    todos.forEach(todo => {
        todosContainerElem.insertAdjacentHTML('beforeend', `
                <li class="todo-container ${todo.isComplete && 'todo-done'}">
                    <p class="todo-title">${todo.title}</p>
                    <div class="todo-btns">
                        <img 
                            class="icon-btn delete-btn" 
                            src="./icons/delete.png" 
                            alt="delete btn"
                            onclick=removeTodoHandler("${todo.id}")
                        >
                        <img 
                            class="icon-btn incomplete-btn" 
                            src="${todo.isComplete ? './icons/complete.png' : './icons/incomplete.png'}" 
                            alt="incomplete btn"
                            onclick=completeTodoHandler("${todo.id}")
                        >
                    </div>
                    <img class="done-img ${todo.isComplete && 'active'}" src="./icons/done.png" alt="done todo">
                </li>`
        )
    })
}

function completeTodoHandler(todoID) {
    store.dispatch(doTodoAction(todoID))
    const allTodos = store.getState()
    generateTodoLi(allTodos)
    statusHandler()
}

function removeTodoHandler(todoID) {
    store.dispatch(removeTodoAction(todoID))
    const allTodos = store.getState()
    generateTodoLi(allTodos)
    statusHandler()
}

function statusHandler() {
    statusContainerElem.innerHTML = ''

    const allTodos = store.getState()
    const todosCount = allTodos.length
    const todosDone = []
    allTodos.forEach(todo => {
        if (todo.isComplete) {
            todosDone.push(todo)
        }
    })

    const todosDoneCount = todosDone.length
    statusContainerElem.insertAdjacentHTML('beforeend', `
        <div class="status">
            <img src="${todosCount ? './icons/success.png' : './icons/notodo.png'}" alt="status image">
            <p class="text ${!todosCount && 'hidden'}">
                ${todosDoneCount} <span>/</span> ${todosCount} is Done <span>.</span>
            </p>
            <p class="text ${todosCount && 'hidden'}">
                You don't have todo <span>.</span>
            </p>
        </div>`
    )
}