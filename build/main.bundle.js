"use strict";

var modal = function () {
  var modalContainer = document.getElementById("modal-container");

  // modalContainer.addEventListener("click", function(){
  //   this.classList.add("hidden");
  // });
  var showModal = function showModal() {
    modalContainer.classList.remove("hidden");
  };

  var hideModal = function hideModal() {
    modalContainer.classList.add("hidden");
  };

  var toggleModal = function toggleModal() {
    if (modalContainer.classList.contains("hidden")) {
      showModal();
    } else {
      hideModal();
    }
  };

  return {
    showModal: showModal,
    hideModal: hideModal
  };
}();

var workspace = function () {
  // Code for creating and manipulating todo elements
  var todoContainer = document.getElementById("todo-container");
  var newTodoButton = document.getElementById("new-todo-btn");
  var newTodoInput = document.getElementById("new-todo-npt");
  var createTodoElement = function createTodoElement(task) {
    var container = document.createElement('div');
    var completionCheckbox = document.createElement('input');
    var taskDescription = document.createElement("p");
    var deleteTaskButton = document.createElement("button");
    var taskEditInput = document.createElement("input");
    container.classList.add("todo");
    container.id = task._id;

    completionCheckbox.checked = task.complete;
    completionCheckbox.setAttribute("type", "checkbox");
    completionCheckbox.classList.add("todo-checkbox");

    if (task.complete) {
      container.classList.add("task-complete");
    }

    taskDescription.classList.add("todo-text");
    taskDescription.innerText = task.description;

    taskEditInput.classList.add("hidden");
    deleteTaskButton.setAttribute("href", "http://localhost:3000/tasks/delete/" + container.id);
    deleteTaskButton.innerText = "Delete";
    deleteTaskButton.classList.add("delete-task-btn");

    container.appendChild(completionCheckbox);
    container.appendChild(taskDescription);
    container.appendChild(taskEditInput);
    container.appendChild(deleteTaskButton);

    completionCheckbox.addEventListener("click", function () {
      // send the task id with the request
      fetch("http://localhost:3000/tasks/complete/" + container.id, {
        method: "get"
      }).then(function (response) {
        return response.json();
      }).then(function (item) {
        if (item.complete) {
          container.classList.add("task-complete");
        } else {
          container.classList.remove("task-complete");
        }
      });
    });

    deleteTaskButton.addEventListener("click", function () {
      fetch("http://localhost:3000/tasks/delete/" + container.id, {
        method: "get"
      }).then(function (response) {
        return response.json();
      }).then(function (taskjson) {
        updateContainer(taskjson);
      }).catch(function (e) {
        throw e;
      });
    });
    taskDescription.addEventListener("click", function () {
      taskDescription.classList.add("hidden");
      taskEditInput.classList.remove("hidden");
      deleteTaskButton.classList.add("hidden");
      taskEditInput.focus();
    });
    taskEditInput.addEventListener("keydown", function (key) {
      if (key.keyCode === 13 && taskEditInput.value != "") {
        taskDescription.classList.remove("hidden");
        taskEditInput.classList.add("hidden");
        deleteTaskButton.classList.remove("hidden");
        fetch("http://localhost:3000/tasks/edit/" + container.id, {
          method: "put",
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            description: taskEditInput.value
          })
        }).then(function (response) {
          return response.json();
        }).then(function (taskjson) {
          updateContainer(taskjson);
        });
      } else if (key.keyCode === 27) {
        taskDescription.classList.remove("hidden");
        taskEditInput.classList.add("hidden");
        deleteTaskButton.classList.remove("hidden");
      }
    });
    return container;
  };
  newTodoButton.addEventListener("click", function () {
    newTodoButton.classList.add("hidden");
    newTodoInput.classList.remove("hidden");
  });

  var clearContainer = function clearContainer() {
    while (todoContainer.children.length > 1) {
      todoContainer.removeChild(todoContainer.children[1]);
    }
  };

  var updateContainer = function updateContainer(taskjson) {
    clearContainer();
    taskjson.forEach(function (element) {
      todoContainer.appendChild(createTodoElement(element));
    });
  };

  newTodoInput.addEventListener("keydown", function (key) {
    if (key.keyCode === 13 && newTodoInput.value != "") {
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
      }).then(function (response) {
        return response.json();
      }).then(function (taskjson) {
        updateContainer(taskjson);
      });
    }
  });

  fetch("http://localhost:3000/tasks", {
    method: "GET"
  }).then(function (response) {
    return response.json();
  }).then(function (taskjson) {
    updateContainer(taskjson);
  });
  return {
    updateContainer: updateContainer
  };
}();

var auth = function () {
  var signInButton = document.getElementById("sign-in-button");
  var signUpButton = document.getElementById("sign-up-button");

  var signUpForm = document.getElementById("sign-up-form");
  var signUpConfirmButton = document.getElementById("sign-up-confirm-button");
  var signInForm = document.getElementById("sign-in-form");
  var signInConfirmButton = document.getElementById("sign-in-confirm-button");

  var signUpUsername = document.getElementById("sign-up-username");
  var signUpPassword = document.getElementById("sign-up-password");

  var signInUsername = document.getElementById("sign-in-username");
  var signInPassword = document.getElementById("sign-in-password");

  signUpButton.addEventListener("click", function () {
    modal.showModal();
    if (!signInForm.classList.contains("hidden")) {
      signInForm.classList.add("hidden");
    }
    signUpForm.classList.remove("hidden");
  });

  signUpConfirmButton.addEventListener("click", function (event) {
    event.preventDefault();
    var payload = {
      username: signUpUsername.value,
      password: signUpPassword.value
    };
    fetch("http://localhost:3000/sign-up", {
      method: "post",
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(payload)
    }).then(function () {

      modal.hideModal();
    });
  });

  signInButton.addEventListener("click", function () {
    modal.showModal();
    if (!signUpForm.classList.contains("hidden")) {
      signUpForm.classList.add("hidden");
    }
    signInForm.classList.remove("hidden");
  });

  signInConfirmButton.addEventListener("click", function (event) {
    event.preventDefault();
    var payload = {
      username: signInUsername.value,
      password: signInPassword.value
    };
    fetch("http://localhost:3000/sign-in", {
      method: "post",
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(payload)
    }).then(function (response) {
      return response.json();
    }).then(function (user) {
      fetch("http://localhost:3000/" + user.userId + "/tasks", {
        method: "get"
      }).then(function (response) {
        return response.json();
      }).then(function (tasks) {
        workspace.updateContainer(tasks);
      });
      modal.hideModal();
    });
  });
}();
