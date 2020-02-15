EventHandlerBuilderMain.prototype.settingAcceptBtnBlock = function() {

    var UI = this.UI;
    var self = this;

    self.lockingUnlockingAcceptBtn = function checkingIfAreAnyDocsToProcess() {

        if (UI.btnRadSourceFiles.chooseOpenedFiles.value === true) {

            if (docsOpenedFiles().length > 0) {
        
                UI.btnAccept.enabled = true;
        
            } else if (docsOpenedFiles().length === 0) {
        
                UI.btnAccept.enabled = false;
            }

        } else if (UI.btnRadSourceFiles.chooseFilesSourceFold.value === true) {

            if (typeof self.sourceFilesToProcess !== "undefined" && self.sourceFilesToProcess.length > 0 ) {
                
                if ( (UI.btnRadDestFold.other.value === true && UI.btnChooseFilesDestFold.title.text !== "Destination folder...") || UI.btnRadDestFold.same.value === true) {

                    UI.btnAccept.enabled = true;
                } else {

                    UI.btnAccept.enabled = false;
                }
            } else if (typeof self.sourceFilesToProcess === "undefined" || self.sourceFilesToProcess.length === 0) {

                UI.btnAccept.enabled = false;
            }
        }

    }

    if (typeof self.lockingUnlockingAcceptBtn !== "function") {
        throw new Error('Object "self.lockingUnlockingAcceptBtn" is not a function');
    }
}

EventHandlerBuilderMain.prototype.onValueLowest = function() {
    var UI = this.UI;
    var self = this;

    restrictInputKeys(UI.grpBiggerThan.valueLowest);

    UI.grpBiggerThan.valueLowest.onChanging = function() {

        restrictValueUpTo(UI.maxResValue, UI.grpBiggerThan.valueLowest);

        self.lockingUnlockingAcceptBtn();
    }

    UI.grpBiggerThan.valueLowest.onChange = function() {

        setMinimalValueAt1(UI.grpBiggerThan.valueLowest);

        if(parseInt(UI.grpLowerThan.valueHighest.text, 10) < parseInt(UI.grpBiggerThan.valueLowest.text, 10)) {
            alert('"bigger than:" value can' + "'" + '"t be higher than "smaller than:" value')
            UI.grpBiggerThan.valueLowest.text = UI.grpLowerThan.valueHighest.text;
        }
    }
}

EventHandlerBuilderMain.prototype.tooltipvalueLowestAndValueHighest = function() {
    var UI = this.UI;

    var tooltipValue = "Written value in any input box has to be bigger than 1px and smaller than " + UI.maxResValue + 'px';

    UI.grpBiggerThan.imageTooltip.helpTip = tooltipValue;
    UI.grpLowerThan.imageTooltip.helpTip = tooltipValue;
}

EventHandlerBuilderMain.prototype.tooltipCanvExtendColor = function() {
    var UI = this.UI;

    UI.canvExtendColor.imageTooltip.helpTip = "Color is extended only in files with background layer";
}

EventHandlerBuilderMain.prototype.onValueHighest = function() {
    var UI = this.UI;
    var self = this;

    restrictInputKeys(UI.grpLowerThan.valueHighest);

    //Group Height
    UI.grpLowerThan.valueHighest.onChanging = function() {

        restrictValueUpTo(UI.maxResValue, UI.grpLowerThan.valueHighest);

        self.lockingUnlockingAcceptBtn();
    }

    UI.grpLowerThan.valueHighest.onChange = function() {

        setMinimalValueAt1(UI.grpLowerThan.valueHighest);

        if(parseInt(UI.grpLowerThan.valueHighest.text, 10) < parseInt(UI.grpBiggerThan.valueLowest.text, 10)) {
            alert('"smaller than:" value can' + "'" + '"t be lower than "bigger than:" value')
            UI.grpLowerThan.valueHighest.text = UI.grpBiggerThan.valueLowest.text;
        }
    }
}

EventHandlerBuilderMain.prototype.onCanvExtendColorDropDwn = function() {
    var UI = this.UI;
    var self = this;

    UI.canvExtendColor.dropDwn.onChange = function() {
        var canvExtendColorDropDwn = UI.canvExtendColor.dropDwn.selection.toString();//Full list to select canvExtendColor.values

        if (canvExtendColorDropDwn === "Foreground") { //:1
            app.foregroundColor = self.bgColor;
            app.backgroundColor = self.fgColor;

        } else if (canvExtendColorDropDwn === "Background") { //:2
            app.foregroundColor = self.fgColor;
            app.backgroundColor = self.bgColor;

        } else if (canvExtendColorDropDwn === "White") { //:3
            app.backgroundColor.rgb.red = 255;
            app.backgroundColor.rgb.green = 255;
            app.backgroundColor.rgb.blue = 255;

        } else if (canvExtendColorDropDwn === "Black") { //:4
            app.backgroundColor.rgb.red = 0;
            app.backgroundColor.rgb.green = 0;
            app.backgroundColor.rgb.blue = 0;

        } else if (canvExtendColorDropDwn === "Grey") { //:5
            app.backgroundColor.rgb.red = 128;
            app.backgroundColor.rgb.green = 128;
            app.backgroundColor.rgb.blue = 128;

        } else if (canvExtendColorDropDwn === "Select color") { //:6
            showColorPicker();
            app.backgroundColor = app.foregroundColor;
            app.foregroundColor = self.fgColor;
        } //else if (canvExtendColorDropDwn === "Left upper corner color") {leftUpperCornerColorBGSet() invoked in function changeFileAndSave} //:7
    }

    if (UI.canvExtendColor.dropDwn.children.length !== 7) { //Update this value if you make any changes Look↑↑↑
        throw new Error("Not all dropdowns items have assigned outcomes")
    }
}

EventHandlerBuilderMain.prototype.settingChangeFileAndSaveStartingFunction = function() {
    var UI = this.UI;
    var self = this;

    self.startingFunction = function filteringFilesByHeightAndWidthWithoutOpeningThemInPS() { // https://stackoverflow.com/questions/60191804/getting-width-and-height-of-image-without-need-of-opening-it-in-ps-cs6-script?noredirect=1#comment106489010_60191804

        if (typeof self.sourceFilesToProcess !== "undefined" && self.sourceFilesToProcess.length > 0) {

            ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");

            var sourceFilesTemp = new Array;

            for(var i = 0; i < self.sourceFilesToProcess.length; i++) {

                var file = new XMPFile(File(self.sourceFilesToProcess[i]).fsName, XMPConst.FILE_UNKNOWN, XMPConst.OPEN_FOR_READ);

                var xmp = file.getXMP();

                if( xmp.doesPropertyExist(XMPConst.NS_EXIF, "PixelXDimension" ) ) {

                    var width = parseInt(xmp.getProperty(XMPConst.NS_EXIF, "PixelXDimension" ), 10);
                
                    var height = parseInt(xmp.getProperty(XMPConst.NS_EXIF, "PixelYDimension" ), 10);
                
                    var highestValueSide = Math.max( width, height );

                    if (highestValueSide >= parseInt(UI.grpBiggerThan.valueLowest.text, 10) && highestValueSide <= parseInt(UI.grpLowerThan.valueHighest.text, 10) ) { 
                        sourceFilesTemp.push(self.sourceFilesToProcess[i]);
                    }
                } else { // This files does not have EXIF dimensions, so they will be checked during opening files
                    sourceFilesTemp.push(self.sourceFilesToProcess[i]);
                }    
            }
            return sourceFilesTemp;
        }
    }
}

EventHandlerBuilderMain.prototype.settingChangeFile = function() {
    var UI = this.UI;
    var self = this;

    self.changeFile = function TwotoNCanvas() {

        var doc = app.activeDocument;

        var activeDocWidth = parseInt(doc.width.toString().slice(0, -3), 10);
        var activeDocHeight = parseInt(doc.height.toString().slice(0, -3), 10);

        var highestValueSide = Math.max(activeDocWidth, activeDocHeight);

        if (highestValueSide < parseInt(UI.grpBiggerThan.valueLowest.text, 10) || highestValueSide > parseInt(UI.grpLowerThan.valueHighest.text, 10) ) { //todo
            return "continue";
        }
    
        if( itHasBackgroundLayerChecker() ) { // To avoid bug with picking empty layer
    
            leftUpperCornerColorBGSet(UI.canvExtendColor.dropDwn.selection.toString() === "Left upper corner color");
    
        }

        var ValueOfSides = nearestPow2( highestValueSide );

        if (ValueOfSides > UI.maxResValue) { //safety valve if for some weird reason value is higher // note: highest value to pass is 29 000 acording to documentation
            ValueOfSides = UI.maxResValue;
        }
    
        if ( isNaN(ValueOfSides) ) {
            throw new Error ("object is not a Number");
        }
    
        doc.resizeCanvas(UnitValue(ValueOfSides, "PX"), UnitValue(ValueOfSides, "PX"), AnchorPosition.MIDDLECENTER);
    }
}

EventHandlerBuilderMain.prototype.settingChangeFileAndSaveEndingFunction = function() {
    var UI = this.UI;
    var self = this;

    self.endingFunction = function doNothingAtTheEnd() {
        //nothing happen; this function has to be declared
    }
}


