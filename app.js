let container = document.querySelector(".container");
let boxs = document.querySelector(".boxes");
let sendBtn = document.querySelector(".sendBtn");
let input = document.querySelector(".input");
let inputUser = document.querySelector(".inputUser");
let replyUser = document.querySelector(".replyUser");
let replyText = document.querySelector(".replyText");
let data = JSON.parse(localStorage.getItem("comments")) || [];
let replies = JSON.parse(localStorage.getItem("replies")) || [];
let userName = "";
function getRequest() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        users = JSON.parse(this.responseText);

        addData(users.comments);
        displayData(data);
        displayReply(replies);
        updateTimestamps();
        setInterval(updateTimestamps, 1000);
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
    let userData = {
      id: Math.floor(Math.random() * 10000),
      content: input.value,
      createdAt: Date.now(),
      score: 0,

      user: {
        image: {
          png: "./images/avatars/image-amyrobson.png",
        },
        username: "Mohammad Houda",
      },
      replies: [],
    };
    data.push(userData);
    saveToLocalStorage(data);
    addComment(userData);
  }
});

document.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("addVote")) {
    let vote = e.target.closest(".vote");
    let numofvotes = vote.children[1];

    let score = parseInt(numofvotes.textContent) + 1;
    numofvotes.textContent = score;
    e.target.style.pointerEvents = "none";
    let isReply = vote.closest(".replyComments") ? true : false;

    let commentElement = isReply
      ? vote.closest(".replyComments")
      : vote.closest(".comments");
    console.log(commentElement);
    let commentIndex = parseInt(commentElement.getAttribute("data-id"));

    let dataArray = isReply ? replies : data;

    let val = dataArray.findIndex(
      (value) => parseInt(value.id) === commentIndex
    );

    if (val !== -1) {
      console.log(val);
      console.log(dataArray[val]);
      dataArray[val].score = score;
      isReply ? saveRepliesToLocalStorage(replies) : saveToLocalStorage(data);
    } else {
      console.log("Not found");
    }
  }
});

document.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("removeVote")) {
    let vote = e.target.closest(".vote");
    let numofvotes = vote.children[1];

    let score = parseInt(numofvotes.textContent) - 1;
    numofvotes.textContent = score;
    e.target.style.pointerEvents = "none";
    let isReply = vote.closest(".replyComments") ? true : false;

    let commentElement = isReply
      ? vote.closest(".replyComments")
      : vote.closest(".comments");
    console.log(commentElement);
    let commentIndex = parseInt(commentElement.getAttribute("data-id"));

    let dataArray = isReply ? replies : data;

    let val = dataArray.findIndex(
      (value) => parseInt(value.id) === commentIndex
    );

    if (val !== -1) {
      console.log(val);
      console.log(dataArray[val]);
      dataArray[val].score = score;
      isReply ? saveRepliesToLocalStorage(replies) : saveToLocalStorage(data);
    } else {
      console.log("Not found");
    }
  }
});

document.querySelector(".boxes").addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("deleteBtn")) {
    let commentIndex = parseInt(
      e.target.parentElement.closest(".comments").getAttribute("data-id")
    );

    let commentElement = e.target.parentElement.closest(".comments");

    if (commentElement.classList.contains("comments")) {
      let val = data.findIndex((value) => parseInt(value.id) === commentIndex);

      if (val !== -1) {
        data.splice(val, 1);
        e.target.parentElement.closest(".comments").remove();
        saveToLocalStorage(data);
      } else {
        console.log("Not found");
      }
    }
  }
});

document.querySelector(".boxes").addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("deleteReplyBtn")) {
    let commentIndex = parseInt(
      e.target.parentElement.closest(".replyComments").getAttribute("data-id")
    );

    let commentElement = e.target.parentElement.closest(".replyComments");

    if (commentElement.classList.contains("replyComments")) {
      let val = replies.findIndex(
        (value) => parseInt(value.id) === commentIndex
      );

      if (val !== -1) {
        replies.splice(val, 1);
        e.target.parentElement.closest(".replyComments").remove();
        saveRepliesToLocalStorage(replies);
      } else {
        console.log("Not found");
      }
    }
  }
});

document.querySelector(".boxes").addEventListener("click", function (e) {
  if (
    e.target &&
    (e.target.classList.contains("editBtn") ||
      e.target.classList.contains("editReplyBtn"))
  ) {
    let info = e.target.closest(".info");
    let input = document.createElement("textarea");
    let updateBtn = document.createElement("button");
    updateBtn.className = "updateBtn";
    updateBtn.textContent = "Update";
    updateBtn.style.display = "block";
    let editscont = info.querySelector(".edits");
    editscont.appendChild(updateBtn);
    let text = info.querySelector(".text");
    let deleteBtn = info.querySelector(
      e.target.classList.contains("editBtn") ? ".deleteBtn" : ".deleteReplyBtn"
    );

    let editBtn = e.target;
    input.className = "input";
    input.value = text.textContent;
    deleteBtn.style.display = "none";
    input.setAttribute("rows", "3");
    editBtn.style.display = "none";
    text.style.display = "none";
    info.appendChild(input);
    input.focus();
  }

  if (e.target && e.target.classList.contains("updateBtn")) {
    let info = e.target.closest(".info");
    let isReply = info.closest(".replyComments") ? true : false;
    let commentElement = isReply
      ? info.closest(".replyComments")
      : info.closest(".comments");
    let commentIndex = parseInt(commentElement.getAttribute("data-id"));
    let dataArray = isReply ? replies : data;

    let val = dataArray.findIndex(
      (value) => parseInt(value.id) === commentIndex
    );

    let input = info.querySelector(".input");
    let text = info.querySelector(".text");
    let editBtn = info.querySelector(isReply ? ".editReplyBtn" : ".editBtn");
    let deleteBtn = info.querySelector(
      isReply ? ".deleteReplyBtn" : ".deleteBtn"
    );

    text.style.display = "block";
    text.textContent = input.value;
    input.remove();
    e.target.remove();
    editBtn.style.display = "block";
    deleteBtn.style.display = "block";

    let mentionMatch = input.value.match(/^@\w+/);
    let mention = mentionMatch ? mentionMatch[0] : "";
    let content = input.value.replace(mention, "").trim();
    text.innerHTML = `${
      mention ? `<span class="usernameTo">${mention}</span> ` : ""
    }${content}`;

    dataArray[val].replyingTo = mention.replace("@", "");
    dataArray[val].content = content;

    isReply ? saveRepliesToLocalStorage(replies) : saveToLocalStorage(data);
  }
});

document.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("replyBtn")) {
    inputUser.style.display = "none";
    e.preventDefault();
    let comments = e.target.parentElement.closest(".comments");
    let boxElement = e.target.closest(".box");

    replyText.value = "";
    replyUser.style.display = "flex";
    comments.appendChild(replyUser);
    if (boxElement) {
      let userNameElement = boxElement.querySelector(".profile .userName");

      if (userNameElement) {
        userName = userNameElement.textContent;
        use = userName;
        replyText.setAttribute("placeholder", `Reply To ${userName}...`);
        replyText.focus();
      }
    }
  }
});

document.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("replyTo")) {
    let index = e.target.parentElement
      .closest(".comments")
      .getAttribute("data-id");

    let re = e.target.parentElement.closest(".comments");

    let re1 = re.querySelector(".replyComments");
    console.log("🚀 ~ document.addEventListener ~ re1:", re1);

    let name = re.querySelector(".info .head .profile .userName").textContent;

    let replyContent = replyText.value;
    let mentionMatch = replyContent.match(/^@\w+/);
    let mention = mentionMatch ? mentionMatch[0] : "";
    let content = replyContent.replace(mention, "").trim();

    let userdata = {
      id: Math.floor(Math.random() * 10000),
      content: content,
      createdAt: Date.now(),
      score: 0,
      replyingTo: userName,
      cont: index,
      user: {
        image: {
          png: "./images/avatars/image-amyrobson.png",
        },
        username: "Mohammad Houda",
      },
      replies: [],
    };

    replies.push(userdata);
    saveRepliesToLocalStorage(replies);
    addreply(userdata, e.target.parentElement.closest(".comments"));
    inputUser.style.display = "flex";
    replyUser.remove();
  }
});

function addData(data) {
  data.forEach((ele) => {
    let cont = document.createElement("div");
    cont.className = "comments";
    cont.setAttribute("data-id", ele.id);
    cont.innerHTML = `
    <div class="cont">
      <div class="box">
        <div class="vote">
          <button class="addVote"><svg width="15" height="15" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg" class=""><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"></path></svg></button>
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
        replyCont.setAttribute("data-id", reply.id);
        replyCont.innerHTML = `
          <div class="box">
            <div class="vote">
              <button class="addVote"><svg width="15" height="15" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg" class="add"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"></path></svg></button>
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
}

function addComment(data) {
  let cont = document.createElement("div");
  cont.className = "comments";
  cont.setAttribute("data-id", data.id);
  cont.innerHTML = `
      <div class="cont">
        <div class="box">
          <div class="vote">
            <button class="addVote"><svg width="15" height="15" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg" class=""><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"></path></svg></button>
            <span class="numofvotes">${data.score}</span>
            <button class="removeVote"><svg width="15" height="5" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"></path></svg></button>
          </div>
          <div class="info">
            <div class="head">
              <div class="profile">
                <img class="userImg" src="${data.user.image.png}" alt="none">
                <span class="userName">${data.user.username}</span>
                <span class="you">You</span>
                <span class="timepost" data-timestamp="${data.createdAt}"></span>
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
  boxs.appendChild(cont);
  input.value = "";
}

function addreply(data, e) {
  let comments = e;
  let replyCont = document.createElement("div");
  replyCont.className = "replyComments";
  replyCont.setAttribute("data-id", data.id);
  replyCont.innerHTML = `
          <div class="box">
          <div class="vote">
            <button class="addVote"><svg width="15" height="15" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg" class=""><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"></path></svg></button>
            <span class="numofvotes">${data.score}</span>
            <button class="removeVote"><svg width="15" height="5" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"></path></svg></button>
          </div>
          <div class="info">
            <div class="head">
              <div class="profile">
                <img class="userImg" src="${data.user.image.png}" alt="none">
                <span class="userName">Mohammad Houda</span>
                <span class="you">You</span>
                <span class="timepost" data-timestamp="${data.createdAt}"></span>
              </div>
              <div class="edits">
                  <button class="editReplyBtn">Edit</button>
                  <button class="deleteReplyBtn">Delete</button>
              </div>
            </div>
            <p class="text"><span class="usernameTo">@${use}</span> ${data.content}</p>
          </div>
        </div>
      `;
  comments.appendChild(replyCont);

  updateTimestamps();
  setInterval(updateTimestamps, 1000);
}

function displayData(data) {
  data.forEach((ele) => {
    let cont = document.createElement("div");
    cont.className = "comments";
    cont.setAttribute("data-id", ele.id);
    cont.innerHTML = `
      <div class="cont">
        <div class="box">
          <div class="vote">
            <button class="addVote"><svg width="15" height="15" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg" class=""><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"></path></svg></button>
            <span class="numofvotes">${ele.score}</span>
            <button class="removeVote"><svg width="15" height="5" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"></path></svg></button>
          </div>
          <div class="info">
            <div class="head">
              <div class="profile">
                <img class="userImg" src="${ele.user.image.png}" alt="none">
                <span class="userName">${ele.user.username}</span>
                <span class="you">You</span>
                <span class="timepost" data-timestamp="${ele.createdAt}"></span>
              </div>
              <div class="edits">
              <button class="editBtn">Edit</button>
              <button class="deleteBtn">Delete</button>
              </div>
            </div>
            <p class="text">${ele.content}</p>
          </div>
        </div>
      `;
    boxs.appendChild(cont);
    input.value = "";
  });
}

function displayReply(data) {
  data.forEach((ele) => {
    let cont = document.createElement("div");
    cont.className = "replyComments";
    let comtCont = document.querySelector(`.comments[data-id="${ele.cont}"]`);

    cont.setAttribute("data-id", ele.id);
    cont.innerHTML = `
      <div class="cont">
        <div class="box">
          <div class="vote">
            <button class="addVote"><svg width="15" height="15" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg" class=""><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"></path></svg></button>
            <span class="numofvotes">${ele.score}</span>
            <button class="removeVote"><svg width="15" height="5" fill="hsl(211, 10%, 45%)" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"></path></svg></button>
          </div>
          <div class="info">
            <div class="head">
              <div class="profile">
                <img class="userImg" src="${ele.user.image.png}" alt="none">
                <span class="userName">${ele.user.username}</span>
                <span class="you">You</span>
                <span class="timepost" data-timestamp="${ele.createdAt}"></span>
              </div>
              <div class="edits">
              <button class="editReplyBtn">Edit</button>
              <button class="deleteReplyBtn">Delete</button>
              </div>
            </div>
            <p class="text"><span class="usernameTo">@${ele.replyingTo}</span> ${ele.content}</p>
          </div>
        </div>
      `;
    comtCont.appendChild(cont);
    input.value = "";
  });
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

function saveToLocalStorage(data) {
  localStorage.setItem("comments", JSON.stringify(data));
}

function saveRepliesToLocalStorage(replies) {
  localStorage.setItem("replies", JSON.stringify(replies));
}

getRequest();
