function shoppingList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var meals = ss.getSheetByName('Meals');
  var list = ss.getSheetByName('ShoppingList');

  var range = meals.getRange('E2:E24').getValues(); //getting checked values
  //var rangeList = list.getRange(1,1,1,2).getValues();

  //adding ingredients to shopping list
  var ingredList = [];
  for(var i=0; i < range.length; i++){
    if (range[i][0] == true) {
      var recipe = meals.getRange(i+2,2).getValue();//extracting name of recipe 
      var recipeSheet = ss.getSheetByName(recipe); //identifying recipe sheet
      if (recipeSheet) {
        var recipeLastRow = recipeSheet.getLastRow(); //last row of recipe
        var recipeRange = recipeSheet.getRange(2,1,recipeLastRow-1,3).getValues()//getting the rows of ingredients 
        for (var u=0; u < recipeRange.length; u++){
          ingredList.push(recipeRange[u]);
        }
      }
    }
  }

//declaring variables for duplicate discovery
var duplicateList = [[]];//declaring array to contain duplicates
var preDupLength = ingredList.length; //extracting length of shopping list BEFORE duplicates
var uniqueList = [];//declaring shopping list array without duplicates
var multipleDup = false;//multiple duplicates presence variable 
for (var q = 0; q < preDupLength-1; q++){
  multipleDup = false;
  for (var m = 0; m < preDupLength-1; m++){
    if (q != m){
      var checkIngred1 = ingredList[q][0];
      var checkIngred2 = ingredList[m][0];
      var checkMeasure1 = ingredList[q][2];
      var checkMeasure2 = ingredList[m][2];

      for (var d = 0; d < duplicateList.length; d++){
        if (checkIngred1 == duplicateList[d][0] && checkMeasure1 == duplicateList[d][1]){
          //duplicateList.splice(d,1);
          multipleDup = true;
        };
      }
      
      if (checkIngred1 == checkIngred2 && multipleDup == false && checkMeasure1 == checkMeasure2){//checking if duplicate present
        duplicateList.push([checkIngred1,checkMeasure1]);
      }
      if (checkIngred1 == checkIngred2 && multipleDup == false && checkMeasure1 != checkMeasure2){
        duplicateList.push([checkIngred1, checkMeasure1]);
      }
    }
  }
}

var multipleDup2 = false;

for (var w = 0; w < duplicateList.length; w++){
  multipleDup2 = false;
  for (var e = 0; e < preDupLength-1; e++){
    if (duplicateList[w][0] == ingredList[e][0] && duplicateList[w][1] == ingredList[e][2]){
      var quan = ingredList[e][1];
      if (multipleDup2 == false){ 
        uniqueList.push([ingredList[e][0], quan, ingredList[e][2]]);
        multipleDup2 = true;
      }
      else {
        var sumQuan = 0;
        for (var a = 0; a < uniqueList.length; a++){
          if (uniqueList[a][0] == ingredList[e][0] && uniqueList[a][2] == ingredList[e][2]){
            var quan2 = uniqueList[a][1];
            sumQuan = quan + quan2;
            uniqueList.splice(a,1);
            uniqueList.push([ingredList[e][0], sumQuan, ingredList[e][2]]);
          } 
        }
      }
      }
    }
  }

//adding other ingredients
var dup = false;
for (var z = 0; z < ingredList.length-1; z++) {
  dup = false;
  for (var p = 0; p < duplicateList.length; p++){
    if (ingredList[z][0] == duplicateList[p][0]){
      dup = true;
    }
  }
  if (dup == false){
    uniqueList.push(ingredList[z]);
  }
}

uniqueList.sort();
var postDupLength = uniqueList.length;

//servings
var servings = meals.getRange(12,9,1,1).getValues(); //extracting servings value
for (var q = 0; q < postDupLength; q++){ //looping through quantities
  uniqueList[q][1] = uniqueList[q][1]*servings;
}
list.deleteRows(2,preDupLength);//clearning list of ingredients
list.getRange('D2:D').insertCheckboxes();
list.getRange(2,1,postDupLength,3).setValues(uniqueList);
}
