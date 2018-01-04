
const modal = (()=>{
  const modalContainer = document.getElementById("modal-container");

  // modalContainer.addEventListener("click", function(){
  //   this.classList.add("hidden");
  // });
  const showModal = function(){
    modalContainer.classList.remove("hidden");
  };

  const hideModal = function(){
    modalContainer.classList.add("hidden");
  };

  const toggleModal = function(){
    if (modalContainer.classList.contains("hidden")){
      showModal();
    } else{
      hideModal();
    }
  };

  return {
    showModal,
    hideModal
  };
})();

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

    if (task.complete){
      container.classList.add("task-complete");
    }

    taskDescription.classList.add("todo-text");
    taskDescription.innerText = task.description;

    taskEditInput.classList.add("hidden");
    deleteTaskButton.setAttribute("href", `http://localhost:3000/tasks/delete/${container.id}`);
    deleteTaskButton.innerText = "Delete";
    deleteTaskButton.classList.add("delete-task-btn");

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
        })
        .then(item => {
          if (item.complete){
            container.classList.add("task-complete");

          }else{
            container.classList.remove("task-complete");

          }
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
  return {
    updateContainer
  };
})();

const auth = (()=>{
  const signInButton = document.getElementById("sign-in-button");
  const signUpButton = document.getElementById("sign-up-button");

  const signUpForm = document.getElementById("sign-up-form");
  const signUpConfirmButton = document.getElementById("sign-up-confirm-button");
  const signInForm = document.getElementById("sign-in-form");
  const signInConfirmButton = document.getElementById("sign-in-confirm-button");

  const signUpUsername = document.getElementById("sign-up-username");
  const signUpPassword = document.getElementById("sign-up-password");

  const signInUsername = document.getElementById("sign-in-username");
  const signInPassword = document.getElementById("sign-in-password");


  signUpButton.addEventListener("click", function(){
    modal.showModal();
    if (!signInForm.classList.contains("hidden")){
      signInForm.classList.add("hidden");
    }
    signUpForm.classList.remove("hidden");
  });

  signUpConfirmButton.addEventListener("click", function(event){
    event.preventDefault();
    const payload = {
      username: signUpUsername.value,
      password: signUpPassword.value
    };
    fetch(`http://localhost:3000/sign-up`, {
      method: "post",
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(
        payload
      )
    })
      .then(() => {

        modal.hideModal();
      });
  });

  signInButton.addEventListener("click", function(){
    modal.showModal();
    if (!signUpForm.classList.contains("hidden")){
      signUpForm.classList.add("hidden");
    }
    signInForm.classList.remove("hidden");
  });

  signInConfirmButton.addEventListener("click", function(event){
    event.preventDefault();
    const payload = {
      username: signInUsername.value,
      password: signInPassword.value
    };
    fetch(`http://localhost:3000/sign-in`, {
      method: "post",
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(
        payload
      )
    })
      .then(response => {
        return response.json();
      })
      .then((user) => {
        fetch(`http://localhost:3000/${user.userId}/tasks`, {
          method: "get"
        })
          .then(response => {
            return response.json();
          })
          .then((tasks) => {
            workspace.updateContainer(tasks);
          });
        modal.hideModal();
      });
  });
})();
