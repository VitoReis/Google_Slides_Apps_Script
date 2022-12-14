// ADDS THE SCRIPT TO THE COMPLEMENT TABLE
function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  SlidesApp.getUi().createAddonMenu()
    .addItem('Start', 'sideBar')
    .addToUi();
}

// ADDS THE SIDE BAR
function sideBar(){
  var ui = SlidesApp.getUi();

  var template = HtmlService.createTemplateFromFile("Index");

  var html = template.evaluate();
  html.setTitle("Replacer");
  ui.showSidebar(html);
}

// SHOW GOOGLE PICKER
function showPicker() {
  var html = HtmlService.createHtmlOutputFromFile('Picker.html')
    .setWidth(600)
    .setHeight(425)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SlidesApp.getUi().showModalDialog(html, 'Select Folder');
}

function getOAuthToken() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}

// GETS THE USER URL
function selectedFile(id){
  var sheets = SpreadsheetApp.openById(id);
  var data = sheets.getDataRange().getValues();
  replace(data);
}

// CHECK THE TAGS AND REPLACE THEM
function replace(data){
  var originalId = SlidesApp.getActivePresentation().getId();
  var template = DriveApp.getFileById(originalId);
  var ui = SlidesApp.getUi();
  var numLines = 0; 
  var numCol = 0; 

  data.forEach( // COUNT THE NUMBER OF ANSWERS WE HAVE
    function(){
      numLines++;
    }
  )
  data[0].forEach(  // COUNT THE NUMBER OF TAGS WE HAVE
    function(){
      numCol++;
    }
  )
  
  for(var line = 1; line < numLines; line++){
    // GET ORIGINAL SLIDE ID AND MAKES A COPY
    var copy = template.makeCopy();
    copy.setName(data[line][0]);

    // GET NEW SLIDE ID
    var copyId = copy.getId();
    var slides = SlidesApp.openById(copyId).getSlides();


    var tagList = [];
    for(var i = 1; i < numCol; i++){
      tagList.push(data[0][i]);
    }
    // REPLACE TAGS
    slides.forEach(
      function(slide){
        var shapes = slide.getShapes();
        shapes.forEach(
          function(shape){
            for(var column = 1; column < numCol; column++){
              if(shape.getText().replaceAllText(data[0][column],data[line][column])){
                tagList = tagList.filter(e => e !== data[0][column]);
              }
            }
          }
        )
      }
    ) 
    if(tagList.length > 0){
      ui.alert("Possible error in presentation " + data[line][0], "Tags: " + tagList + " doesn't have matches", ui.ButtonSet.OK);
    }
  }
  
  ui.alert("Done", "Go to your google driver to see your new presentation(s)", ui.ButtonSet.OK);
}

// MADE BY: VITOR SILVA REIS - 2022
