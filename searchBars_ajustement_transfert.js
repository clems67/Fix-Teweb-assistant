InitiateSearchBars();
RemoveMarginTop();

let oldFilterBU = "";
let oldFilterProject = "";

loopSearchBars = setInterval(() => {
  RemoveMarginTop();
  let filter = document.getElementById("inputBu2").value;
  if (filter !== oldFilterBU) {
    Filter("ctl00_cph_transmp_ddlBU", filter);
    oldFilterBU = filter;
  }
  filter = document.getElementById("inputProject2").value;
  if (filter !== oldFilterProject) {
    Filter("ctl00_cph_transmp_ddlProjets", filter);
    oldFilterProject = filter;
  }
}, 200);

function Filter(selectId, filter) {
  console.log("select id :" + selectId);
  const select = document.getElementById(selectId);
  const selectList = document.getElementById(selectId).options;
  const filterString = ".*" + filter + ".*";
  const filterReg = new RegExp(filterString.toLowerCase());
  console.log("filter :" + filterReg);
  for (let item of selectList) {
    if (item.text.toLowerCase().match(filterReg)) {
      item.style.display = "";
      select.insertBefore(item, select.firstChild);
    } else {
      item.style.display = "none";
    }
  }
}

function InitiateSearchBars() {
  let inputBu2 = document.createElement("input");
  inputBu2.id = "inputBu2";
  inputBu2.style = "display:flex;width:84px;";
  inputBu2.placeholder = "Filtre Nom-Prénom";
  let activityNode = document.getElementById("ctl00_cph_transmp_ddlBU");
  let parentDiv = activityNode.parentNode;
  parentDiv.insertBefore(inputBu2, activityNode);
  
  let inputProject2 = document.createElement("input");
  inputProject2.id = "inputProject2";
  inputProject2.style = "display:flex;width:278px;";
  inputProject2.placeholder = "Filtre Projet";
  activityNode = document.getElementById("ctl00_cph_transmp_ddlProjets");
  activityNode.style = "margin-top:0px";
  parentDiv = activityNode.parentNode;
  parentDiv.insertBefore(inputProject2, activityNode);
}

function RemoveMarginTop() {
  document.getElementById("ctl00_cph_gvAjustement").style = "margin-top:0";
}
