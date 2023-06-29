let isDownloading = false;
let activitySelected = "facturable"

window.onload = function () {
  let filterInput = document.getElementById("filterInput");
  let buttonFacturable = document.getElementById("buttonFacturable");
  let buttonNonFacturable = document.getElementById("buttonNonFacturable");
  let buttonAbsence = document.getElementById("buttonAbsence");
  let buttonUpdate = document.getElementById("buttonUpdate");

  filterInput.addEventListener("input", filterList);
  buttonFacturable.addEventListener("click", GetProjectListFacturable);
  buttonNonFacturable.addEventListener("click", GetProjectListNonFacturable);
  buttonAbsence.addEventListener("click", GetProjectListAbscence);
  buttonUpdate.addEventListener("click", uploadOrPause);

  if(!isDownloading){
    GetProjectListFacturable();
  }
};

function GetProjectListFacturable() {
   activitySelected = "facturable"
  filterInput.value = "";
  buttonFacturable.style = "border-width: 5px; border-color: green;";
  buttonNonFacturable.style = "border-width: 2px; border-color: black;";
  buttonAbsence.style = "border-width: 2px; border-color: black;";
  buttonUpdate.textContent = "Charger les projets facturables";
  return GetProjectList("facturable");
}

function GetProjectListNonFacturable() {
   activitySelected = "nonFacturable"
  filterInput.value = "";
  buttonFacturable.style = "border-width: 2px; border-color: black;";
  buttonNonFacturable.style = "border-width: 5px; border-color: green;";
  buttonAbsence.style = "border-width: 2px; border-color: black;";
  buttonUpdate.textContent = "Charger les projets non facturables";
  return GetProjectList("nonFacturable");
}

function GetProjectListAbscence() {
   activitySelected = "absFormDeleg"
  filterInput.value = "";
  buttonFacturable.style = "border-width: 2px; border-color: black;";
  buttonNonFacturable.style = "border-width: 2px; border-color: black;";
  buttonAbsence.style = "border-width: 5px; border-color: green;";
  buttonUpdate.textContent = "Charger les projets absence";
  return GetProjectList("absFormDeleg");
}

function GetProjectList(activity) {
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id, {
      responseType: "get_projects",
      activityType: activity,
    });
    console.log("response to get favorite list from delete_favorite :");
    const favoriteList = JSON.parse(response.favorites);
    console.log(favoriteList);
    fillList(favoriteList);
  })();
}

function fillList(projectDictionary) {
  console.log("fillList");
  const htmlList = document.getElementById("projectList");
  console.log(htmlList);
  while (htmlList.options.length !== 0) {
    htmlList.options.remove(0);
  }
  console.log(htmlList);
  if (projectDictionary === null) {
    const option = document.createElement("option");
    option.text = "aucun projet à afficher";
    option.value = "aucun projet à afficher";
    htmlList.add(option);
  }
  for (var key in projectDictionary) {
    var value = projectDictionary[key];
    let result = value + " | " + key;
    const option = document.createElement("option");
    option.text = result;
    option.value = result;
    htmlList.add(option);
  }
}

function filterList() {
  const filter = filterInput.value;

  var select = document.getElementById("projectList");
  var optionCollection = Array.from(select.options);

  optionCollection.forEach(function (option) {
    var include = option.text.toLowerCase().includes(filter.toLowerCase());
    option.style.display = include ? "list-item" : "none";
  });
}

function uploadOrPause() {
  if (isDownloading) {
    pauseDownload();
    filterInput.disabled = false;
    buttonFacturable.disabled = false;
    buttonNonFacturable.disabled = false;
    buttonAbsence.disabled = false;
    isDownloading = false;
    if(activitySelected === "facturable"){GetProjectListFacturable()}
    if(activitySelected === "nonFacturable"){GetProjectListNonFacturable()}
    if(activitySelected === "absFormDeleg"){GetProjectListAbscence()}
  } else {
    console.log(buttonAbsence);
    filterInput.disabled = true;
    buttonFacturable.disabled = true;
    buttonNonFacturable.disabled = true;
    buttonAbsence.disabled = true;
    buttonUpdate.textContent = "mettre en pause le chargement"
    downloadProjects();
    isDownloading = true;
  }
}

function pauseDownload() {
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id, {
      responseType: "stopDownload",
    });
  })();
}

function downloadProjects() {
  let activity;
  if (buttonFacturable.style.borderColor === "green") {
    activity = "facturable";
  }
  if (buttonNonFacturable.style.borderColor === "green") {
    activity = "nonFacturable";
  }
  if (buttonAbsence.style.borderColor === "green") {
    activity = "absFormDeleg";
  }
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id, {
      responseType: "downloadProjects",
      activityType: activity,
    });
  })();
}
