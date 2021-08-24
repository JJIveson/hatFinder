const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const empty = '░';
const man = 'M';
const trail = '$';

//Create a class to model x and y positions.
class Position {
  //constructor method passing x and y as arguments
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  //Getter for each argument
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
}
//Create functions which are reused in the programme
//create a function to check if two items are in the same position
function posEquals(positionA, positionB) {
  if(positionA.getX() == positionB.getX() && positionA.getY() == positionB.getY()) {
    return true;
  } else {
    return false;
  }
}
//create a function to generate a random integer
function randomNumberGenerator(upperBound) {
  return Math.floor(Math.random()*upperBound);
}

//Create a class for the board
class Board {
  //Constructor with minimum data required to create board: width, height, manPosition, hatPosition + holeCreation
  constructor(holePercentage) {
    this.width = 20;
    this.height = 10;
    //Use position class to define man and hat position
    this.manPosition = new Position(0,0);
    this.hatPosition = new Position(randomNumberGenerator(this.width),randomNumberGenerator(this.height));
    //Ensure that the hat and man positions are different using posEquals function
    while(posEquals(this.manPosition, this.hatPosition)) {
      this.hatPosition = new Position(randomNumberGenerator(this.width),randomNumberGenerator(this.height));
    }
    //Hole property + generation
    this.holePositions = this.generateHoles(holePercentage);
    this.manPath = [];
  }
  //Define generateHoles() method + assign holes into array
  generateHoles(holePercentage) {
    let numberOfHoles = Math.floor(this.height*this.width*(holePercentage/100));
    let holes = [];
    //For i=0 until numberOfHoles required, generate a hole position. Nested within, while hole position generated is equal to hat or man, generate a new hole position. Then .push these holes into the hole array. Finally, need to return holes array as push creates new array
    for (let i=0; i<numberOfHoles; i++) {
      let possibleHolePosition = new Position(randomNumberGenerator(this.width), randomNumberGenerator(this.height));

      while(posEquals(possibleHolePosition, this.manPosition) || posEquals(possibleHolePosition, this.hatPosition)) {
        possibleHolePosition = new Position(randomNumberGenerator(this.width), randomNumberGenerator(this.height));
      }
      holes.push(possibleHolePosition);
    }
    return holes;
  }
  //Go Over this again
  positionIsAHole(positionToTest) {
    for(let i=0; i<this.holePositions.length; i++) {
      if(posEquals(positionToTest, this.holePositions[i])) {
        return true;
      }
    }
    return false;
  }

  areYouOutside() {
    if(this.manPosition.getX() < 0 || this.manPosition.getX() >= this.width || this.manPosition.getY() < 0 || this.manPosition.getY() >= this.height) {
      return true;
    }
    return false;
  }

  //Create a method for user input + change position of array
  userInput() {
    //Use prompt to allow user input.
    let input = prompt('Which way should we go?');
	 // let path = [];
  	//Define user input + change in manPosition
    this.manPath.push(this.manPosition);
    let pathPosition;
    if(input==='r') {
      let temp = this.manPosition.getX();
      temp++;
      this.manPosition = new Position(temp,this.manPosition.getY());
    } else if (input==='l') {
      let temp = this.manPosition.getX();
      temp--;
      this.manPosition = new Position(temp,this.manPosition.getY());
    } else if (input==='u') {
      let temp = this.manPosition.getY();
      temp--;
      this.manPosition = new Position((this.manPosition.getX()),temp);
    } else if (input==='d') {
      let temp = this.manPosition.getY();
      temp++;
      this.manPosition = new Position((this.manPosition.getX()),temp); ;
    } else {
      return 'Input either r, l, u or d';
    }
    console.log(this.printBoard());
    //Need to add a break condition before the loop is called back to break out
    if(posEquals(this.hatPosition, this.manPosition)) {
      console.log('You win');
    } else if(this.positionIsAHole(this.manPosition)) {
      console.log("You're in a hole! You lose.");
    } else if(this.areYouOutside()) {
      console.log("You've abandoned the search for your hat.");
    }
    else {
      this.userInput();
    }
    
  }
    positionIsPath(positionToTest) {
      for(let i=0; i<this.manPath.length; i++) {
        if(posEquals(positionToTest, this.manPath[i])) {
          return true;
        }
      }
      return false;
    }
  //Create a Method to print board
  printBoard() {
    let boardString = '';
    for(let w=0;w<this.height;w++) {
      for(let q=0;q<this.width;q++) {
        if(posEquals(new Position(q,w),this.manPosition)) {
          boardString = boardString + man;
        }
        else if(posEquals(new Position(q,w),this.hatPosition)) {
          boardString = boardString + hat;
        }
        else if(this.positionIsAHole(new Position(q,w))) {
          boardString = boardString + hole;
        }
        else if(this.positionIsPath(new Position(q,w))) {
          boardString = boardString + trail;
        }
        else {
          boardString = boardString + empty;
        }
      }
    
      boardString = boardString + '\n';
    }
    return boardString;
  }
}

const board = new Board(30);
console.log(board.printBoard());
board.userInput();