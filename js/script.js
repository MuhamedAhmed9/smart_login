let usersArray = [];

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

function popUp(message) {
  const checkPopup = document.querySelector(".pop-up-container");
  const popupText = document.querySelector(".pop-up-text");
  if (!checkPopup) {
    const popUpContainer = document.createElement("div");
    popUpContainer.classList.add("pop-up-container");
    const popUpMessage = document.createElement("p");
    popUpMessage.classList.add("pop-up-message");
    let popUpText = document.createElement("p");
    popUpText.classList.add("pop-up-text");
    popUpMessage.appendChild(popUpText);
    const close = document.createElement("span");
    close.classList.add("close");
    close.innerHTML = "&times;";
    popUpText.innerHTML = message;
    popUpContainer.style.display = "block";
    popUpMessage.appendChild(close);
    close.addEventListener("click", function () {
      popUpContainer.style.display = "none";
    });
    popUpContainer.appendChild(popUpMessage);
    document.body.appendChild(popUpContainer);
  } else {
    popupText.innerHTML = message;
    checkPopup.style.display = "block";
  }
}

let signupForm = document.querySelector(".signup-form");
let loginForm = document.querySelector(".login-form");
let homePage = document.querySelector(".home");

if (localStorage.getItem("users")) {
  usersArray = JSON.parse(localStorage.getItem("users"));
}

if (signupForm) {
  // starting signup form
  let signupFname = document.querySelector(".signup-form #fname");
  let signupSname = document.querySelector(".signup-form #sname");
  let signupLname = document.querySelector(".signup-form #lname");
  let signupEmail = document.querySelector(".signup-form #email");
  let signupPassword = document.querySelector(".signup-form #password");
  let signupConfirmPassword = document.querySelector(".signup-form #cpassword");
  let signupBtn = document.querySelector(".signup-form #signupBtn");

  function resetInputs() {
    signupFname.value = "";
    signupSname.value = "";
    signupLname.value = "";
    signupEmail.value = "";
    signupPassword.value = "";
    signupConfirmPassword.value = "";
  }

  signupBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let user = {
      fname: signupFname.value,
      surname: signupSname.value,
      lname: signupLname.value,
      email: signupEmail.value,
      password: signupPassword.value,
      confirmPassword: signupConfirmPassword.value,
    };
    let name_regexp = /^[a-zA-Z0-9_]{4,}$/;
    let email_regexp = /^[a-zA-Z0-9_]+@[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+$/;
    let password_regexp = /[a-zA-Z0-9_]{8,}/;
    if (
      name_regexp.test(user.fname) &&
      name_regexp.test(user.surname) &&
      name_regexp.test(user.lname) &&
      email_regexp.test(user.email) &&
      password_regexp.test(user.password) &&
      user.confirmPassword == user.password
    ) {
      //checking if the user is already in local storage
      for (let i = 0; i < usersArray.length; i++) {
        if (usersArray[i].email === user.email) {
          popUp("User already exists");
          return;
        }
      }
      //adding user object to array and save the user to local storage
      if (user.password === user.confirmPassword) {
        usersArray.push(user);
        localStorage.setItem("users", JSON.stringify(usersArray));
        popUp("User created successfully");
        //clearing inputs
        resetInputs();
        //redirecting to login page
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      }
    } else {
      popUp(`<p>Invalid inputs please : make sure you have entered the correct details and that your passwords match
            information criteria must have the following:</p>
            <ul>
              <li><h5> at least 4 characters for the firsname , surname and lastname fields</h5></li>
              <li><h5> email must be like ( email@example.com )</h5></li>
              <li><h5> password must be at least 8 characters long mixed with numbers and letters</h5></li>
              <li><h5> password confirmation must match the password</h5></li>
            </ul>
            `);
    }
  });
}

if (loginForm) {
  //starting login form
  let loginEmail = document.querySelector(".login-form #email");
  let loginPassword = document.querySelector(".login-form #password");
  let loginBtn = document.querySelector(".login-form #loginBtn");

  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let user = {
      email: loginEmail.value,
      password: loginPassword.value,
    };
    for (let i = 0; i < usersArray.length; i++) {
      if (
        usersArray[i].email === user.email &&
        usersArray[i].password === user.password
      ) {
        popUp("User logged in successfully");
        setTimeout(function () {
          window.location.href = "home.html";
        }, 1000);
        let loginInfo = {
          user: usersArray[i],
          status: "online",
        };
        sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
        return;
      }
    }
    popUp("User not found");
  });
}

if (homePage) {
  if (sessionStorage.getItem("loginInfo")) {
    let welcome_msg = document.getElementById("welcome-msg");
    let current_user = JSON.parse(sessionStorage.getItem("loginInfo")).user;
    welcome_msg.innerHTML += ` <span>${capitalize(
      current_user.fname
    )} ${current_user.surname[0].toUpperCase()}. ${capitalize(
      current_user.lname
    )}</span>`;
    let logoutBtn = document.querySelector(".navbar #logoutBtn");
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.removeItem("loginInfo");
      window.location.href = "index.html";
    });
  } else {
    window.location.href = "index.html";
  }
}
