﻿////////////////////////////////////////////////////////////////////////////
// Photoshop script written by Karol Łukaszczyk, 01.2020
// Permits you to use, modify, and distribute this file
/////////////////////////////////////////////////////////////////////////////

#target photoshop

$.level = 1; // Debugging level, Level: 0 - No Break, 1 - Break, 2 - Immediate Break

#include "./scripts - method/dateAdd.jsx"


//#include "method - date Add.jsx";

function appDataBuilder () {

    var listFile = createListFilePath();
    buildListFilesIfItDoesntExists(listFile);

    var prefFile = createPrefFilePath();
    buildPrefFilesIfItDoesntExists(prefFile);

}

function GuiBuilder() {

    this.baseLayout();
    this.images();
    this.buildSettingsWindow();
}

GuiBuilder.prototype.baseLayout = function() {

    //Creating groups to populate with main UI
    this.mainWindow = new Window("dialog", "Add canvas");

    this.grpMain = this.mainWindow.add("group")

    this.grpInfo = createGroupUI(this.grpMain, "column", "left");
    this.panelWidth = 40; // Do not use creation property size in px for panels due to issues with bugs

}

GuiBuilder.prototype.images = function() {

    var scriptPath = $.fileName;
    var imageFolderDestination = getScriptFolder(scriptPath) + "/images/";

    //Image: InfoHover.png
    this.imageInfHov = File(imageFolderDestination + "InfoHover.png");

    //Image: ConstrPropFalse.png and ConstrPropTrue.png
    this.imageCnstrnsProportionFalse = File(imageFolderDestination + "ConstrPropFalse.png");
    this.imageCnstrnsProportionTrue = File(imageFolderDestination + "ConstrPropTrue.png");

    //Image: imageAnchorTrue.png and imageAnchorFalse.png
    this.imageAnchorTrue = File(imageFolderDestination + "anchorPointerTrue.png");
    this.imageAnchorFalse = File(imageFolderDestination + "anchorPointerFalse.png");

}

GuiBuilder.prototype.buildPanelSourceFiles = function() {
    //Creating group to populate with main UI
    this.plnSourceFiles = createPanelUI(this.grpInfo, undefined, "left");

    //Source files title
    this.plnSourceFiles.title = this.plnSourceFiles.add("statictext", undefined, "Source files:");

    //Creating radial button group
    this.btnRadSourceFiles = createGroupUI(this.plnSourceFiles, "column", "left", "left");

    //Radial button choose active files/target folder
    this.btnRadSourceFiles.chooseOpenedFiles = this.btnRadSourceFiles.add("radiobutton", undefined, "Opened files");
    this.btnRadSourceFiles.chooseFilesSourceFold = this.btnRadSourceFiles.add("radiobutton", undefined, "Choose folder");

    //Add button to choose target folder
    this.grpBtnChooseFilesSourceFold = this.plnSourceFiles.add("group");

    this.btnChooseFilesSourceFold =  this.grpBtnChooseFilesSourceFold.add("button", undefined, "Browse...");
    this.btnChooseFilesSourceFold.title = this.grpBtnChooseFilesSourceFold.add("statictext", undefined, "Source folder...");

    this.btnChooseFilesSourceFold.title.characters = this.panelWidth; //Giving the same width as: this.plnSourceFiles, this.plnFilterFiles, this.pnlDestFold
}

GuiBuilder.prototype.buildPanelSourceFilesFilter = function() {

    //Create panel
    this.plnFilterFiles = createPanelUI(this.grpInfo, undefined, "left");

    this.filterSourceFilesCheckbox = createGroupUI(this.plnFilterFiles, "column", "left", "left");
    //Create checkbox
    this.filterSourceFilesCheckbox.PNG = this.filterSourceFilesCheckbox.add("checkbox", undefined, "Process only PNG");

    var PNGbyDefault_ON_OFF = readValueOfSeetingsFromPrefFile('"FILTER BY PNG"- CHECKBOX = TRUE');
    if (PNGbyDefault_ON_OFF === ':  ON ') {
        this.filterSourceFilesCheckbox.PNG.value = true;
    }
    //Create group
    this.filterSourceFilesCheckbox.byExpression = this.filterSourceFilesCheckbox.add("checkbox", undefined, "filter files by expression");


    this.filterSourceFilesByExpression = this.plnFilterFiles.add("group"); //Why it is not part of this.filterSourceFilesCheckbox.byExpression, thou ask? Becouse only checkbox of filterSourceFilesCheckbox.byExpression enable or disable this group
        //Create statictext
        this.filterSourceFilesByExpression.title = this.filterSourceFilesByExpression.add("statictext", undefined, "Filter by:");
        //Create editText
        this.filterSourceFilesByExpression.input = this.filterSourceFilesByExpression.add("edittext", undefined, "");
        this.filterSourceFilesByExpression.input.characters = 30;

        this.filterSourceFilesByExpression.imageTooltip = this.filterSourceFilesByExpression.add("image", undefined, this.imageInfHov);

        this.filterSourceFilesByExpression.panelWidth = this.filterSourceFilesByExpression.add("statictext", undefined, "");
        this.filterSourceFilesByExpression.panelWidth.characters = this.panelWidth -32; //Giving the same width as: this.plnSourceFiles, this.plnFilterFiles, this.pnlDestFold

}

GuiBuilder.prototype.buildPanelDestinationFolder = function() {

    this.pnlDestFold = createPanelUI(this.grpInfo, undefined, "left");

    //Title
    this.pnlDestFold.title = this.pnlDestFold.add("statictext", undefined, "Destination folder:");

    //Creating group radial button choose destination folder
    this.btnRadDestFold = createGroupUI(this.pnlDestFold, "column", "left", "left");

    //Radial buttons choose destination folder
    this.btnRadDestFold.same = this.btnRadDestFold.add("radiobutton", undefined, "Add canvas in the same folder");
    this.btnRadDestFold.other = this.btnRadDestFold.add("radiobutton", undefined, "Add canvas and copy files to other folder");

    //Browse button destination folder
    this.grpBtnDestFold = this.pnlDestFold.add("group");

    this.btnChooseFilesDestFold = this.grpBtnDestFold.add("button", undefined, "Browse...");
    this.btnChooseFilesDestFold.title = this.grpBtnDestFold.add("statictext", undefined, "Destination folder...");
    this.btnChooseFilesDestFold.title.characters = this.panelWidth; //Giving the same width as: this.plnSourceFiles, this.plnFilterFiles, this.pnlDestFold
}

GuiBuilder.prototype.buildPanelAddCanvas = function(){

    ///Add canvas UI
    this.pnlAddCanvas = createPanelUI(this.grpInfo, undefined, "left");

    //Title
    this.pnlAddCanvas.title = this.pnlAddCanvas.add("statictext", undefined, "Add canvas");

    //Group units value
    this.grpUnitVal = this.pnlAddCanvas.add("group");

        //Group dialog units value
        this.grpUnitValDlg = createGroupUI(this.grpUnitVal, "column", "left");

            //Group width
            this.grpWidth = this.grpUnitValDlg.add("group");

                //Edittext: Width
                this.grpWidth.title = this.grpWidth.add("statictext", undefined, "Width:  ");
                this.grpWidth.numb =  this.grpWidth.add("edittext", undefined, 0);
                this.grpWidth.numb.characters = 9;

                //Update also unitsTypes
                var AddCanvasDocUnits = [
                    "ADD PX", 
                    "ADD %",
                    ];
                this.grpWidth.unitsDropDown = this.grpWidth.add("dropdownlist", undefined, AddCanvasDocUnits);
                this.grpWidth.unitsDropDown.selection = 0;

                //Crating tooltip
                this.grpWidth.imageTooltip = this.grpWidth.add("image", undefined, this.imageInfHov);

            //Group height
            this.grpHeight = this.grpUnitValDlg.add("group");

                //Edittext: Height
                this.grpHeight.title = this.grpHeight.add("statictext", undefined, "Height: ");
                this.grpHeight.numb =  this.grpHeight.add("edittext", undefined, 0);
                this.grpHeight.numb.characters = 9;

                //Dropdownlist: Add PX, add %
                this.grpHeight.unitDropDown = this.grpHeight.add("dropdownlist", undefined, AddCanvasDocUnits);
                this.grpHeight.unitDropDown.selection = 0;

                //Image: InfoHover.png
                this.grpHeight.imageTooltip = this.grpHeight.add("image", undefined, this.imageInfHov);

        //Graphic element proportions constrains (true, false)

            //Add constrain image next to dialog
            this.grpDlgUnitValImage = this.grpUnitVal.add("image", undefined, this.imageCnstrnsProportionFalse);
            this.grpDlgUnitValImage.alignment = "right";

    //Constrains proportions
    this.constrainsProportionsCheckbox = this.pnlAddCanvas.add("checkbox", undefined, "Same Height and Width");

    //Anchor display
    this.grpAnchorMarginesSpaceTop =  [this.pnlAddCanvas.add("group", undefined, ""),
                                    this.pnlAddCanvas.add("group", undefined, "")];

    this.grpAnchor = this.pnlAddCanvas.add("group");
    this.grpAnchor.title = this.grpAnchor.add("statictext", undefined, "Anchor: ");
    this.grpAnchor.title.alignment = [ScriptUI.Alignment.LEFT, ScriptUI.Alignment.TOP]

        //Creating anchor group box
        this.grpAnchor.boxBtns = createGroupUI(this.grpAnchor, "column");

        //Creating anchor gorup lines inside box
        this.grpAnchor.boxBtns.line001 = this.grpAnchor.boxBtns.add("group");
        this.grpAnchor.boxBtns.line002 = this.grpAnchor.boxBtns.add("group");
        this.grpAnchor.boxBtns.line003 = this.grpAnchor.boxBtns.add("group");

            //Adding 001 line of buttons
            this.anchorPositionTOPLEFT = this.grpAnchor.boxBtns.line001.add("iconbutton", undefined, this.imageAnchorFalse);
            this.anchorPositionTOPCENTER = this.grpAnchor.boxBtns.line001.add("iconbutton", undefined, this.imageAnchorFalse);
            this.anchorPositionTOPRIGHT = this.grpAnchor.boxBtns.line001.add("iconbutton", undefined, this.imageAnchorFalse);

            //Adding 002 line of buttons
            this.anchorPositionMIDDLELEFT = this.grpAnchor.boxBtns.line002.add("iconbutton", undefined, this.imageAnchorFalse);
            this.anchorPositionMIDDLECENTER = this.grpAnchor.boxBtns.line002.add("iconbutton", undefined, this.imageAnchorTrue);
            this.anchorPositionMIDDLERIGHT = this.grpAnchor.boxBtns.line002.add("iconbutton", undefined, this.imageAnchorFalse);

            //Adding 003 line of buttons
            this.anchorPositionBOTTOMLEFT = this.grpAnchor.boxBtns.line003.add("iconbutton", undefined, this.imageAnchorFalse);
            this.anchorPositionBOTTOMCENTER = this.grpAnchor.boxBtns.line003.add("iconbutton", undefined, this.imageAnchorFalse);
            this.anchorPositionBOTTOMRIGHT = this.grpAnchor.boxBtns.line003.add("iconbutton", undefined, this.imageAnchorFalse);

    this.grpAnchorMarginesSpaceBottom = this.pnlAddCanvas.add("statictext", undefined, "");
    this.grpAnchorMarginesSpaceBottom.characters = this.panelWidth + 13;//Giving the same width as: this.plnSourceFiles, this.plnFilterFiles, this.pnlDestFold

    //Canvas color extension
    this.canvExtendColor = this.pnlAddCanvas.add("group");

        this.canvExtendColor.title = this.canvExtendColor.add("statictext", undefined, "Canvas extension color: ");

        var canvExtendColorValues = ["Foreground",
                                    "Background",
                                    "White",
                                    "Black",
                                    "Grey",
                                    "Select color",
                                    "Left upper corner color"
                                    ];// functions in onCanvExtendColorDropDwn; Can't be part of UI object, becouse of bug in the next line

        this.canvExtendColor.dropDwn = this.canvExtendColor.add("dropdownlist", undefined, canvExtendColorValues);
        this.canvExtendColor.dropDwn.selection = 1;

}

GuiBuilder.prototype.buildPanelInfoUI = function(){

    this.pnlDocInfo = createPanelUI(this.grpInfo, undefined, "left");

    //Number of files displayed in "Info UI"
    this.numbOfDisplayedFiles = 2;

    //Creating empty lines of text to fill with files names later
    this.plnDocInfoLines = new Array; //plnDocInfo.lines -> "undefined not as object"

    for (var i = 0; i < (this.numbOfDisplayedFiles + 1); i++) {
        this.plnDocInfoLines[i] = this.pnlDocInfo.add("statictext");
        this.plnDocInfoLines[i].characters = this.panelWidth + 13;//Giving the same width as: this.plnSourceFiles, this.plnFilterFiles, this.pnlDestFold
    }
}

GuiBuilder.prototype.buildAcceptCancelSettingsButtons = function() {

        this.grpBtns = createGroupUI(this.grpMain, "column", undefined, [ScriptUI.Alignment.RIGHT, ScriptUI.Alignment.TOP]);

        this.btnAccept = this.grpBtns.add("button", undefined, "Accept");

        this.btnCancel = this.grpBtns.add("button", undefined, "Close");

        this.btnSettings = this.grpBtns.add("button", undefined, "Settings");
}

GuiBuilder.prototype.buildSettingsWindow = function() {

    this.settingsWindow = new Window("dialog", "Enabled/Disabled");
    this.settingsWindow.alignChildren = "left";


    this.settingsWindow.PNGbyDefault = this.settingsWindow.add("group");
    this.settingsWindow.PNGbyDefault.btn = this.settingsWindow.PNGbyDefault.add("button", [0,80,290,101], '"Filter files by PNG" By default');

    var PNGbyDefault_ON_OFF = readValueOfSeetingsFromPrefFile('"FILTER BY PNG"- CHECKBOX = TRUE');
    this.settingsWindow.PNGbyDefault.title = this.settingsWindow.PNGbyDefault.add("statictext", undefined, PNGbyDefault_ON_OFF);


    this.settingsWindow.DoNotShowCloseOpenedFiles= this.settingsWindow.add("group");
    this.settingsWindow.DoNotShowCloseOpenedFiles.btn = this.settingsWindow.DoNotShowCloseOpenedFiles.add("button", [0,40,290,61], '"Do you want to close all opened files?" Dialog');

    var DoNotShowCloseOpenedFiles_ON_OFF = readValueOfSeetingsFromPrefFile('"DO YOU WANT TO CLOSE ALL OPENED FILES"- DIALOG');
    this.settingsWindow.DoNotShowCloseOpenedFiles.title = this.settingsWindow.DoNotShowCloseOpenedFiles.add("statictext", undefined, DoNotShowCloseOpenedFiles_ON_OFF);


    this.settingsWindow.logFiles = this.settingsWindow.add("group");
    this.settingsWindow.logFiles.btn = this.settingsWindow.logFiles.add("button", [205,80,495,101], '"scriptUI_changedFilesList.txt" Log');

    var logFiles_ON_OFF = readValueOfSeetingsFromPrefFile('"SCRIPTUI_CHANGEDFILESLIST.TXT"- WRITE LOG');
    this.settingsWindow.logFiles.title = this.settingsWindow.logFiles.add("statictext", undefined, logFiles_ON_OFF);

    this.settingsWindow.btnReturn = this.settingsWindow.add("button", [205,120,495,141], "Return");

}

function EventHandlerBuilder(UI) {
    this.UI = UI;
}

GuiBuilder.prototype.showMainWindow = function() {
    this.mainWindow.show();
}

EventHandlerBuilder.prototype.onBtnRadChooseFilesActiveDocs = function() {
    var UI = this.UI;

    //Opened files in PS
    UI.btnRadSourceFiles.chooseOpenedFiles.onClick = function() {

        btnChooseFilesSourceFoldEnabled(false, UI);

        plnFilterFilesEnabled(false, UI);

        UI.pnlDestFold.title.enabled = true;

        btnsRadDestFoldEnabled(true, UI);

        checkingIfWidthAndHeightIsNot0UnlockingBtn(UI.grpWidth.numb, UI.grpHeight.numb, UI.btnAccept); //it has to be in that order, becouse UI.btnRadDestFold.other.onClick() check also values of numbs

        if (UI.pnlAddCanvas.enabled === false) {
            UI.pnlAddCanvas.enabled = true;
        }

        if (UI.btnRadDestFold.other.value === true) {

            UI.btnRadDestFold.other.onClick();
        } 

        infoFilesUIUpdate(docsOpenedFiles(), UI.numbOfDisplayedFiles, UI.pnlDocInfo, UI.plnDocInfoLines);

    }
}

EventHandlerBuilder.prototype.onBtnRadChooseFilesSourceFold = function() {
    var UI = this.UI;
    var self = this;

    //Choose source folder
    UI.btnRadSourceFiles.chooseFilesSourceFold.onClick = function() {

        //Until there is no choosed folder you have only ability to browse source folder
        if (UI.btnChooseFilesSourceFold.title.text === "Source folder...") {

            btnChooseFilesSourceFoldEnabled(true, UI);

            UI.pnlDestFold.title.enabled = false;

            btnsRadDestFoldEnabled(false, UI);

            btnChooseFilesDestFoldEnabled(false, UI);

            checkingIfWidthAndHeightIsNot0UnlockingBtn(UI.grpWidth.numb, UI.grpHeight.numb, UI.btnAccept);

            UI.pnlAddCanvas.enabled = false;

            infoFilesUIUpdate(undefined, UI.numbOfDisplayedFiles, UI.pnlDocInfo, UI.plnDocInfoLines);

            UI.btnAccept.enabled = false;
        
        } else if (UI.btnChooseFilesSourceFold.title.text !== "Source folder..."){

            btnChooseFilesSourceFoldEnabled(true, UI);

            plnFilterFilesEnabled(true, UI);

            UI.pnlDestFold.title.enabled = true;

            btnsRadDestFoldEnabled(true, UI);
            
            if (UI.btnRadDestFold.other.value === true) {

                UI.btnRadDestFold.other.onClick();

            }

            checkingIfWidthAndHeightIsNot0UnlockingBtn(UI.grpWidth.numb, UI.grpHeight.numb, UI.btnAccept);

            infoFilesUIUpdate(self.sourceFilesToProcess, UI.numbOfDisplayedFiles, UI.pnlDocInfo, UI.plnDocInfoLines);
        }
    }
}

EventHandlerBuilder.prototype.startSettingsUINumbofActiveDocs = function() {
    var UI = this.UI;
    var self = this;

    plnFilterFilesEnabled(false, UI);

    UI.numbOfActiveDocuments = docsOpenedFiles().length; //Save later to use in summary alert

    self.openedDocsToReopen = gettingFilesOpenedDocsToReopen(); // To avoid bug with unability with "saving as" opened files again after evoking script again
    

    //Start setting. If there is no active docs, set to choose folder
    if (UI.numbOfActiveDocuments === 0) {

        UI.btnRadSourceFiles.chooseFilesSourceFold.notify();

        UI.btnRadSourceFiles.chooseOpenedFiles.enabled = false;

    } else if (UI.numbOfActiveDocuments > 0) {

        UI.btnRadSourceFiles.chooseOpenedFiles.notify();
        UI.btnRadDestFold.same.notify();
        btnChooseFilesDestFoldEnabled(false, UI);
        
    }
}

EventHandlerBuilder.prototype.onBtnChooseFilesSourceFold = function() {
    var UI = this.UI;
    var self = this;

    //Browse source folder
    UI.btnChooseFilesSourceFold.onClick = function() {

        self.sourceFolder = Folder.selectDialog("Select folder with files to process");

        //Warning when you didn't choose any folder now and before
        if (self.sourceFolder === null && UI.btnChooseFilesSourceFold.title.text === "Source folder...") {
            alert("You have not selected source folder");
        //else if (self.sourceFolder === null && UI.btnChooseFilesSourceFold.title.text !== "Source folder..."). Leave selected source folder -> leave status quo

        } else if (self.sourceFolder !== null) {

            var sameChoosedSourceFolderAsBefore = checkingIfItIsTheSameSourceFolderAsBefore(self);
    
            self.sourceFolderNameRecent = self.sourceFolder.name; //Saving name of source folder to avoid bug; If you choose already some folder, but later you canceled choosing folder, you will not get "undefined" becouse of this variable.
            self.sourceFolderPathRecent = self.sourceFolder; //Add to self to avoid scope issues and bug when source folder is null but it is selected previously in dialog box
            
            var sourceFilesUnfiltered = new Array;
            var sourceFilesFiltered = new Array;
            var properFilesExtPSfiles = /.(jpg|tif|psd|bmp|gif|png)$/;
            
            sourceFilesUnfiltered = self.sourceFolder.getFiles();

            sourceFilesFiltered = filteringSourceFiles(sourceFilesUnfiltered, properFilesExtPSfiles);

            if (sourceFilesFiltered.length === 0) {

                self.sourceFolder === null;// to avoid bug
                
                createPathString(UI.btnChooseFilesSourceFold.title, "Source folder...");

                plnFilterFilesEnabled(false, UI);

                UI.pnlDestFold.title.enabled = false;

                btnsRadDestFoldEnabled(false, UI);

                btnChooseFilesDestFoldEnabled(false, UI);

                UI.pnlAddCanvas.enabled = false;
                
                UI.btnAccept.enabled = false;

                infoFilesUIUpdate(undefined, UI.numbOfDisplayedFiles, UI.pnlDocInfo, UI.plnDocInfoLines);

                alert("In choosed folder there is no files to process");
                

            } else if (sourceFilesFiltered.length > 0) {

                self.sourceFilesPSDformat = null; 
                self.sourceFilesPSDformat = addingFilteredFilesToSourceFiles(sourceFilesUnfiltered, sourceFilesFiltered);

                self.sourceFilesToProcess = filterFilesByCheckboxes(self.sourceFilesPSDformat, UI, UI.filterSourceFilesCheckbox.byExpression, UI.filterSourceFilesCheckbox.PNG); // if any boxes are checked, then it is filtered by ceratain checkboxes; if it is not, then you have only psd format

                createPathString(UI.btnChooseFilesSourceFold.title, self.sourceFolder);

                plnFilterFilesEnabled(true, UI);
                
                UI.pnlDestFold.title.enabled = true;
                
                btnsRadDestFoldEnabled(true, UI);
                
                infoFilesUIUpdate(self.sourceFilesToProcess, UI.numbOfDisplayedFiles, UI.pnlDocInfo, UI.plnDocInfoLines);

                if (typeof self.detinationFolder === "undefined") {

                    UI.btnRadDestFold.same.notify();

                } else if ( (typeof self.detinationFolder !== "undefined") && (self.detinationFolder !== null) ) { //(self.detinationFolder !== null) to avoid bug

                    var sameDestinationFolderAndSourceFolder = ( self.detinationFolder.toString() === self.sourceFolder.toString() );

                    if (sameDestinationFolderAndSourceFolder) {

                        createPathString(UI.btnChooseFilesDestFold.title, "Destination folder...");
                        
                        self.detinationFolder = null;
                        UI.btnRadDestFold.same.notify();
    
                        alert("Source folder and target folder are the same.\nNext time choose more wisely");

                    } else {

                        UI.btnRadDestFold.other.notify();
                    }
                }
                
                if (sameChoosedSourceFolderAsBefore === false) {
                    if (self.sourceFilesToProcess.length > 1) {
                        alert("In folder are " + self.sourceFilesToProcess.length + " files");
                    } else if (self.sourceFilesToProcess.length === 1) {
                        alert("In folder is 1 file");
                    }
                }
            }
        } 
    }
}

EventHandlerBuilder.prototype.onFilterSourceFilesCheckboxPNG = function() {

    var UI = this.UI;
    var self = this;

    UI.filterSourceFilesCheckbox.PNG.onClick = function() {

        self.sourceFilesToProcess = filterFilesByCheckboxes(self.sourceFilesPSDformat, UI, UI.filterSourceFilesCheckbox.byExpression, UI.filterSourceFilesCheckbox.PNG);
        
        infoFilesUIUpdate(self.sourceFilesToProcess, UI.numbOfDisplayedFiles, UI.pnlDocInfo, UI.plnDocInfoLines);
    }
}

EventHandlerBuilder.prototype.onFilterSourceFilesCheckboxByExpression = function() { 

    var UI = this.UI;
    var self = this;

    UI.filterSourceFilesCheckbox.byExpression.onClick = function() {

        filterSourceFilesCheckboxByExpressionEnabled(UI);
        
        self.sourceFilesToProcess = filterFilesByCheckboxes(self.sourceFilesPSDformat, UI, UI.filterSourceFilesCheckbox.byExpression, UI.filterSourceFilesCheckbox.PNG);
        
        infoFilesUIUpdate(self.sourceFilesToProcess, UI.numbOfDisplayedFiles, UI.pnlDocInfo, UI.plnDocInfoLines);
    }
}

EventHandlerBuilder.prototype.onFilterSourceFilesByExpressionInput = function() {
    
    var UI = this.UI;
    var self = this;

    UI.filterSourceFilesByExpression.imageTooltip.helpTip = "You can use regular expression (RegExp), but be cautious. Wrong syntax input cause disturbance of functioning of the script.\n" +
                                                            "To avoid that, copy and paste well defined expression in to input dialog.\n" +
                                                            "If you want to check expression, enter website: https://regex101.com/ ";

    UI.filterSourceFilesByExpression.input.onChanging = function() {

        self.sourceFilesToProcess = filterFilesByCheckboxes(self.sourceFilesPSDformat, UI, UI.filterSourceFilesCheckbox.byExpression, UI.filterSourceFilesCheckbox.PNG);
        
        infoFilesUIUpdate(self.sourceFilesToProcess, UI.numbOfDisplayedFiles, UI.pnlDocInfo, UI.plnDocInfoLines);

    }

}

EventHandlerBuilder.prototype.onBtnRadDestFoldSame = function() {
    var UI = this.UI;

    UI.btnRadDestFold.same.onClick = function() {

        btnChooseFilesDestFoldEnabled(false, UI);

        checkingIfWidthAndHeightIsNot0UnlockingBtn(UI.grpWidth.numb, UI.grpHeight.numb, UI.btnAccept);

        UI.pnlAddCanvas.enabled = true;
    }
}

EventHandlerBuilder.prototype.onBtnRadDestFoldOther = function() {
    var UI = this.UI;

    //Copy and Add canvas in other folder
    UI.btnRadDestFold.other.onClick = function() {

        btnChooseFilesDestFoldEnabled(true, UI);

        checkingIfWidthAndHeightIsNot0UnlockingBtn(UI.grpWidth.numb, UI.grpHeight.numb, UI.btnAccept);

        if (UI.btnChooseFilesDestFold.title.text === "Destination folder...") {

            UI.btnAccept.enabled = false;
            UI.pnlAddCanvas.enabled = false;

        } else if (UI.btnChooseFilesDestFold.title.text !== "Destination folder...") {

            UI.pnlAddCanvas.enabled = true;
        }
    }
    
}

EventHandlerBuilder.prototype.onBtnChooseFilesDestFold = function() {
    var UI = this.UI;
    var self = this;

    UI.btnChooseFilesDestFold.onClick = function() {

        var detinationFolderSelection = Folder.selectDialog("Select target folder to save files");

        if (detinationFolderSelection === null) {

            if (UI.btnChooseFilesDestFold.title.text === "Destination folder...") {
                alert("You have not selected target folder");
                self.detinationFolder = null; //to avoid bug
            } //else {if you have already have had selected folder destination, then it remains status quo}

        } else if (detinationFolderSelection !== null) {

            if (UI.btnRadSourceFiles.chooseOpenedFiles.value === true ) {

                self.detinationFolder = detinationFolderSelection;
                createPathString(UI.btnChooseFilesDestFold.title, detinationFolderSelection);
                UI.pnlAddCanvas.enabled = true;

                checkingIfWidthAndHeightIsNot0UnlockingBtn(UI.grpWidth.numb, UI.grpHeight.numb, UI.btnAccept);

            } else if (UI.btnRadSourceFiles.chooseFilesSourceFold.value === true) {

                self.detinationFolder = checkingIfDestFoldAndSourceFoldAreTheSame(UI, detinationFolderSelection, self.sourceFolderPathRecent);

            }
        }
    }
}

EventHandlerBuilder.prototype.startSettingsWidthAndHeight = function() {
    var UI = this.UI;

    checkingIfWidthAndHeightIsNot0UnlockingBtn(UI.grpWidth.numb, UI.grpHeight.numb, UI.btnAccept);
}

EventHandlerBuilder.prototype.onGrpWidthNumb = function() {
    var UI = this.UI;

    blockButtonByEdittext(UI.grpWidth.numb);

    UI.grpWidth.numb.onChanging = function() {

        sameInputField(UI.constrainsProportionsCheckbox, UI.grpWidth.numb, UI.grpHeight.numb);

        checkingIfWidthAndHeightIsNot0UnlockingBtn(UI.grpWidth.numb, UI.grpHeight.numb, UI.btnAccept);
    }
}

EventHandlerBuilder.prototype.onGrpWidthUnitsDropDown  = function() {
    var UI = this.UI;

    //Dropdownlist: setting the same units: "ADD %" and "ADD %"
    UI.grpWidth.unitsDropDown.onChange = function() {

        sameDropDown(UI.grpWidth.unitsDropDown, UI.grpHeight.unitDropDown);
    }

}

EventHandlerBuilder.prototype.tooltipWidthAndHeightImage = function() {
    var UI = this.UI;

    var tooltipValue = "You can substract number by adding '-' before value.\n" +
                        "Only characters avaible are: digits: [0-9] and signs: '-', '+'.\n" + 
                        "The only accepted value inside input field is integer."

    UI.grpWidth.imageTooltip.helpTip = tooltipValue;
    UI.grpHeight.imageTooltip.helpTip = tooltipValue;
}

EventHandlerBuilder.prototype.onGrpHeightNumb = function() {
    var UI = this.UI;

    blockButtonByEdittext(UI.grpHeight.numb);

    //Group Height
    UI.grpHeight.numb.onChanging = function() {

        sameInputField(UI.constrainsProportionsCheckbox, UI.grpHeight.numb, UI.grpWidth.numb);

        checkingIfWidthAndHeightIsNot0UnlockingBtn(UI.grpWidth.numb, UI.grpHeight.numb, UI.btnAccept);
    }
}

EventHandlerBuilder.prototype.onGrpHeightUnitDropDown = function() {
    var UI = this.UI;

    UI.grpHeight.unitDropDown.onChange = function() {
        sameDropDown(UI.grpHeight.unitDropDown, UI.grpWidth.unitsDropDown);
    }
}

EventHandlerBuilder.prototype.onGrpDlgUnitValImage = function() {
    var UI = this.UI;

    createTooltipToImage(UI.constrainsProportionsCheckbox, UI.grpDlgUnitValImage, UI.imageCnstrnsProportionTrue, UI.imageCnstrnsProportionFalse);
}

EventHandlerBuilder.prototype.onAnchorButtons = function() {
    var UI = this.UI;
    var self = this;

    //Default anchor position value
    self.anchorPostionValue = AnchorPosition.MIDDLECENTER;

    var anchorPositionButtons = new Array;
    anchorPositionButtons.push(UI.anchorPositionTOPLEFT, UI.anchorPositionTOPCENTER, UI.anchorPositionTOPRIGHT, UI.anchorPositionMIDDLELEFT, UI.anchorPositionMIDDLECENTER, UI.anchorPositionMIDDLERIGHT, UI.anchorPositionBOTTOMLEFT, UI.anchorPositionBOTTOMCENTER, UI.anchorPositionBOTTOMRIGHT);

    //Adding functionality to buttons in anchor box
    UI.anchorPositionTOPLEFT.onClick = function() {self.anchorPostionValue = anchorSetingNew(UI.anchorPositionTOPLEFT, AnchorPosition.TOPLEFT, anchorPositionButtons, UI.imageAnchorTrue, UI.imageAnchorFalse)}
    UI.anchorPositionTOPCENTER.onClick = function() {self.anchorPostionValue = anchorSetingNew(UI.anchorPositionTOPCENTER, AnchorPosition.TOPCENTER, anchorPositionButtons, UI.imageAnchorTrue, UI.imageAnchorFalse)}
    UI.anchorPositionTOPRIGHT.onClick = function() {self.anchorPostionValue = anchorSetingNew(UI.anchorPositionTOPRIGHT, AnchorPosition.TOPRIGHT, anchorPositionButtons, UI.imageAnchorTrue, UI.imageAnchorFalse)}

    UI.anchorPositionMIDDLELEFT.onClick = function() {self.anchorPostionValue = anchorSetingNew(UI.anchorPositionMIDDLELEFT, AnchorPosition.MIDDLELEFT, anchorPositionButtons, UI.imageAnchorTrue, UI.imageAnchorFalse)}
    UI.anchorPositionMIDDLECENTER.onClick = function() {self.anchorPostionValue = anchorSetingNew(UI.anchorPositionMIDDLECENTER, AnchorPosition.MIDDLECENTER, anchorPositionButtons, UI.imageAnchorTrue, UI.imageAnchorFalse)}
    UI.anchorPositionMIDDLERIGHT.onClick = function() {self.anchorPostionValue = anchorSetingNew(UI.anchorPositionMIDDLERIGHT, AnchorPosition.MIDDLERIGHT, anchorPositionButtons, UI.imageAnchorTrue, UI.imageAnchorFalse)}

    UI.anchorPositionBOTTOMLEFT.onClick = function() {self.anchorPostionValue = anchorSetingNew(UI.anchorPositionBOTTOMLEFT, AnchorPosition.BOTTOMLEFT, anchorPositionButtons, UI.imageAnchorTrue, UI.imageAnchorFalse)}
    UI.anchorPositionBOTTOMCENTER.onClick = function() {self.anchorPostionValue = anchorSetingNew(UI.anchorPositionBOTTOMCENTER, AnchorPosition.BOTTOMCENTER, anchorPositionButtons, UI.imageAnchorTrue, UI.imageAnchorFalse)}
    UI.anchorPositionBOTTOMRIGHT.onClick = function() {self.anchorPostionValue = anchorSetingNew(UI.anchorPositionBOTTOMRIGHT, AnchorPosition.BOTTOMRIGHT, anchorPositionButtons, UI.imageAnchorTrue, UI.imageAnchorFalse)}
}

EventHandlerBuilder.prototype.onConstrainsProportionsCheckbox = function() {
    var UI = this.UI;

    UI.constrainsProportionsCheckbox.onClick = function() {
        //Changing image of chains next to "Height" and "Width" edittext; Adding tolltips.
        createTooltipToImage(UI.constrainsProportionsCheckbox, UI.grpDlgUnitValImage, UI.imageCnstrnsProportionTrue, UI.imageCnstrnsProportionFalse);

        //Set the same "highest" value in "Height" and "Width"
        if (UI.constrainsProportionsCheckbox.value === true) {
            //If Height and Width is negative or equal 0, it set in both most negative number
            if((parseInt(UI.grpWidth.numb.text, 10) <= 0) && (parseInt(UI.grpHeight.numb.text, 10) <= 0)) {
                if (parseInt(UI.grpWidth.numb.text, 10) < parseInt(UI.grpHeight.numb.text, 10)) {
                    UI.grpWidth.numb.onChanging();
                }
                //If some value is positive, set in both most positive number
                else {
                    UI.grpHeight.numb.onChanging();
                }
            //If all values are positive set the highest one
            } else if ((parseInt(UI.grpWidth.numb.text, 10) > 0) || (parseInt(UI.grpHeight.numb.text, 10) > 0)) {
                if (parseInt(UI.grpWidth.numb.text, 10) > parseInt(UI.grpHeight.numb.text, 10)) {
                    UI.grpWidth.numb.onChanging();
                } else {
                    UI.grpHeight.numb.onChanging();
                }
            }
        }
    }

}

EventHandlerBuilder.prototype.tooltipConstrainsProportionsCheckbox = function() {
    var UI = this.UI;

    UI.constrainsProportionsCheckbox.helpTip =  "Check to constrain Height and Width";
}

EventHandlerBuilder.prototype.savingBGandFGtoRestoreLater = function() {
    var self = this;

    ///Saving BG and FG bucket color
    //Foregound bucket color
    self.bgColor = new SolidColor();
    self.bgColor.rgb.red = parseInt(app.backgroundColor.rgb.red, 10);
    self.bgColor.rgb.green = parseInt(app.backgroundColor.rgb.green, 10);
    self.bgColor.rgb.blue = parseInt(app.backgroundColor.rgb.blue, 10);

    //Background bucket color
    self.fgColor = new SolidColor();
    self.fgColor.rgb.red = parseInt(app.foregroundColor.rgb.red, 10);
    self.fgColor.rgb.green = parseInt(app.foregroundColor.rgb.green, 10);
    self.fgColor.rgb.blue = parseInt(app.foregroundColor.rgb.blue, 10);

}

EventHandlerBuilder.prototype.onCanvExtendColorDropDwn = function() {
    var UI = this.UI;
    var self = this;

    UI.canvExtendColor.dropDwn.onChange = function() {
        var canvExtendColorDropDwn = UI.canvExtendColor.dropDwn.selection.toString();//Full list to select canvExtendColor.values

        if (canvExtendColorDropDwn === "Foreground") {
            app.foregroundColor = self.bgColor;
            app.backgroundColor = self.fgColor;

        } else if (canvExtendColorDropDwn === "Background") {
            app.foregroundColor = self.fgColor;
            app.backgroundColor = self.bgColor;

        } else if (canvExtendColorDropDwn === "White") {
            app.backgroundColor.rgb.red = 255;
            app.backgroundColor.rgb.green = 255;
            app.backgroundColor.rgb.blue = 255;

        } else if (canvExtendColorDropDwn === "Black") {
            app.backgroundColor.rgb.red = 0;
            app.backgroundColor.rgb.green = 0;
            app.backgroundColor.rgb.blue = 0;

        } else if (canvExtendColorDropDwn === "Grey") {
            app.backgroundColor.rgb.red = 128;
            app.backgroundColor.rgb.green = 128;
            app.backgroundColor.rgb.blue = 128;

        } else if (canvExtendColorDropDwn === "Select color") {
            showColorPicker();
            app.backgroundColor = app.foregroundColor;
            app.foregroundColor = self.fgColor;
        }
    }
}

EventHandlerBuilder.prototype.onBtnAccept = function() {
    var UI = this.UI;
    var self = this;

    UI.btnAccept.onClick = function() {
        UI.mainWindow.close();

        var logFiles_ON_OFF = readValueOfSeetingsFromPrefFile('"SCRIPTUI_CHANGEDFILESLIST.TXT"- WRITE LOG')

        if (logFiles_ON_OFF === ':  ON ') {

        var listFile = createListFilePath();
        var b = listFile;
        var date = new Date;

        b.open("a");
        b.writeln("==== " + date + " ============================================================================================================");
        b.writeln("");
        b.close();

        }

        changeFileAndSave(self.sourceFilesToProcess, self.detinationFolder, 
            UI.grpWidth.numb.text, UI.grpHeight.numb.text, UI.grpWidth.unitsDropDown, self.anchorPostionValue, 
            UI.btnRadSourceFiles.chooseOpenedFiles, UI.btnRadSourceFiles.chooseFilesSourceFold, 
            UI.btnRadDestFold.same, UI.btnRadDestFold.other,
            self.fgColor, self.bgColor, UI.canvExtendColor.dropDwn.selection.toString(),
            self
            );

        if (logFiles_ON_OFF === ':  ON ') {

        var listFile = createListFilePath();
        var d = listFile;

        d.open("a");
        d.writeln("");
        d.close();

        }

        var scriptPath = $.fileName;
        var scriptName = getScriptName();
        var scriptFolder = getScriptFolder(scriptPath);

        var verbPastParticiple = scriptName.split(" ")[0] + "ed"; //"ed" regular form
        var noun = scriptName.split(" ")[1];

        if (self.counterChangedFilesTrue > 1) {
            var files = "files"
        } else if (self.counterChangedFilesTrue === 1) {
            var files = "file"
        }
        
        if (UI.btnRadSourceFiles.chooseOpenedFiles.value === true) {

            alert("You " + verbPastParticiple + " " + noun + " to " + self.counterChangedFilesTrue + " " + files);
            showUnsavedFilesAlert(self.counterChangedFilesFalse, scriptFolder);

            confrimDialog_DoYouWantCloseOpenedFiles(self.openedDocsToReopen);

        } else if (UI.btnRadSourceFiles.chooseFilesSourceFold.value === true) {

            var folderName = "";
            if (UI.btnRadDestFold.same.value === true) {
                folderName = decodeURIComponent(self.sourceFolderNameRecent); // string format is URl
            } else if (UI.btnRadDestFold.other.value === true) {
                folderName = decodeURIComponent(self.detinationFolder.name); // string format is URl
            }

            alert("You " + verbPastParticiple + " " + noun + " to " + self.counterChangedFilesTrue + " " + files + ",\nin folder: " + '"' + folderName + '"');
            showUnsavedFilesAlert(self.counterChangedFilesFalse, scriptFolder);

            if (typeof self.openDocsToRecover !== "undefined") {
                recoverOpenedFilesIfTheyWhereTheSameLikeInSourceFolder(self.openDocsToRecover);
            }
        }

    }
}

EventHandlerBuilder.prototype.onBtnCancel = function() {
    var UI = this.UI;

    UI.btnCancel.onClick = function() {
        UI.mainWindow.close();
    }
}

EventHandlerBuilder.prototype.onSettings = function() {
    var UI = this.UI;

    UI.btnSettings.onClick = function() {
        UI.mainWindow.close();
        UI.settingsWindow.show();
    }
}

EventHandlerBuilder.prototype.onPGNbyDefault = function() {

    var UI = this.UI;
    var self = this;

    self.notify_filterSourceFilesCheckbox_PNG = false;

    UI.settingsWindow.PNGbyDefault.btn.onClick = function() {

        var changedPreference = '"FILTER BY PNG"- CHECKBOX = TRUE';

        setValuesOfPrefs(changedPreference, UI.settingsWindow.PNGbyDefault.title);// Show user made change

        var PNGbyDefault_ON_OFF = readValueOfSeetingsFromPrefFile(changedPreference);
        if (PNGbyDefault_ON_OFF === ':  ON ') {
            UI.filterSourceFilesCheckbox.PNG.value = true; // To implement change of value of checkbox; You can't do notify when object is not showed

        } else if (PNGbyDefault_ON_OFF === ':  OFF') {
            UI.filterSourceFilesCheckbox.PNG.value = false; // To implement change of value of checkbox; You can't do notify when object is not showed
            
        }
        if (typeof self.sourceFilesPSDformat !== "undefined" || self.sourceFilesPSDformat === null) {
            UI.filterSourceFilesCheckbox.PNG.onClick();
        }
    }
}

EventHandlerBuilder.prototype.onDoNotShowCloseOpenedFiles = function() {

    var UI = this.UI;

    UI.settingsWindow.DoNotShowCloseOpenedFiles.btn.onClick = function() {

        var changedPreference = '"DO YOU WANT TO CLOSE ALL OPENED FILES"- DIALOG';

        setValuesOfPrefs(changedPreference, UI.settingsWindow.DoNotShowCloseOpenedFiles.title);// Show user made change

    }
}

EventHandlerBuilder.prototype.onLogFiles = function() {
    
    var UI = this.UI;

    UI.settingsWindow.logFiles.btn.onClick = function() {

        var changedPreference = '"SCRIPTUI_CHANGEDFILESLIST.TXT"- WRITE LOG';

        setValuesOfPrefs(changedPreference, UI.settingsWindow.logFiles.title);// Show user made change

    }
}

EventHandlerBuilder.prototype.onReturn = function() {

    var UI = this.UI;

    UI.settingsWindow.btnReturn.onClick = function() {

        UI.settingsWindow.close();

        UI.mainWindow.show();

    }
}

function createPrefFilePath() {
    
    var scriptPath = $.fileName;
    var scriptFolder = getScriptFolder(scriptPath);
    var listFile = new File(scriptFolder + "scriptUI_preferences.txt");
    return listFile;
}

function createListFilePath() {
    
    var scriptPath = $.fileName;
    var scriptFolder = getScriptFolder(scriptPath);
    var listFile = new File(scriptFolder + "scriptUI_changedFilesList.txt");
    return listFile;
}

function getScriptFolder(scriptPath) {
    return scriptPath.match(/^(.*[\\\/])/g); // match(/^(.*[\\\/])/g) "Select everything before the last forward slash" // replace(/\\/g, '/')
}

function buildListFilesIfItDoesntExists(listFile) {

    if (!listFile.exists) {

        var a = listFile;
        a.open("w");
        a.writeln("Processed files list:");
        a.writeln("");
        a.close();
    }
}

function buildPrefFilesIfItDoesntExists(listFile) {

    if (!listFile.exists) {

        var a = listFile;
        a.open("w");
        a.writeln("");
        a.writeln("ENABLED/DISABLED:");
        a.writeln("");
        a.writeln(' OFF: "FILTER BY PNG"- CHECKBOX = TRUE');
        a.writeln("");
        a.writeln(' ON : "DO YOU WANT TO CLOSE ALL OPENED FILES"- DIALOG');
        a.writeln("");
        a.writeln(' ON : "SCRIPTUI_CHANGEDFILESLIST.TXT"- WRITE LOG');

        a.close();
    }
}

function readValueOfSeetingsFromPrefFile(searchedPhrase) {

    var textArrayToWritie = [];
    var prefFile = createPrefFilePath();
    var b = prefFile;

    b.open('r');

    var numbOfTextLines = 0;
    while (!b.eof) {

        textArrayToWritie[numbOfTextLines] = b.readln();

        if (textArrayToWritie[numbOfTextLines].search('OFF: ' + searchedPhrase) != -1) { //It can't be == 1 and it can't work that way, but I have no idea why
            var textToReplace = ':  OFF';
            break;

        }
        else if (textArrayToWritie[numbOfTextLines].search('ON : ' + searchedPhrase) != -1) { //It can't be == 1 and it can't work that way, but I have no idea why
            var textToReplace = ':  ON ';
            break;

        }
        numbOfTextLines++;
    }
    
    return textToReplace;
}

function changeValueOffOnInPrefFile(searchedPhrase) {

    var textArrayToWritie = [];
    var prefFile = createPrefFilePath();
    var b = prefFile;

    b.open('r');

    var numbOfTextLines = 0;

    while (!b.eof) {

        textArrayToWritie[numbOfTextLines] = b.readln();

        if (textArrayToWritie[numbOfTextLines].search('ON : ' + searchedPhrase ) != -1) { //It can't be == 1 and can't work that way, but I have no idea why
            var textToReplace = 'OFF: ' + searchedPhrase;

            textArrayToWritie[numbOfTextLines] = textToReplace;
            var alertText = textToReplace;
        }

        else if (textArrayToWritie[numbOfTextLines].search('OFF: ' + searchedPhrase) != -1) { //It can't be == 1 and can't work that way, but I have no idea why
            var textToReplace = 'ON : ' + searchedPhrase;

            textArrayToWritie[numbOfTextLines] = textToReplace;
            var alertText = textToReplace;
        }

        numbOfTextLines++;
    }

    b.close();

    b.open('w');

    for (var i = 0; i < numbOfTextLines; i++) {
        b.writeln(textArrayToWritie[i]);
    }

    b.close();
    
    return alertText;
}

function setValuesOfPrefs(changedPreference, onOffValueNextToButton) {

    var alertText = changeValueOffOnInPrefFile(changedPreference);

    var updateValue = readValueOfSeetingsFromPrefFile(changedPreference);
    onOffValueNextToButton.text = updateValue;

    alert(alertText);
}

function filterSourceFilesCheckboxByExpressionEnabled(UI) {
    if (UI.filterSourceFilesCheckbox.byExpression.value === true) {
        UI.filterSourceFilesByExpression.enabled = true;
    }
    else if (UI.filterSourceFilesCheckbox.byExpression.value === false) {
        UI.filterSourceFilesByExpression.enabled = false;
    }
}

function filterFilesByCheckboxes( sourceFilesPSDformat, UI, UI_filterSourceFilesCheckbox_byExpression, UI_filterSourceFilesCheckbox_PNG) {

    var regex = convertStringIntoRegex(UI.filterSourceFilesByExpression.input);

    var sourceFilesByExpression = filterFilesByExpression(regex, sourceFilesPSDformat);

    var sourceFilesPNG = filterFilesByPNG(sourceFilesPSDformat);

    var sourceFilesPNGandByExpression = filterFilesByExpression(regex, sourceFilesPNG);


    if ((UI_filterSourceFilesCheckbox_byExpression.value === true) && (UI.filterSourceFilesByExpression.input.text !== "")) {

        if (UI_filterSourceFilesCheckbox_PNG.value === false) {

            var sourceFilesToProcess = sourceFilesByExpression;
        }
        else if (UI_filterSourceFilesCheckbox_PNG.value === true) {

            var sourceFilesToProcess = sourceFilesPNGandByExpression;
        }

    }
    else if ((UI_filterSourceFilesCheckbox_byExpression.value === false) || (UI.filterSourceFilesByExpression.input.text === "")) {

        if (UI_filterSourceFilesCheckbox_PNG.value === false) {

            var sourceFilesToProcess = sourceFilesPSDformat;
        }
        else if (UI_filterSourceFilesCheckbox_PNG.value === true) {

            var sourceFilesToProcess = sourceFilesPNG;
        }
    }

    return sourceFilesToProcess;
}

function convertStringIntoRegex(input) {

    var string = input.text;

    try {
        $.level = 0; // Debugging level, Level: 0 - No Break, 1 - Break, 2 - Immediate Break //Set to level: 0 to avoid notification "The document has not yet been saved".
        var regex = new RegExp(string);
        $.level = 1; //Set to level: 1 to reset debug
    }
    catch (e) {
        alert("The RegExpr is invalid:\n" + "/" + string + "/");
    }
    
    return regex;
}

function createPanelUI(objectParent, orientationChildren, alignChildren, alignmentObject) {
    
    var objectChildGroup = objectParent.add("panel");
    if (typeof orientationChildren !== "undefined") objectChildGroup.orientation = orientationChildren;
    objectChildGroup.alignChildren = alignChildren;
    objectChildGroup.alignment = alignmentObject;

    return objectChildGroup;
}

function createGroupUI(objectParent, orientationChildren, alignChildren, alignmentObject) {

    var objectChildGroup = objectParent.add("group");
    objectChildGroup.orientation = orientationChildren;
    objectChildGroup.alignChildren = alignChildren;
    objectChildGroup.alignment = alignmentObject;

    return objectChildGroup;
}

function btnChooseFilesSourceFoldEnabled(trueFalse, UI) {
    UI.btnChooseFilesSourceFold.enabled = trueFalse;
    UI.btnChooseFilesSourceFold.title.enabled = trueFalse;
}

function plnFilterFilesEnabled(trueFalse, UI) {

    if (trueFalse === true) {

        UI.filterSourceFilesCheckbox.enabled = true;
        UI.filterSourceFilesCheckbox.byExpression.enabled = true;
        filterSourceFilesCheckboxByExpressionEnabled(UI); // set to true

    } else if (trueFalse === false){

        UI.filterSourceFilesCheckbox.enabled = false;
        UI.filterSourceFilesByExpression.enabled = false;

    }
}

function btnChooseFilesDestFoldEnabled(trueFalse, UI) {
    UI.btnChooseFilesDestFold.enabled = trueFalse;
    UI.btnChooseFilesDestFold.title.enabled = trueFalse;
}

function btnsRadDestFoldEnabled(trueFalse, UI) {
    UI.btnRadDestFold.same.enabled = trueFalse;
    UI.btnRadDestFold.other.enabled = trueFalse;
}

function createPathString(textObject, path) {

    if (typeof path !== "string") {
        var string = decodeURIComponent(path.toString());  // string format is URl
    } else if (typeof path === "string") {
        var string = decodeURIComponent(path); // string format is URl
    }

    if (string.length > textObject.characters) {
        textObject.text = "..." + string.slice(-(textObject.characters));
    }
    else if (textObject.characters >= string.length) {
        textObject.text = string;
    }
}

function filteringSourceFiles(sourceFilesUnfiltered, properFilesExtPSfiles) {

    var sourceFilesFiltered = new Array;

    for (var i = 0; i < sourceFilesUnfiltered.length; i++) { 
        if (sourceFilesUnfiltered[i] instanceof File) {
            
            var sourceFilePathString = sourceFilesUnfiltered[i].toString();

            var sourceFileToMatch = decodeURIComponent(sourceFilePathString);

            if (sourceFileToMatch.match(properFilesExtPSfiles)) {// decodeURIComponent(), to avoid problem when you have special signs in source files and in byExpression

                sourceFilesFiltered[i] = sourceFilePathString; //You have to do in this way (not use push method), becouse later you need index value to match certain string with certain file in addingFilteredFilesToSourceFiles();
            } else {
                sourceFilesFiltered[i] = "";
            }

        } else {
            sourceFilesFiltered[i] = "";
        }
    }

    return sourceFilesFiltered;
}

function addingFilteredFilesToSourceFiles(sourceFilesUnfiltered, sourceFilesFiltered) {

    var sourceFiles = new Array;

    for (var i = 0; i < sourceFilesUnfiltered.length; i++) {

            if (sourceFilesFiltered[i] === sourceFilesUnfiltered[i].toString()) {
                sourceFiles.push(sourceFilesUnfiltered[i]);
            
        }
    }

    return sourceFiles;

}

function filterFilesByExpression(regex, unfilteredFiles) {

    var properFilesByExpression = regex;

    var sourceFilesFiltered = filteringSourceFiles( unfilteredFiles, properFilesByExpression);
    var sourceFilesByExpression = addingFilteredFilesToSourceFiles(unfilteredFiles, sourceFilesFiltered);

    return sourceFilesByExpression;

}

function filterFilesByPNG(unfilteredFiles) {

    var properFilesPNG = /.png$/;
    var sourceFilesFiltered = filteringSourceFiles(unfilteredFiles, properFilesPNG);
    var sourceFilesPNG = addingFilteredFilesToSourceFiles(unfilteredFiles, sourceFilesFiltered);

    return sourceFilesPNG;

}

function checkingIfItIsTheSameSourceFolderAsBefore(self) {

    var sameChoosedSourceFolderAsBefore = false;
    if ((typeof self.sourceFolderPathRecent !== "undefined") && (self.sourceFolder.toString() === self.sourceFolderPathRecent.toString())) {
        sameChoosedSourceFolderAsBefore = true;
    }
    return sameChoosedSourceFolderAsBefore;
}

function checkingIfDestFoldAndSourceFoldAreTheSame(UI, detinationFolderSelection, self_sourceFolderPathRecent) { // <--- used only in onBtnChooseFilesDestFold

    if ( detinationFolderSelection.toString() !== self_sourceFolderPathRecent.toString() ) {

    createPathString(UI.btnChooseFilesDestFold.title, detinationFolderSelection);
    checkingIfWidthAndHeightIsNot0UnlockingBtn(UI.grpWidth.numb, UI.grpHeight.numb, UI.btnAccept);
    UI.pnlAddCanvas.enabled = true;

    self_detinationFolder = detinationFolderSelection;
    } else if ( detinationFolderSelection.toString() === self_sourceFolderPathRecent.toString() ) {

    UI.btnRadDestFold.same.notify();

    createPathString(UI.btnChooseFilesDestFold.title, "Destination folder...");
    alert("Source folder and target folder are the same.\nNext time choose more wisely");

    self_detinationFolder = null; //to avoid bug
    }

    return self_detinationFolder;
}

/**
 * Restricts the character keys permitted in a `edittext` element.
 * @param {Object} editTextInstance - Reference to `edittext` ScriptUI element.
 */
function blockButtonByEdittext(editTextInstance) {

    if (editTextInstance.constructor.name !== 'EditText') {
      throw new Error ('Invalid class. Expected `EditText` class.')
    }
  
    var permissibleKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'Minus', 'Escape', 'Backspace', 'Enter'];
  
    editTextInstance.addEventListener('keydown', function (key) {
        var keyName = key.keyName;
        var shiftKeyIsDown = key.shiftKey;
        var altKeyIsDown = key.altKey;
  
    if (shiftKeyIsDown && keyName === 'Equal') {
        return;
    }
  
    if ((shiftKeyIsDown || altKeyIsDown) && inArray(keyName, permissibleKeys)) {
        key.preventDefault();
        return;
    }
  
    if (! inArray(keyName, permissibleKeys)) {
        key.preventDefault();
    }
    });
  }
  
/**
 * Determines whether an array includes a certain value among its elements.
 * @param {String} valueToFind - The value to search for.
 * @param {Array} arrayToSearch - The array to search in.
 * @returns {Boolean} true if the value valueToFind is found within the array
 */
  
function inArray(valueToFind, arrayToSearch) {
for (var i = 0, max = arrayToSearch.length; i < max; i++) {
    if (arrayToSearch[i] === valueToFind) {
        return true;
    }
}
return false;
}

function checkingIfWidthAndHeightIsNot0UnlockingBtn(Numb001, Numb002, btnEnabled) {

    if ((Numb001.text.match(/[0-9]+/) !== null) && (Numb002.text.match(/[0-9]+/) !== null) &&
        ((parseInt(Numb001.text, 10) !== 0) || (parseInt(Numb002.text, 10) !== 0)) ) { //there is only one possible bug when is equasion = 0, e. g. passing value = 1-1 = 0. In worst case scenario it happens nothing.

        btnEnabled.enabled = true;

    } else {

        btnEnabled.enabled = false;
    }

}

function sameInputField(condition, inputFieldToCopy, inputFieldToPasteIn) {
    if (condition.value === true) {
        inputFieldToPasteIn.text = inputFieldToCopy.text;
    }
}

function sameDropDown(objectEvent, objectSetSameValue) {
    if (objectEvent.selection.index !== objectSetSameValue.selection.index) {
        objectSetSameValue.selection = objectEvent.selection.index;
    }
}

function createTooltipToImage(condition, picture, pictureSourceTrue, pictureSourceFalse) {
    if (condition.value === true) {
        picture.image = pictureSourceTrue;
        picture.helpTip = "Width and Height same value anabled";
    }
    else if (condition.value === false) {
        picture.image = pictureSourceFalse;
        picture.helpTip = "Width and Height same value disabled";
    }
}

//Anchor button functionality
function anchorSetingNew(btnAnchorClickedOn, anchorPositionValue, anchorPostionButtons, imageAnchorTrue, imageAnchorFalse) {

    for (i = 0; i < anchorPostionButtons.length; i++){
        anchorPostionButtons[i].image = imageAnchorFalse;
    }

     //Setting cliked button to anchor
    btnAnchorClickedOn.image = imageAnchorTrue;

    //Sending information which anchor is marked for resizeCanvas()
    return anchorPositionValue;
}

//Used later to dispaly names of opened files
function docsOpenedFiles() {

    var openedDocsToProcess = new Array;
    var failed = false;
    var temp;
  
    for (var i = 0; i < app.documents.length; i++) {
      
        try 
        {
            failed = false;
            $.level = 0; // Debugging level, Level: 0 - No Break, 1 - Break, 2 - Immediate Break //Set to level: 0 to avoid notification "The document has not yet been saved".
            temp = app.documents[i].fullName; //catching "Error 8103: The document has not yet been saved."
            $.level = 1; //Set to level: 1 to reset debug
        }
        catch(e)
        {
            failed = true;
        }
        if(!failed)
        {
            openedDocsToProcess.push(app.documents[i]);
        }
    }
  
    return openedDocsToProcess;
}

function infoFilesUIUpdate(sourceFiles, numbOfDisplayedFiles, panelInfoUITitle, panelInfoUIwriteLines) {

    var prevDocNames = new Array;

    for (var i = 0; i < (numbOfDisplayedFiles + 1); i++) {
        prevDocNames[i] = "";
    }
    prevDocNames[0] = "no files to process";

    if (typeof sourceFiles === "undefined") {
        var filesNamesInfoUI = [];
    } else if (typeof sourceFiles !== "undefined") {
        var filesNamesInfoUI = new Array;
        for (var i = 0; i < sourceFiles.length; i++) {
            filesNamesInfoUI[i] = decodeURIComponent(sourceFiles[i].name);  // string format is URl
        }
    }

    //Writing files names
    if (filesNamesInfoUI.length > 0) {

        for (var i = 0; (i < numbOfDisplayedFiles) && (i < filesNamesInfoUI.length); i++) {

            prevDocNames[i] = filesNamesInfoUI[i];
        }

        var charComas = new Array;
        for (var i = 0; (i < numbOfDisplayedFiles) && (i < filesNamesInfoUI.length -1); i++) {

            charComas[i] = ",";
            prevDocNames[i] += charComas[i];
        }

        if (filesNamesInfoUI.length > numbOfDisplayedFiles) {

            prevDocNames[numbOfDisplayedFiles] = "(...)";
        }
    }

    infoUIwriteText(prevDocNames, filesNamesInfoUI.length, panelInfoUITitle, panelInfoUIwriteLines);
}
    


function infoUIwriteText(filesNames, filesNumbers, panelInfoUITitle, panelInfoUIwriteLines) {

    for (var i = 0; i < panelInfoUIwriteLines.length; i++) {
        panelInfoUIwriteLines[i].text = filesNames[i];
    }
    
    panelInfoUITitle.text =  "Files to process: " + filesNumbers;
}

function changeFileAndSave(sourceFiles, detinationFolder, 
    addWidth, addHeight, unitsList, anchor, 
    btnRadChooseFilesActiveDocs, btnRadChooseFilesSourceFold, 
    btnRadSameFolder, btnRadDestFoldOther, 
    fgColorPrevious, bgColorPrevious, canvExtendColorDropDwn,
    self) {

    //full list is in var AddCanvasDocUnits
    var unitsTypes = [
        ["ADD PX", "PX"],
        ["ADD %", "PERCENT"],
    ];
    
    var units = unitsTypes[parseInt(unitsList.selection, 10)][1];
    self.counterChangedFilesTrue = new Number(0);
    self.counterChangedFilesFalse = new Number(0);

    var logFiles_ON_OFF = readValueOfSeetingsFromPrefFile('"SCRIPTUI_CHANGEDFILESLIST.TXT"- WRITE LOG');

    //If you choose radio button "Opened files"
    if (btnRadChooseFilesActiveDocs.value === true){

        var docsToProcess = docsOpenedFiles();

        var previousSaveTimeSourceDoc = getModificationDate(docsToProcess); // This script must be executed first, because it will not be able to read the date value correctly if it will be executed just before save() or saveAs()

        for (var i = 0; i < docsToProcess.length; i++) {

            app.activeDocument = docsToProcess[i]; //setting active document from filtered files
            var doc = app.activeDocument;

            if( itHasBackgroundLayerChecker() ) {// To avoid bug with picking empty layer

            leftUpperCornerColorBGSet(canvExtendColorDropDwn === "Left upper corner color");

            }
            
            addCanvas(addWidth, addHeight, units, anchor);

            //If you choose radio button "Add canvas in the same folder", saves the same files in original location
            if (btnRadSameFolder.value === true) {
                doc.save();

                var currentSaveTime = doc.path.modified;
            
                var isFileSaved = saveFileValidation(previousSaveTimeSourceDoc[i], currentSaveTime, doc);
                
                counterSavedFiles(isFileSaved, self);

                if (logFiles_ON_OFF === ':  ON ') {
                    writeLnOfFile(i, doc, currentSaveTime, isFileSaved);
                }

            //If you choose radio button "Copy and Add canvas to other folder", save files in other folder
            } else if (btnRadDestFoldOther.value === true) {
                saveInDestFolder(detinationFolder);
                var currentSaveTime = new Date; // It couldn't retrieve this information from the path file

                var name = doc.name;
                var path = detinationFolder;
                var saveAsFile = File(path + "/" + name)

                var currentSaveTime = doc.path.modified;
            
                var isFileSaved = saveFileValidation(undefined, currentSaveTime, doc);
                
                counterSavedFiles(isFileSaved, self);

                if (logFiles_ON_OFF === ':  ON ') {
                    writeLnOfFile(i, saveAsFile, currentSaveTime, isFileSaved);
                }
            }

        }
    
    //If you choose  radio button "Source folder"
    } else if (btnRadChooseFilesSourceFold.value === true) {

        if (self.openedDocsToReopen.length > 0) {
            self.openDocsToRecover = new Array; // To avoid bug when source files are the same what opened. And reopen them at the end of script
        }

        for(var i = 0; i < sourceFiles.length; i++) {

            var previousSaveTimeSourceDoc = sourceFiles[i].path.modified;

            open(sourceFiles[i]);

            var doc = app.activeDocument;
            var openedDocPath = doc.fullName;

            if( itHasBackgroundLayerChecker() ) {// To avoid bug with picking empty layer

                leftUpperCornerColorBGSet(canvExtendColorDropDwn === "Left upper corner color");

            };
            
            addCanvas(addWidth, addHeight, units, anchor);

            //If you choose radio button "Add canvas in the same folder", saves the same files in original location
            if (btnRadSameFolder.value === true) {
                doc.save();

                var currentSaveTime = doc.path.modified;
            
                var isFileSaved = saveFileValidation(previousSaveTimeSourceDoc, currentSaveTime, doc);
                
                counterSavedFiles(isFileSaved, self);
                
                if (logFiles_ON_OFF === ':  ON ') {
                    writeLnOfFile(i, doc, currentSaveTime, isFileSaved);
                }

            //If you choose radio button "Copy and Add canvas to other folder", save files in other folder
            } else if (btnRadDestFoldOther.value === true) {

                saveInDestFolder(detinationFolder);
                var currentSaveTime = new Date; // It couldn't retrieve this information from the path file

                var name = doc.name;
                var path = detinationFolder;
                var saveAsFile = File(path + "/" + name);

                var currentSaveTime = doc.path.modified;
            
                var isFileSaved = saveFileValidation(undefined, currentSaveTime, doc);
                
                counterSavedFiles(isFileSaved, self);

                if (logFiles_ON_OFF === ':  ON ') {
                    writeLnOfFile(i, saveAsFile, currentSaveTime, isFileSaved);
                }
            }

            if (self.openedDocsToReopen.length > 0) {
                var fileToRecover = appendingDocToRecover(openedDocPath, self.openedDocsToReopen);
                if (fileToRecover !== null)
                    self.openDocsToRecover.push(fileToRecover); // To avoid bug // There is possiblity that previously opened doc in PS and in source folder are the same. So to prevend this, closed opened doc is retrieved at the end of work of script
            }

            doc.close();
        }
    }
alert(self.counterChangedFilesTrue);
    app.foregroundColor = fgColorPrevious;
    app.backgroundColor = bgColorPrevious;
}

function counterSavedFiles(isFileSaved, self) {
    
    if (isFileSaved)
        self.counterChangedFilesTrue++;
    if (!isFileSaved)
        self.counterChangedFilesFalse++;
}

function appendingDocToRecover(docToAppendPath, openedDocsPaths) {

    var recoverDocs = null;

    for (var i = 0; i < openedDocsPaths.length; i++) {

        if ( docToAppendPath.toString() === openedDocsPaths[i].toString() ) {
            var recoverDocs = openedDocsPaths[i];
            break;
        }
    }
    return recoverDocs;
}

function getModificationDate(docsToProcess) {

    var previousSaveTime = new Array;

    for (var i = 0; i < docsToProcess.length; i++) {
        previousSaveTime.push(docsToProcess[i].path.modified);
    }
    return previousSaveTime;
}

function writeLnOfFile(index, doc, currentSaveTime, isFileSaved) {

    var scriptName = getScriptName();

    var counter = ('00000' + (index + 1)).slice(-6); // Prefix 5 zeros, and get the last 6 chars

    var docName = decodeURIComponent(doc.name); // if doc is not objects of documents, but not opened in PS file somewhere in hard drive, you get URl format which you have to decode
    var docFullName = decodeURIComponent(doc.fullName);

    var listFile = createListFilePath();
    var c = listFile;

    c.open("a");
    c.writeln(counter + " save :" + isFileSaved.toString() + " <0> " + docName + " <1> " + scriptName + " <2> " + currentSaveTime + " <3> " + docFullName);
    c.close();
}

function getScriptName() {

    var pathScriptFile = $.fileName
    var string = decodeURIComponent(pathScriptFile);
    var match = "execute \- ";
    var textAfterLastMatch = string.slice(string.lastIndexOf(match) + match.length, -4);

    return textAfterLastMatch;
}

function leftUpperCornerColorBGSet(canvExtendColorDropDwn_IsLeftUpperCroner) {

    if (canvExtendColorDropDwn_IsLeftUpperCroner) {

        var doc = app.activeDocument;
        // Remove any Color Samplers that may already exist.
        doc.colorSamplers.removeAll();
        // deselct any selection that may already exist.
        doc.selection.deselect();
        // Get color sample from a given x,y coordinate.
        var pixelLoc = [0, 0];
        var colorSampleRef = doc.colorSamplers.add(pixelLoc);

        var sampledColor = colorSampleRef.color;
        // Set the foreground color to the sampled color.
        app.backgroundColor = sampledColor;
        colorSampleRef.remove();
    }
}

function itHasBackgroundLayerChecker() {

    var doc = app.activeDocument;
    var docLastLayer = doc.artLayers[doc.artLayers.length - 1];
    var itHasbackgroundLayer = docLastLayer.isBackgroundLayer;
    return itHasbackgroundLayer;
    
}

function addCanvas(addWidth, addHeight, units, anchor) {

    var doc = app.activeDocument;

    var mathWidthAndHeightResult = mathSumWidthAndHeight(units, addWidth, addHeight, doc);
    var sumWidth = mathWidthAndHeightResult[1];
    var sumHeight = mathWidthAndHeightResult[0];

    doc.resizeCanvas(UnitValue(sumWidth, units), UnitValue(sumHeight, units), anchor);
}

function mathSumWidthAndHeight(units, addWidth, addHeight, doc) {

    var activeDocWidth = parseInt(doc.width.toString().slice(0, -3), 10);
    var activeDocHeight = parseInt(doc.height.toString().slice(0, -3), 10);

    if (units === "PERCENT") {
        var sumWidth = 100 + parseInt(addWidth, 10); //Have to parse to Int becouse numb with decinamls cause bugs in resizeCanvas() function
        var sumHeight = 100 + parseInt(addHeight, 10); //Have to parse to Int becouse numb with decinamls cause bugs in resizeCanvas() function
    }
    else if (units === "PX") {
        var sumWidth = activeDocWidth + parseInt(addWidth, 10); //Have to parse to Int becouse numb with decinamls cause bugs in resizeCanvas() function
        var sumHeight = activeDocHeight + parseInt(addHeight, 10); //Have to parse to Int becouse numb with decinamls cause bugs in resizeCanvas() function
    }

    return [ sumWidth, sumHeight ];
}

function saveInDestFolder(detinationFolder) {

    var doc = app.activeDocument;

    //Declaring name of saved file
    var name = doc.name;

    var path = detinationFolder;

    var imageTypes = [
        [/.png$/, savePNG],
        [/.psd$/, savePSD],
        [/.jpg$/, saveJPEG],
        [/.tif$/, saveTIFF],
        [/.bmp$/, saveBMP],
        [/.gif$/, saveGIF],
    ];

    for( var j = 0 ; j < imageTypes.length; j++ ){
        if (name.match(imageTypes[j][0])) {

            var saveFile = File(path + "/" + name);
            if(saveFile.exists) {
                saveFile.remove();
            }

            (imageTypes[j][1])(saveFile);
            break;
        }
    }
    if (j === imageTypes.length) {

        throw new Error("Unhandled type for "+ name)
    }
}

function savePNG(saveFile) {
    
    var pngFile = new File(saveFile);
    var pngSaveOptions = new PNGSaveOptions();
    activeDocument.saveAs(pngFile, pngSaveOptions);
    
}

function savePSD(saveFile) {

    var psdFile = new File(saveFile);
    var psdSaveOptions = new PhotoshopSaveOptions();

    activeDocument.saveAs(psdFile, psdSaveOptions, false, Extension.LOWERCASE);
}


function saveJPEG(saveFile) {

    var jpegFile = new File(saveFile);
    var jpegSaveOptions = new JPEGSaveOptions();
    jpegSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
    jpegSaveOptions.quality = 10;

    activeDocument.saveAs(jpegFile, jpegSaveOptions, false, Extension.LOWERCASE);
}


function saveTIFF(saveFile) {

    var tiffFile = new File(saveFile);
    var tiffSaveOptions = new TiffSaveOptions();
    tiffSaveOptions.embedColorProfile = true;

    activeDocument.saveAs(tiffFile, tiffSaveOptions);
}


function saveBMP(saveFile) {

    var bmpFile = new File(saveFile);
    var bmpSaveOptions = new BMPSaveOptions();
    activeDocument.saveAs(bmpFile, bmpSaveOptions);

}

function saveGIF(saveFile) {

    var gifFile = new File(saveFile);
    var gifSaveOptions = new GIFSaveOptions();
    activeDocument.saveAs(gifFile, gifSaveOptions);

}

function confrimDialog_DoYouWantCloseOpenedFiles(openedDocs) {

    var DoNotShowCloseOpenedFiles_ON_OFF = readValueOfSeetingsFromPrefFile('"DO YOU WANT TO CLOSE ALL OPENED FILES"- DIALOG');

    if (DoNotShowCloseOpenedFiles_ON_OFF === ':  ON ') {
        var closeOpenedFilesConfirmation = confirm("Do you want to close all opened files?");

    } else if (DoNotShowCloseOpenedFiles_ON_OFF === ':  OFF') {
        var closeOpenedFilesConfirmation = false;

    }

    for (var i = 0; i < openedDocs.length; i++) {

        var activeDoc = openedDocs[i];
        activeDoc = app.activeDocument;
        activeDoc.close();
    }

    // To avoid bug with unability with "saving as" opened files again after evoking script again
    if (!closeOpenedFilesConfirmation) {
        for (var i = 0; i < openedDocs.length; i++) {
            open(openedDocs[i]);
        }
    }

}

function gettingFilesOpenedDocsToReopen() {

    var openedDocsToGetFiles = docsOpenedFiles();
    var openedDocsToReopen = new Array;
    for (var i = 0; i < openedDocsToGetFiles.length; i++) {
        openedDocsToReopen.push(openedDocsToGetFiles[i].fullName);
    }

    return openedDocsToReopen;
}

function recoverOpenedFilesIfTheyWhereTheSameLikeInSourceFolder(self_openDocsToRecover) {

    for (var i = 0; i < self_openDocsToRecover.length; i++) {

        open(self_openDocsToRecover[i]);
    }
}

function showUnsavedFilesAlert(self_counterChangedFilesFalse, scriptFolder) {

    if (self_counterChangedFilesFalse > 0) {
        alert("Save of " + self_counterChangedFilesFalse + " files was unseccesful.\nPlease check list of unsaved files in " + '"scriptUI_changedFilesList.txt" in folder: ' + scriptFolder);
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------

//Check the time of PREVIOUS save of the file against the save time of the CURRENT file
function saveFileValidation(previousSaveTime, currentSaveTime, savedFile) {
    
    if (typeof previousSaveTime === "undefined") {
        var previousSaveTime = dateAdd(currentSaveTime, 'second', -1); // add one second to accept validation when you saveAs source document/open document in target director 
    }

    if (checktime(previousSaveTime, currentSaveTime)) {
        //Call the file exists function
        var isFileSaved = imageExistsValidation(savedFile);

    } else {
        var isFileSaved = false;

    }
    
    return isFileSaved;
}

function checktime(previousSaveTime, currentSaveTime) {
    return previousSaveTime < currentSaveTime;
}

//Check to see if the file actually exists
function imageExistsValidation(savedFile) {
    var file = File(savedFile.path);
    if (file.exists) {
        return true;
    } else {
        return false;
    }
}

main();

function main() {

    appDataBuilder();

//-------------------------------------------------------------------------------------------------------------------------------
    
    var UI = new GuiBuilder();   

    UI.buildPanelSourceFiles();

    UI.buildPanelSourceFilesFilter();

    UI.buildPanelDestinationFolder();

    UI.buildPanelAddCanvas();

    UI.buildPanelInfoUI();

    UI.buildAcceptCancelSettingsButtons();

//-------------------------------------------------------------------------------------------------------------------------------

    var eventHandler = new EventHandlerBuilder( UI );

    eventHandler.onBtnRadChooseFilesActiveDocs();

    eventHandler.onBtnRadChooseFilesSourceFold();

    eventHandler.startSettingsUINumbofActiveDocs();

    eventHandler.onBtnChooseFilesSourceFold();

    eventHandler.onFilterSourceFilesCheckboxPNG();

    eventHandler.onFilterSourceFilesCheckboxByExpression();

    eventHandler.onFilterSourceFilesByExpressionInput();

    eventHandler.onBtnRadDestFoldSame();

    eventHandler.onBtnRadDestFoldOther();

    eventHandler.onBtnChooseFilesDestFold();

    eventHandler.startSettingsWidthAndHeight();

    eventHandler.onGrpWidthNumb();

    eventHandler.onGrpWidthUnitsDropDown();
    
    eventHandler.onGrpHeightNumb();
    
    eventHandler.onGrpHeightUnitDropDown();
    
    eventHandler.tooltipWidthAndHeightImage();

    eventHandler.onGrpDlgUnitValImage();

    eventHandler.onAnchorButtons();

    eventHandler.onConstrainsProportionsCheckbox();

    eventHandler.tooltipConstrainsProportionsCheckbox();

    eventHandler.savingBGandFGtoRestoreLater();

    eventHandler.onCanvExtendColorDropDwn();

    eventHandler.onBtnAccept();

    eventHandler.onBtnCancel();

    eventHandler.onSettings();

    eventHandler.onPGNbyDefault();

    eventHandler.onDoNotShowCloseOpenedFiles();

    eventHandler.onLogFiles();

    eventHandler.onReturn();

    UI.showMainWindow();
}



