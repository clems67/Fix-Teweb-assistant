//  let temp = document.getElementById("ctl00_cph_a_GridViewActivitesNonFacturables_ctl02_ddlCodeBU")
//console.log(temp.options[temp.selectedIndex].value)

function wait(ms) {
  var d = new Date();
  var d2 = null;
  do {
    d2 = new Date();
  } while (d2 - d < ms);
}

let init = false;
let end = false;

document.getElementById("ctl00_cph_a_btnAjoutIndirect").click();

let iterationBU = 1;
let BU_Project_Dictionary = new Object();

//console.log("i will wait");
//wait(2000);
//console.log("i waited");

loop = setInterval(() => {
  const selectBU = document.getElementById(
    "ctl00_cph_a_GridViewActivitesNonFacturables_ctl02_ddlCodeBU"
  );
  const selectProject = document.getElementById(
    "ctl00_cph_a_GridViewActivitesNonFacturables_ctl02_ddlProjet"
  );

  if (
    selectProject[selectProject.options.length - 1].value !== "trigger" &&
    selectBU.value !== selectBU[selectBU.options.length - 1].value
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
      "project fix teweb",
      JSON.stringify(BU_Project_Dictionary)
    );

    var trigger = document.createElement("option");
    trigger.value = "trigger";
    selectProject.add(trigger);
  }
}, 50);

function getProjects() {
  tempo1 = true;
}

function consoleProjects() {
  console.log(BU_Project_Dictionary);
}
