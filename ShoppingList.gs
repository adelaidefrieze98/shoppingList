function shoppingList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var meals = ss.getSheetByName('Meals');
  var list = ss.getSheetByName('ShoppingList');

  var range = meals.getRange('E2:E24').getValues(); //getting checked values

  var servings = meals.getRange(12,9,1,1).getValues(); //extracting servings value

  //adding ingredients to shopping list
  var ingredList = [];

  //declaring map to eliminate duplicates
  var uniqueMap = new Map();

  for(var i=0; i < range.length; i++){
    if (range[i][0] == true) {
      var recipe = meals.getRange(i+2,2).getValue();//extracting name of recipe 
      var recipeSheet = ss.getSheetByName(recipe); //identifying recipe sheet
      if (recipeSheet) {
        var recipeLastRow = recipeSheet.getLastRow(); //last row of recipe
        var recipeRange = recipeSheet.getRange(2,1,recipeLastRow-1,3).getValues()//getting the rows of ingredients 

        for (var q = 0; q < recipeRange.length; q++) {
          var name = recipeRange[q][0];
          var quantity = recipeRange[q][1]*servings;//multiplying by servings
          var measurement = recipeRange[q][2];
          var key = name + '&' + measurement; //declaring key to determine uniqueness of ingredient
          if(uniqueMap.has(key)){//if the ingredient already exists
            uniqueMap.set(key,uniqueMap.get(key) + quantity);
          } else {
            uniqueMap.set(key, quantity);
          }
        }
      }
    }
  }

//turning back into array
var uniqueList = [];
for (var [key, quantity] of uniqueMap) {
  var nameMeasurement = key.split("&");
  var name = nameMeasurement[0];
  var measurement = nameMeasurement[1];
  uniqueList.push([name,quantity,measurement]);
}

//sorting into alphabetical order
uniqueList.sort();

//assigning ingredients to Shopping List sheet
list.deleteRows(2,1000);//clearing list of ingredients
list.getRange('D2:D').insertCheckboxes();
list.getRange(2,1,uniqueList.length,3).setValues(uniqueList);
}
