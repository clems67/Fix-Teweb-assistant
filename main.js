chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
  if (response.responseType !== "isDownloading") {
    console.log("listener worked ! its response :");
    console.log(response);
  }
  switch (response.responseType) {
    case "get_projects":
      const return_obj = GetProjectList(response.activityType);
      sendResponse({ projectList: JSON.stringify(return_obj) });
      break;
    case "downloadAllProjects":
      downloadProjects(true, response.activityType);
      break;
    case "downloadOneProject":
      downloadProjects(false, response.activityType, response.BU);
      break;
    case "insertProject":
      insertProject(response.activityType, response.BU, response.project);
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

function getHtmlValues(activityType) {
  let table;
  let selectBUname;
  let selectProjectName;
  let button;
  switch (activityType) {
    case "facturable":
      table = "ctl00_cph_a_GridViewActivitesFacturables";
      selectBUname = "ctl00_cph_a_GridViewActivitesFacturables_ctl02_ddlCodeBU";
      selectProjectName =
        "ctl00_cph_a_GridViewActivitesFacturables_ctl02_ddlProjet";
      button = "ctl00_cph_a_btnAjoutDirect";
      break;
    case "nonFacturable":
      table = "ctl00_cph_a_GridViewActivitesNonFacturables";
      selectBUname =
        "ctl00_cph_a_GridViewActivitesNonFacturables_ctl02_ddlCodeBU";
      selectProjectName =
        "ctl00_cph_a_GridViewActivitesNonFacturables_ctl02_ddlProjet";
      button = "ctl00_cph_a_btnAjoutIndirect";
      break;
    case "absFormDeleg":
      table = "ctl00_cph_a_GridViewAbsenceFormation";
      selectBUname = "ctl00_cph_a_GridViewAbsenceFormation_ctl02_ddlCodeBU";
      selectProjectName =
        "ctl00_cph_a_GridViewAbsenceFormation_ctl02_ddlProjet";
      button = "ctl00_cph_a_btnAjoutAbsences";
      break;
    default:
      console.log("ERREUR C'EST PASSÉ DANS LE DEFAULT : main.js htmlValues");
  }
  return { table, selectBUname, selectProjectName, button };
}

function downloadProjects(downloadAllProjects, activityType, BU = null) {
  let htmlValues = getHtmlValues(activityType);
  if (document.getElementById(htmlValues.table).rows.length < 2) {
    document.getElementById(htmlValues.button).click();
  }
  //wait(1000);
  if (downloadAllProjects) {
    loopDownLoad(
      activityType,
      htmlValues.selectBUname,
      htmlValues.selectProjectName
    );
  } else {
    downloadProjectsOneBU(
      activityType,
      BU,
      htmlValues.selectBUname,
      htmlValues.selectProjectName,
      htmlValues.table
    );
  }
}

function downloadProjectsOneBU(
  activity,
  BU,
  selectBUname,
  selectProjectName,
  table
) {
  let initTrigger = false;
  loopWait = setInterval(
    function () {
      if (document.getElementById(table).rows.length >= 2) {
        //setup
        const selectBU = document.getElementById(selectBUname);
        const selectProject = document.getElementById(selectProjectName);
        let BU_Project_Dictionary = JSON.parse(
          localStorage.getItem("project fix teweb - " + activity)
        );
        if (BU_Project_Dictionary === null) {
          BU_Project_Dictionary = new Object();
        }
        let projectsDownloaded = JSON.parse(
          localStorage.getItem("projets downloaded - " + activity)
        );
        if (projectsDownloaded === null) {
          projectsDownloaded = [];
        }
        if (!initTrigger) {
          initTrigger = true;
          var trigger = document.createElement("option");
          trigger.value = "trigger";
          selectProject.add(trigger);
          selectBU.value = BU;
          if (selectBU.value !== BU) {
            alert("Le BU que vous avez saisi est incorrect");
            clearInterval(loopWait);
          }
          selectBU.dispatchEvent(new Event("change"));
        } else if (
          selectProject[selectProject.options.length - 1].value !== "trigger"
        ) {
          let alertMessage = "Liste des projets téléchargé :";
          for (var i = 1; i < selectProject.options.length; i++) {
            BU_Project_Dictionary[selectProject[i].text] = BU;
            alertMessage += "\n- " + selectProject[i].text;
          }
          //store
          if (!projectsDownloaded.includes(BU)) {
            projectsDownloaded.push(BU);
          }
          localStorage.setItem(
            "project fix teweb - " + activity,
            JSON.stringify(BU_Project_Dictionary)
          );
          localStorage.setItem(
            "projets downloaded - " + activity,
            JSON.stringify(projectsDownloaded)
          );
          alert(alertMessage);

          clearInterval(loopWait);
        }
      }
    }.bind(activity, BU, selectBUname, selectProjectName),
    50
  );
}

function loopDownLoad(activity, selectBUname, selectProjectName) {
  let init = false;
  let iterationBU = 1;
  let BU_Project_Dictionary = JSON.parse(
    localStorage.getItem("project fix teweb - " + activity)
  );
  if (BU_Project_Dictionary === null) {
    BU_Project_Dictionary = new Object();
  }
  let projectsDownloaded = JSON.parse(
    localStorage.getItem("projets downloaded - " + activity)
  );
  if (projectsDownloaded === null) {
    projectsDownloaded = [];
  }
  loop = setInterval(
    function () {
      const selectBU = document.getElementById(selectBUname);
      const selectProject = document.getElementById(selectProjectName);
      if (!init) {
        selectBU.value = selectBU[iterationBU].value;
        selectBU.dispatchEvent(new Event("change"));
        init = true;
      }
      if (selectProject[selectProject.options.length - 1].value !== "trigger") {
        if (iterationBU === selectBU.options.length) {
          alert("Tout les BU on été téléchargés.");
          clearInterval(loop);
          return;
        }
        if (isValueAlreadyDownloaded(selectBU.value, projectsDownloaded)) {
          while (isValueAlreadyDownloaded(selectBU.value, projectsDownloaded)) {
            iterationBU = iterationBU + 1;
            if (iterationBU === selectBU.options.length) {
              alert("Tous les BU on été téléchargés.");
              clearInterval(loop);
              return;
            }
            selectBU.value = selectBU[iterationBU].value;
          }
          selectBU.dispatchEvent(new Event("change"));
        } else {
          for (var i = 1; i < selectProject.options.length; i++) {
            BU_Project_Dictionary[selectProject[i].text] =
              selectBU[iterationBU].value;
          }
          console.log(selectBU[iterationBU].value);
          projectsDownloaded.push(selectBU[iterationBU].value);
          sendIteration(iterationBU, selectBU.options.length, activity);
          iterationBU = iterationBU + 1;

          localStorage.setItem(
            "project fix teweb - " + activity,
            JSON.stringify(BU_Project_Dictionary)
          );
          localStorage.setItem(
            "projets downloaded - " + activity,
            JSON.stringify(projectsDownloaded)
          );

          selectBU.value = selectBU[iterationBU].value;
          selectBU.dispatchEvent(new Event("change"));
          console.log("iterationBU", iterationBU);
        }
        var trigger = document.createElement("option");
        trigger.value = "trigger";
        selectProject.add(trigger);
      }
    }.bind(selectBUname, selectProjectName),
    50 //loop every 50ms
  );
}

function isValueAlreadyDownloaded(value, array) {
  if (array.includes(value)) {
    console.log(value + " is already in json");
    return true;
  }
  return false;
}

function sendIteration(iteration, nbBU) {
  chrome.runtime.sendMessage({
    iteration: iteration,
    nbBU: nbBU,
  });
}

function insertProject(activityType, BUtoFill, projectToFill) {
  let htmlValues = getHtmlValues(activityType);
  let nbRowsBeforeClick = document.getElementById(htmlValues.table).rows.length;
  console.log(htmlValues);

  let button = document.getElementById(htmlValues.button);
  button.click();
  loopInsert = setInterval(
    function () {
      let table = document.getElementById(htmlValues.table);
      let selectBU = document.getElementById(
        htmlValues.selectBUname.replace("2", table.rows.length.toString())
      );
      let selectProject = document.getElementById(
        htmlValues.selectProjectName.replace("2", table.rows.length.toString())
      );

      if (table.rows.length > nbRowsBeforeClick) {
        if (selectBU.value !== BUtoFill) {
          var trigger = document.createElement("option");
          trigger.value = "trigger";
          selectBU.add(trigger);
          selectBU.value = BUtoFill;
          selectBU.dispatchEvent(new Event("change"));
        } else if (selectBU[selectBU.options.length - 1].value !== "trigger") {
          var options = Array.from(selectProject.options);
          options.forEach(function (option) {
            if (option.text === projectToFill) {
              selectProject.value = option.value;
            }
          });
          selectProject.dispatchEvent(new Event("change"));
          clearInterval(loopInsert);
        }
      }
    }.bind(htmlValues, nbRowsBeforeClick),
    50
  );
}
