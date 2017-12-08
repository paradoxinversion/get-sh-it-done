const workspace = (()=>{
  // Code for creating and manipulating todo elements
  const todoContainer = document.getElementById("todo-container");
  const newTodoButton = document.getElementById("new-todo-btn");
  const newTodoInput = document.getElementById("new-todo-npt");
  const createTodoElement = function(task){
    const container = document.createElement('div');
    const completionCheckbox = document.createElement('input');
    const taskDescription = document.createElement("p");
    const deleteTaskButton = document.createElement("button");
    const taskEditInput = document.createElement("input");
    container.classList.add("todo");
    container.id = task._id;

    completionCheckbox.checked = task.complete;
    completionCheckbox.setAttribute("type", "checkbox");
    completionCheckbox.classList.add("todo-checkbox");

    taskDescription.classList.add("todo-text");
    taskDescription.innerText = task.description;

    taskEditInput.classList.add("hidden");
    deleteTaskButton.setAttribute("href", `http://localhost:3000/tasks/delete/${container.id}`);
    deleteTaskButton.innerText = "Delete";
    deleteTaskButton.classList.add("delete-task-btn")

    container.appendChild(completionCheckbox);
    container.appendChild(taskDescription);
    container.appendChild(taskEditInput);
    container.appendChild(deleteTaskButton);

    completionCheckbox.addEventListener("click", function(){
      // send the task id with the request
      fetch(`http://localhost:3000/tasks/complete/${container.id}`, {
        method: "get"
      })
        .then(response => {
          return response.json();
        });
    });

    deleteTaskButton.addEventListener("click", function(){
      fetch(`http://localhost:3000/tasks/delete/${container.id}`, {
        method: "get"
      })
        .then(response => {
          return response.json();
        })
        .then((taskjson) => {
          updateContainer(taskjson);
        })
        .catch(e => {
          throw e;
        });
    });
    taskDescription.addEventListener("click", function(){
      taskDescription.classList.add("hidden");
      taskEditInput.classList.remove("hidden");
      deleteTaskButton.classList.add("hidden");
      taskEditInput.focus();
    });
    taskEditInput.addEventListener("keydown", function(key){
      if (key.keyCode === 13 && taskEditInput.value != ""){
        taskDescription.classList.remove("hidden");
        taskEditInput.classList.add("hidden");
        deleteTaskButton.classList.remove("hidden");
        fetch(`http://localhost:3000/tasks/edit/${container.id}`, {
          method: "put",
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            description: taskEditInput.value
          })
        })
          .then(response => {
            return response.json();
          })
          .then((taskjson) => {
            updateContainer(taskjson);
          });
      } else if (key.keyCode === 27){
        taskDescription.classList.remove("hidden");
        taskEditInput.classList.add("hidden");
        deleteTaskButton.classList.remove("hidden");
      }
    });
    return container;
  };
  newTodoButton.addEventListener("click", function(){
    newTodoButton.classList.add("hidden");
    newTodoInput.classList.remove("hidden");
  });

  const clearContainer = function(){
    while (todoContainer.children.length > 1){
      todoContainer.removeChild(todoContainer.children[1]);
    }
  };

  const updateContainer = function(taskjson){
    clearContainer();
    taskjson.forEach(element => {
      todoContainer.appendChild(createTodoElement(element));
    });
  };

  newTodoInput.addEventListener("keydown", function(key){
    if (key.keyCode === 13 && newTodoInput.value != ""){
      newTodoButton.classList.remove("hidden");
      newTodoInput.classList.add("hidden");
      fetch("http://localhost:3000/tasks/add", {
        method: "POST",
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          description: newTodoInput.value
        })
      })
        .then(response => {
          return response.json();
        })
        .then((taskjson) => {
          updateContainer(taskjson);
        });
    }
  });

  fetch("http://localhost:3000/tasks", {
    method: "GET",
  })
    .then(response => {
      return response.json();
    })
    .then((taskjson) => {
      updateContainer(taskjson);
    });

})();
