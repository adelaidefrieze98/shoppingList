function clearList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var list = ss.getSheetByName('ShoppingList');

  lastRow = list.getLastRow();

  list.getRange(2,1,lastRow,3).clearContent();
}
