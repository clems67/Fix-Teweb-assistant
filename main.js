chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
  console.log("listener worked ! its response :");
  console.log(response);
  switch (response.responseType) {
    case "get_projects":
      console.log("c'est passé dans le get_favorite");
      const return_obj = GetProjectList(response.activityType);
      console.log(JSON.stringify(return_obj));
      sendResponse({ favorites: JSON.stringify(return_obj) });
      break;
    case "downloadProjects":
      downloadProjects(response.activityType);
      break;
    default:
      console.log("ERREUR C'EST PASSÉ DANS LE DEFAULT : main.js adListener");
  }
});

function GetProjectList(activite) {
  let activiteLocalStorage;
  switch (activite) {
    case "facturable":
      activiteLocalStorage = "project fix teweb - facturable";
      break;
    case "nonFacturable":
      activiteLocalStorage = "project fix teweb - nonFacturable";
      break;
    case "absFormDeleg":
      activiteLocalStorage = "project fix teweb - absFormDeleg";
      break;
    default:
      console.log("ERREUR GetFavorits");
  }
  let favorits = localStorage.getItem(activiteLocalStorage);
  projectDictionary = JSON.parse(favorits);
  console.log(favorits);
  console.log(projectDictionary);
  return projectDictionary;
}

//  let temp = document.getElementById("ctl00_cph_a_GridViewActivitesNonFacturables_ctl02_ddlCodeBU")
//console.log(temp.options[temp.selectedIndex].value)

function wait(ms) {
  var d = new Date();
  var d2 = null;
  do {
    d2 = new Date();
  } while (d2 - d < ms);
}

function downloadProjects(activityType) {
  let selectBUname;
  let selectProjectName;
  let button;
  switch (activityType) {
    case "facturable":
      selectBUname = "ctl00_cph_a_GridViewActivitesFacturables_ctl02_ddlCodeBU";
      selectProjectName =
        "ctl00_cph_a_GridViewActivitesFacturables_ctl02_ddlProjet";
      button = document.getElementById("ctl00_cph_a_btnAjoutDirect");
      break;
    case "nonFacturable":
      selectBUname =
        "ctl00_cph_a_GridViewActivitesNonFacturables_ctl02_ddlCodeBU";
      selectProjectName =
        "ctl00_cph_a_GridViewActivitesNonFacturables_ctl02_ddlProjet";

      button = document.getElementById("ctl00_cph_a_btnAjoutIndirect");
      break;
    case "absFormDeleg":
      selectBUname = "ctl00_cph_a_GridViewAbsenceFormation_ctl02_ddlCodeBU";
      selectProjectName =
        "ctl00_cph_a_GridViewAbsenceFormation_ctl02_ddlProjet";
      button = document.getElementById("ctl00_cph_a_btnAjoutAbsences");
      break;
    default:
      console.log(
        "ERREUR C'EST PASSÉ DANS LE DEFAULT : downloadProjects.js downloadProjects"
      );
  }

  button.click();
  wait(1000);
  loopDownLoad(activityType, selectBUname, selectProjectName);
}

function loopDownLoad(activity, selectBUname, selectProjectName) {
  let init = false;
  let iterationBU = 1;
  let BU_Project_Dictionary = new Object();
  loop = setInterval(
    function () {
      const selectBU = document.getElementById(selectBUname);
      const selectProject = document.getElementById(selectProjectName);
      if (selectBU.value === selectBU[selectBU.options.length - 1].value) {
        clearInterval(loop);
      } else if (
        selectProject[selectProject.options.length - 1].value !== "trigger"
      ) {
        if (!init) {
          selectBU.value = selectBU[iterationBU].value;
          const event = new Event("change");
          selectBU.dispatchEvent(event);
          init = true;
        }

        console.log("iterationBU", iterationBU);

        for (var i = 1; i < selectProject.options.length; i++) {
          BU_Project_Dictionary[selectProject[i].text] =
            selectBU[iterationBU].value;
        }

        iterationBU = iterationBU + 1;
        selectBU.value = selectBU[iterationBU].value;
        const event = new Event("change");
        selectBU.dispatchEvent(event);

        console.log(BU_Project_Dictionary);
        localStorage.setItem(
          "project fix teweb - " + activity,
          JSON.stringify(BU_Project_Dictionary)
        );

        var trigger = document.createElement("option");
        trigger.value = "trigger";
        selectProject.add(trigger);
      }
    }.bind(selectBUname, selectProjectName),
    50
  );
}
