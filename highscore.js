//import System.IO;
var filepath = "assets/hiscores.txt";
var file = new File(filepath);

function makeList(arr,n){
  var str = "<tr> <th>Rank</th> <th>Score</th> <th>Name</th> </tr>";
  for(var i = 0; i < n; i++){
    str += "<tr>";
    str += "<td>"+ i +"<td>"; //rank
    str += "<td>"+ arr[i].score +"<td>"; //score
    str += "<td>"+ arr[i].name +"</td>"; //Name
    str += "</tr>";
  }
  return str;
}

function writeScore(){
  var fs = require('fs');
  fs.writeFile('assets/hiscores.txt', 'test123', function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  });
}

function getScore(){
  var arr = [];
  var num;
  var name;
  var i = 0;
  file.open('r');
  while(!file.eof){

  }
}

function scoreElement(score,name){
  this.score = score;
  this.name = name;
}
