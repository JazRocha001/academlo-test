"use strict";
// DOM
const btnLogin = document.querySelector(".btn__login");
const btnSignup = document.querySelector(".btn__signup");
const btnAccept = document.getElementById("btn-accept");
const btnSee = document.querySelector(".see");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const loginEmail = document.getElementById("login__email");
const loginPassword = document.getElementById("login__password");

const signupName = document.getElementById("signup__name");
const signupLastName = document.getElementById("signup__lastName");
const signupEmail = document.getElementById("signup__email");
const signupPass = document.getElementById("signup__password");
const signupPassConf = document.getElementById("signup__password--confirm");

const loginAndSignup = document.getElementById("login-signup");

const homeTasks = document.getElementById("home-task");
const tasksContainer = document.querySelector(".task__container");

// Dom add-task-modal
const btnAddTask = document.querySelector(".btn__add-task");
const taskModal = document.getElementById("task-modal");
const modalFond = document.querySelector(".modal-fond");
const btnCloseModal = document.getElementById("close__modal");
const btnCancelModal = document.getElementById("btn__modal-cancel");
const overlay = document.querySelector(".overlay");
const btnGuardarTask = document.getElementById("guardar__new-task");
const nameNewTask = document.getElementById("name__new-task");
const descriptionNewTask = document.getElementById("description__new-task");

// DOM task edit
const editModal = document.getElementById("edit-task-modal");
const btnCloseEditModal = document.getElementById("close__edit-modal");
const editTaskName = document.getElementById("name__edit-task");
const editTaskDescription = document.getElementById("description__edit-task");
const btnCancelEditModal = document.getElementById("btn__edit-modal-cancel");
const btnSaveEditTask = document.getElementById("save__edit-task");
const btnEdit = document.getElementById("edit__icon");

// Check which type of form is active
let form = "login";
let tasks = [];

let addTask = false;
let editTask = false;

const onLogin = async function () {
  try {
    const email = loginEmail.value;
    const password = loginPassword.value;

    const urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password);

    const response = await axios.post(
      `https://tasks-crud.academlo.com/api/auth/login`,
      {
        email,
        password,
      }
    );

    const token = response.data.split("|")[1];
    localStorage.setItem("token", token);

    loginAndSignup.classList.add("hidden");
    homeTasks.classList.remove("hidden");
    loginEmail.value = "";
    loginPassword.value = "";

    onLoadTasks();
  } catch (error) {
    console.log(error);
  }
};

const onLoadTasks = async function () {
  const token = localStorage.getItem("token");

  const res = await axios.get("https://tasks-crud.academlo.com/api/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  tasks = res.data;
  addTasks();
};

const openEditModal = function (id) {
  if (!editTask) {
    editModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    editTask = true;

    const task = tasks.find((task) => task.id === +id);

    btnSaveEditTask.dataset.id = task.id;
    editTaskName.value = task.name;
    editTaskDescription.value = task.description;
  }
};

const onEditTask = async function () {
  try {
    const updatedName = editTaskName.value;
    const updatedDescription = editTaskDescription.value;
    const taskId = btnSaveEditTask.dataset.id;
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `https://tasks-crud.academlo.com/api/tasks/${taskId}`,
      {
        name: updatedName,
        description: updatedDescription,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    closeEditModal();
    onLoadTasks();
  } catch (error) {
    console.log(error);
  }
};

const onEditStatus = async function (taskId, statusId) {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `https://tasks-crud.academlo.com/api/tasks/${taskId}/status/${statusId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

const onUpdateStatus = function (e, id) {
  const status = +e.value;

  const taskCard = document.querySelector(`[data-task-${id}]`);
  const statusId = +taskCard.dataset[`task-${id}`];

  let currentStatus = "";
  let newStatus = "";

  if (statusId === 1) currentStatus = "task-finally";
  else if (statusId === 2) currentStatus = "task-initial";
  else if (statusId === 3) currentStatus = "task-process";

  if (status === 1) newStatus = "task-finally";
  else if (status === 2) newStatus = "task-initial";
  else if (status === 3) newStatus = "task-process";

  taskCard.classList.remove(currentStatus);
  taskCard.classList.add(newStatus);

  taskCard.dataset[`task-${id}`] = status;
  onEditStatus(id, status);
};

const addTasks = function (e) {
  tasksContainer.replaceChildren();

  tasks.forEach(function (task, i) {
    let status = "task-finally";
    if (task.status_id === 1) {
      status = "task-finally";
    } else if (task.status_id === 2) {
      status = "task-initial";
    } else if (task.status_id === 3) {
      status = "task-process";
    }

    const html = `<div data-task-${task.id}="${
      task.status_id
    }" class="task-card ${status} space-top">
      <div class="card-header line-bottom">
        <h3>${task.name}</h3>
        <img onclick="openEditModal(${
          task.id
        })" src="img/edit-21.svg" alt="edit-icon" />
      </div>
      <div class="card-body line-bottom">
        <p class="word-grey">Descripcion</p>
        <p class="task__body-text">
          ${task.description}
        </p>
      </div>
      <div class="card-footer">
        <select oninput="onUpdateStatus(this, ${
          task.id
        })" class="state-btn" value="${
      task.status_id
    }" name="state-task" id="state-task">
          <option ${
            task.status_id === 1 ? "selected" : ""
          } value="1">Terminada</option>
          <option ${
            task.status_id === 2 ? "selected" : ""
          }  value="2">Iniciada</option>
          <option ${
            task.status_id === 3 ? "selected" : ""
          }  value="3">En pausa</option>
        </select>
      </div>
    </div>`;

    tasksContainer.insertAdjacentHTML("beforeend", html);
  });
};

const closeModal = function () {
  if (addTask) {
    taskModal.classList.add("hidden");
    overlay.classList.add("hidden");
    (nameNewTask.value = ""), (descriptionNewTask.value = "");
    addTask = false;
  }
};

const closeEditModal = function () {
  if (editModal) {
    editModal.classList.add("hidden");
    overlay.classList.add("hidden");
    (editTaskName.value = ""), (editTaskDescription.value = "");
    editTask = false;
  }
};

let nameTask = "";
let descriptionTask = "";
const addNewTask = async function () {
  try {
    if (!addTask) return;

    nameTask = nameNewTask.value;
    descriptionTask = descriptionNewTask.value;

    if (nameTask && descriptionTask) {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://tasks-crud.academlo.com/api/tasks",
        {
          name: nameTask,
          description: descriptionTask,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onLoadTasks();
    } else {
      alert("Debes llenas ambos campos");
    }

    closeModal();
  } catch (error) {
    console.log(error);
  }
};

btnSignup.addEventListener("click", function () {
  form = "signup";
  loginForm.classList.add("hidden");
  btnLogin.classList.remove("active");

  signupForm.classList.remove("hidden");
  btnSignup.classList.add("active");
});

btnLogin.addEventListener("click", function () {
  form = "login";
  signupForm.classList.add("hidden");
  btnSignup.classList.remove("active");

  loginForm.classList.remove("hidden");
  btnLogin.classList.add("active");
});

btnSee.addEventListener("click", function () {
  if (loginPassword.type === "password") {
    loginPassword.type = "text";
  } else {
    loginPassword.type = "password";
  }
});

btnAccept.addEventListener("click", function (e) {
  if (form === "login") {
    onLogin();
  }
});

btnAddTask.addEventListener("click", function (e) {
  if (addTask === false) {
    taskModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    addTask = true;
  }
});

btnGuardarTask.addEventListener("click", addNewTask);
btnCloseModal.addEventListener("click", closeModal);
btnCancelModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

btnSaveEditTask.addEventListener("click", onEditTask);
btnCloseEditModal.addEventListener("click", closeEditModal);
btnCancelEditModal.addEventListener("click", closeEditModal);
overlay.addEventListener("click", closeEditModal);

// const onEditTask = function (id) {
//   console.log(id);
// };
