window.onload = function () {
  let filterInput = document.getElementById("filterInput");
  let buttonUpdate = document.getElementById("buttonUpdate");
  let buttonFacturable = document.getElementById("buttonFacturable");
  let buttonNonFacturable = document.getElementById("buttonNonFacturable");
  let buttonAbsence = document.getElementById("buttonAbsence");

  filterInput.addEventListener("input", filterList);
  buttonFacturable.addEventListener("click", GetProjectListFacturable);
  buttonNonFacturable.addEventListener("click", GetProjectListNonFacturable);
  buttonAbsence.addEventListener("click", GetProjectListAbscence);
  document
    .getElementById("buttonUpdate")
    .addEventListener("click", downloadProjects);
};

function GetProjectListFacturable() {
  filterInput.value = "";
  buttonUpdate.textContent = "Charger les projets facturables";
  buttonFacturable.style = "border-width: 5px; border-color: green;";
  buttonNonFacturable.style = "border-width: 2px; border-color: black;";
  buttonAbsence.style = "border-width: 2px; border-color: black;";
  return GetProjectList("facturable");
}

function GetProjectListNonFacturable() {
  filterInput.value = "";
  buttonUpdate.textContent = "Charger les projets non facturables";
  buttonFacturable.style = "border-width: 2px; border-color: black;";
  buttonNonFacturable.style = "border-width: 5px; border-color: green;";
  buttonAbsence.style = "border-width: 2px; border-color: black;";
  return GetProjectList("nonFacturable");
}

function GetProjectListAbscence() {
  filterInput.value = "";
  buttonUpdate.textContent = "Charger les projets absence";
  buttonFacturable.style = "border-width: 2px; border-color: black;";
  buttonNonFacturable.style = "border-width: 2px; border-color: black;";
  buttonAbsence.style = "border-width: 5px; border-color: green;";
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
      activityType:activity
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

function downloadProjects() {
  let activity
  if(buttonFacturable.style.borderColor === "green"){activity = "facturable"}
  if(buttonNonFacturable.style.borderColor === "green"){activity = "nonFacturable"}
  if(buttonAbsence.style.borderColor === "green"){activity = "absFormDeleg"}
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