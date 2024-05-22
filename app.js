let container = document.querySelector(".container");
let boxs = document.querySelector(".boxes");
let sendBtn = document.querySelector(".sendBtn");
let input = document.querySelector(".input");
let inputUser = document.querySelector(".inputUser");
let replyUser = document.querySelector(".replyUser");
let replyText = document.querySelector(".replyText");
let numofvote = 0;
let use;
let com;
let arr = JSON.parse(localStorage.getItem("comments") || []);
let index = parseInt(localStorage.getItem("index") || "0", 10);

function getRequest() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        users = JSON.parse(this.responseText);
        addData(users.comments);
        getComments();
      } else {
        console.error("Error loading data:", this.statusText);
      }
    }
  };
  myRequest.open("GET", "data.json", true);
  myRequest.send();
}

sendBtn.addEventListener("click", (e) => {
  if (input.value.length < 1) {
    return;
  } else {
    addComment(index);
    index++;
    updateTimestamps();
    setInterval(updateTimestamps, 1000);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    const commentIndex = arr.findIndex((comment) => {
      return comment === e.target.parentElement.closest(".comments").outerHTML;
    });

    arr.splice(commentIndex, 1);
    saveToLocalStorage();
    if (!e.target.parentElement.closest(".replyComments")) {
      e.target.parentElement.closest(".comments").remove();
    } else {
      e.target.parentElement.closest(".replyComments").remove();
    }

    index--;
  }
});

document.querySelector(".boxes").addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("editBtn")) {
    let info = e.target.parentElement.closest(".info");
    let input = document.createElement("textarea");
    let updateBtn = document.createElement("button");
    updateBtn.className = "updateBtn";
    updateBtn.textContent = "Update";
    updateBtn.style.display = "block";
    let editscont = info.querySelector(".edits");
    editscont.appendChild(updateBtn);
    let text = info.querySelector(".text");
    let deletbt = info.querySelector(".deleteBtn");
    let editbt = info.querySelector(".editBtn");
    input.className = "input";
    input.value = text.textContent;
    deletbt.style.display = "none";
    input.setAttribute("rows", "3");
    e.target.style.display = "none";
    text.style.display = "none";
    info.appendChild(input);
    input.focus();
  }
  if (e.target && e.target.classList.contains("updateBtn")) {
    let info = e.target.parentElement.closest(".info");
    let commentElement = info.closest(".comments");
    let commentIndex = parseInt(commentElement.dataset.index, 10);
    let input = info.querySelector(".input");
    let text = info.querySelector(".text");
    let editbt = info.querySelector(".editBtn");
    let deletbt = info.querySelector(".deleteBtn");
    text.style.display = "block";
    text.textContent = input.value;
    input.remove();
    e.target.remove();
    editbt.style.display = "block";
    deletbt.style.display = "block";

    let cont = info.closest(".comments").innerHTML;
    arr[commentIndex] = cont;
    saveToLocalStorage();
    console.log(commentIndex);
    console.log(commentElement);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("replyBtn")) {
    inputUser.style.display = "none";
    e.preventDefault();
    let comments = e.target.parentElement.closest(".comments");
    com = comments;
    let boxElement = e.target.closest(".box");

    replyText.value = "";
    replyUser.style.display = "flex";
    comments.appendChild(replyUser);
    if (boxElement) {
      let userNameElement = boxElement.querySelector(".profile .userName");

      if (userNameElement) {
        var userName = userNameElement.textContent;
        use = userName;
        replyText.setAttribute("placeholder", `Reply To ${userName}...`);
        replyText.focus();
      }
    }
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("replyTo")) {
    replyUser.remove();
    inputUser.style.display = "flex";
    let comments = e.target.parentElement.closest(".comments");
    let replyCont = document.createElement("div");
    replyCont.className = "replyComments";

    replyCont.innerHTML = `
          <div class="box">
          <div class="vote">
            <button class="addVote"><svg width="15" height="15" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg" class=""><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"></path></svg></button>
            <span class="numofvotes">${0}</span>
            <button class="removeVote"><svg width="15" height="5" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"></path></svg></button>
          </div>
          <div class="info">
            <div class="head">
              <div class="profile">
                <img class="userImg" src="images/avatars/image-juliusomo.png" alt="">
                <span class="userName">Andres Alcantara</span>
                <span class="timepost" data-timestamp="${Date.now()}"></span>
              </div>
              <div class="edits">
                  <button class="editBtn">Edit</button>
                  <button class="deleteBtn">Delete</button>
              </div>
            </div>
            <p class="text"><span class="usernameTo">@${use}</span> ${
      replyText.value
    }</p>
          </div>
        </div>
      `;
    com.appendChild(replyCont);

    updateTimestamps();
    setInterval(updateTimestamps, 1000);
  }
});

function addData(data) {
  data.forEach((ele) => {
    let cont = document.createElement("div");
    cont.className = "comments";
    cont.innerHTML = `
    <div class="cont">
      <div class="box">
        <div class="vote">
          <button class="addVote" data-score="${ele.score}"><svg width="15" height="15" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg" class=""><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"></path></svg></button>
          <span class="numofvotes">${ele.score}</span>
          <button class="removeVote"><svg width="15" height="5" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"></path></svg></button>
        </div>
        <div class="info">
          <div class="head">
            <div class="profile">
              <img class="userImg" src="${ele.user.image.png}" alt="">
              <span class="userName">${ele.user.username}</span>
              <span class="timepost">${ele.createdAt}</span>
            </div>
            <div class="reply">
              <svg width="14" height="13" fill="rgb(37 99 235)" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"/></svg>
              <a class="replyBtn" href="#inputUser">Reply</a>
            </div>
          </div>
          <p class="text">${ele.content}</p>
        </div>
      </div>
    `;
    boxs.appendChild(cont);

    if (ele.replies && ele.replies.length > 0) {
      ele.replies.forEach((reply) => {
        let replyCont = document.createElement("div");
        replyCont.className = "replyComments";
        replyCont.innerHTML = `
          <div class="box">
            <div class="vote">
              <button class="addVote"><svg width="15" height="15" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg" class=""><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"></path></svg></button>
              <span class="numofvotes">${reply.score}</span>
              <button class="removeVote"><svg width="15" height="5" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"></path></svg></button>
            </div>
            <div class="info">
              <div class="head">
                <div class="profile">
                  <img class="userImg" src="${reply.user.image.png}" alt="">
                  <span class="userName">${reply.user.username}</span>
                  <span class="timepost">${reply.createdAt}</span>
                </div>
                <div class="reply">
                  <svg width="14" height="13" fill="rgb(37 99 235)" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"/></svg>
                  <a class="replyBtn" href="#inputUser">Reply</a>
                </div>
              </div>
              <p class="text"><span class="usernameTo">${
                "@" + reply.replyingTo
              }</span> ${reply.content}</p>
            </div>
          </div>
        `;
        cont.appendChild(replyCont);
      });
    }
  });

  let addVote = document.querySelectorAll(".addVote");
  addVote.forEach((ele) => {
    ele.addEventListener("click", (e) => {
      let vote = ele.parentElement;
      let score = parseInt(vote.querySelector(".numofvotes").textContent) + 1;
      vote.querySelector(".numofvotes").textContent = score;
      e.currentTarget.style.pointerEvents = "none";
      vote.querySelector(".removeVote").style.pointerEvents = "auto";
    });
  });

  let subsVote = document.querySelectorAll(".removeVote");
  subsVote.forEach((ele) => {
    ele.addEventListener("click", (e) => {
      let vote = ele.parentElement;
      let score = parseInt(vote.querySelector(".numofvotes").textContent) - 1;
      vote.querySelector(".numofvotes").textContent = score;
      e.currentTarget.style.pointerEvents = "none";
      vote.querySelector(".addVote").style.pointerEvents = "auto";
    });
  });
}

function addComment(index) {
  let cont = document.createElement("div");
  cont.className = "comments";
  cont.dataset.index = index;
  cont.innerHTML = `
    <div class="cont">
      <div class="box">
        <div class="vote">
          <button class="addVote"><svg width="15" height="15" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg" class=""><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"></path></svg></button>
          <span class="numofvotes">${numofvote}</span>
          <button class="removeVote"><svg width="15" height="5" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"></path></svg></button>
        </div>
        <div class="info">
          <div class="head">
            <div class="profile">
              <img class="userImg" src="images/avatars/image-juliusomo.png" alt="">
              <span class="userName">Andres Alcantara</span>
              <span class="you">You</span>
              <span class="timepost" data-timestamp="${Date.now()}"></span>
            </div>
            <div class="edits">
            <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</button>
            </div>
          </div>
          <p class="text">${input.value}</p>
        </div>
      </div>
    `;
  arr.push(cont.outerHTML);
  boxs.appendChild(cont);
  saveToLocalStorage();
  input.value = "";
}

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

function updateTimestamps() {
  const timeposts = document.querySelectorAll(".timepost");
  timeposts.forEach((timepost) => {
    const timestamp = timepost.getAttribute("data-timestamp");
    if (timestamp) {
      timepost.textContent = timeSince(new Date(parseInt(timestamp))) + " ago";
    }
  });
}

function displayComments(arr) {
  arr.forEach((ele, index) => {
    let cont = document.createElement("div");
    cont.className = "comments";
    cont.dataset.index = index;
    cont.innerHTML = ele;
    document.querySelector(".boxes").appendChild(cont);
    updateTimestamps();
    setInterval(updateTimestamps, 1000);
  });
}

function saveToLocalStorage() {
  localStorage.setItem("comments", JSON.stringify(arr));
  localStorage.setItem("index", index);
}

function getComments() {
  const comments = JSON.parse(localStorage.getItem("comments"));

  if (comments) {
    arr = comments;
    displayComments(arr);
  }
}

getRequest();
