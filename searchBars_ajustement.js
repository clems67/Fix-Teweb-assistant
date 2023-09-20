InitiateSearchBars();
RemoveMarginTop();

let oldFilterBU = "";
let oldFilterProject = "";

loopSearchBars = setInterval(() => {
  RemoveMarginTop();
  let filter = document.getElementById("inputName").value;
  if (filter !== oldFilterBU) {
    Filter("ctl00_cph_p_ddlProfessionnels", filter);
    oldFilterBU = filter;
  }
  filter = document.getElementById("inputProject").value;
  if (filter !== oldFilterProject) {
    Filter("ctl00_cph_gvAjustement_ctl02_ddlProjet", filter);
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
  let inputBU = document.createElement("input");
  inputBU.id = "inputName";
  inputBU.style = "display:flex;width: 263px;margin-left:519px";
  inputBU.placeholder = "Filtre Nom-Prénom";
  let activityNode = document.getElementsByClassName("choixprof")[0];
  let parentDiv = activityNode.parentNode;
  parentDiv.insertBefore(inputBU, activityNode);
  
  let inputProject = document.createElement("input");
  inputProject.id = "inputProject";
  inputProject.style = "width:295px;margin-left:385px";
  inputProject.placeholder = "Filtre Projet";
  activityNode = document.getElementById("ctl00_cph_gvAjustement");
  activityNode.style = "margin-top:0px";
  parentDiv = activityNode.parentNode;
  parentDiv.insertBefore(inputProject, activityNode);
}

function RemoveMarginTop() {
  document.getElementById("ctl00_cph_gvAjustement").style = "margin-top:0";
}
