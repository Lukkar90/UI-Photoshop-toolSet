function doesItHaveBackgroundLayer() {

    var doc = app.activeDocument;
    var docLastLayer = doc.artLayers[doc.artLayers.length - 1]; // In PS artLayer index starts at 1
    var itHasbackgroundLayer = docLastLayer.isBackgroundLayer; //Background layer is PS document property;
    return itHasbackgroundLayer;
    
}