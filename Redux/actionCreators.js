import { addTodo, removeTodo, doTodo } from "./action.js";

function addTodoAction (title) {
    return {
        type: addTodo,
        title
    }
}

function removeTodoAction(id){
    return {
        type: removeTodo,
        id
    }
}

function doTodoAction(id){
    return {
        type: doTodo,
        id
    }
}

export {
    addTodoAction,
    removeTodoAction,
    doTodoAction
}