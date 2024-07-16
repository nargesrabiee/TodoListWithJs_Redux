import { addTodoAction, removeTodoAction, doTodoAction } from "./Redux/actionCreators.js";
import { addTodo, removeTodo, doTodo } from "./Redux/action.js";

window.completeTodoHandler = completeTodoHandler

// DOM Elem
const addInput = document.querySelector('.add-input')
const searchInput = document.querySelector('.search-input')
const todosContainerElem = document.querySelector('.todos-container')
const addBtn = document.querySelector('.add-btn')
const searchBtn = document.querySelector('.search-btn')
const deleteBtn = document.querySelector('.delete-btn')
const completeBtn = document.querySelector('.incomplete-btn')

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
            return state
        }
        case doTodo: {
            const newState = [...state]
            newState.some(todo => {
                if(todo.id === action.id){
                    todo.isComplete = !todo.isComplete
                }
            })
            return state
        }
        default: {
            return state
        }
    }
}

// Declare Store
const store = Redux.createStore(todoReducer)

// Declare Events
addBtn.addEventListener('click', event => {
    event.preventDefault()
    const newTodoTitle = addInput.value;
    store.dispatch(addTodoAction(newTodoTitle))
    const allTodos = store.getState()
    addInput.value = ''
    generateTodoLi(allTodos)
})

addInput.addEventListener('keypress', event => {
    if (event.keyCode === 13) {
        const newTodoTitle = event.target.value;
        store.dispatch(addTodoAction(newTodoTitle))
        const allTodos = store.getState()
        event.target.value = ''
        generateTodoLi(allTodos)
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
}
