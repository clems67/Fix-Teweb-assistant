GetProjectList("nonFacturable");
document.getElementById("filterInput").addEventListener("input", filterList);

function GetProjectList(activityType) {
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id, {
      responseType: "get_projects" + "_" + activityType,
    });
    console.log("response to get favorite list from delete_favorite :");
    const favoriteList = JSON.parse(response.favorites);
    console.log(favoriteList);
    fillList(favoriteList);
  })();
}

function fillList(projectDictionary) {
  const htmlList = document.getElementById("projectList");
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
  const filter = document.getElementById("filterInput").value;

  var select = document.getElementById("projectList");
  var optionCollection = Array.from(select.options);

  optionCollection.forEach(function (option) {
    var include = option.text.toLowerCase().includes(filter.toLowerCase());
    option.style.display = include ? "list-item" : "none";
  });
}
