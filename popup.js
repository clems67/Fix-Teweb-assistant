window.onload = function () {
  let filterInput = document.getElementById("filterInput");
  let buttonFacturable = document.getElementById("buttonFacturable");
  let buttonNonFacturable = document.getElementById("buttonNonFacturable");
  let buttonAbsence = document.getElementById("buttonAbsence");
  let buttonUpdateAll = document.getElementById("buttonUpdateAll");
  let inputBU = document.getElementById("inputBU");
  let projectList = document.getElementById("projectList");
  let buttonUpdateOneBU = document.getElementById("buttonUpdateOneBU");

  buttonFacturable.addEventListener("click", GetProjectListFacturable);
  buttonNonFacturable.addEventListener("click", GetProjectListNonFacturable);
  buttonAbsence.addEventListener("click", GetProjectListAbscence);
  projectList.addEventListener("dblclick", insertOption);
  buttonUpdateAll.addEventListener("click", downloadProjects);
  buttonUpdateOneBU.addEventListener("click", updateBU);

  chrome.runtime.onMessage.addListener(function (
    response,
    sender,
    sendResponse
  ) {
    //console.log("listener worked ! its response :");
    //console.log(response);
    document.getElementById("downloadProgress").textContent =
      response.iteration + " / " + response.nbBU;
  });
};

let activitySelected = localStorage.getItem("activitySelected");
if (activitySelected === null) {
  GetProjectListFacturable();
} else {
  switch (activitySelected) {
    case "facturable":
      GetProjectListFacturable();
      break;
    case "nonFacturable":
      GetProjectListNonFacturable();
      break;
    case "absFormDeleg":
      GetProjectListAbscence();
      break;
    default:
      console.log("ERREUR C'EST PASSÉ DANS LE DEFAULT : popup.js");
  }
}

let oldInput = "";
filterInput.value = localStorage.getItem("filterInput");
let loopCheckFilterInput = setInterval(() => {
  if (filterInput.value !== oldInput) {
    filterList();
    oldInput = filterInput.value;
    localStorage.setItem("filterInput", filterInput.value);
  }
}, 500);

function GetProjectListFacturable(getProjects = true) {
  changeActivitySelected("facturable");
  filterInput.value = "";
  buttonUpdateAll.textContent = "Charger les projets facturables";
  if (getProjects) {
    return GetProjectList("facturable");
  }
}

function GetProjectListNonFacturable(getProjects = true) {
  changeActivitySelected("nonFacturable");
  filterInput.value = "";
  buttonUpdateAll.textContent = "Charger les projets non facturables";
  if (getProjects) {
    return GetProjectList("nonFacturable");
  }
}

function GetProjectListAbscence(getProjects = true) {
  changeActivitySelected("absFormDeleg");
  filterInput.value = "";
  buttonUpdateAll.textContent = "Charger les projets absence";
  if (getProjects) {
    return GetProjectList("absFormDeleg");
  }
}

function changeActivitySelected(activity) {
  localStorage.setItem("activitySelected", activity);
  buttonFacturable.style = "border-width: 2px; border-color: black;";
  buttonNonFacturable.style = "border-width: 2px; border-color: black;";
  buttonAbsence.style = "border-width: 2px; border-color: black;";
  switch (activity) {
    case "facturable":
      buttonFacturable.style = "border-width: 5px; border-color: green;";
      break;
    case "nonFacturable":
      buttonNonFacturable.style = "border-width: 5px; border-color: green;";
      break;
    case "absFormDeleg":
      buttonAbsence.style = "border-width: 5px; border-color: green;";
      break;
  }
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
    const projectList = JSON.parse(response.projectList);
    fillList(projectList);
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
    option.style.display = option.text
      .toLowerCase()
      .includes(filter.toLowerCase())
      ? "list-item"
      : "none";
  });
}

function downloadProjects() {
  var dialog = confirm(
    "Attention aux épileptiques !!!\nPour mettre en pause le téléchargement, il vous suffit de rafraichir la page (CTRL + R ou F5).\nL'extension sauvegarde automatiquement en continue donc pas de soucis si le téléchargement est interrompu, il reprendra là où il s'était arrêté."
  );
  if (dialog) {
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function (tab) {
        chrome.tabs.sendMessage(tab.id, {
          responseType: "downloadAllProjects",
          activityType: whichActivityIsSelected(),
        });
      });
    });
  }
}

function updateBU() {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      chrome.tabs.sendMessage(tab.id, {
        responseType: "downloadOneProject",
        activityType: whichActivityIsSelected(),
        BU: inputBU.value.toUpperCase(),
      });
    });
  });
}

function whichActivityIsSelected() {
  return localStorage.getItem("activitySelected");
}

function insertOption() {
  let valueToSend = projectList[projectList.selectedIndex].value;
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(function (tab) {
      chrome.tabs.sendMessage(tab.id, {
        responseType: "insertProject",
        activityType: whichActivityIsSelected(),
        BU: valueToSend.substring(0, 8),
        project: valueToSend.substring(11, valueToSend.length),
      });
    });
  });
}
