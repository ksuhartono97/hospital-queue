/// patient object
function patient(first, last, idNum, arrivalTime) {
    this.firstName = first;
    this.lastName = last;
    this.idNum= idNum;
    this.arrivalTime = arrivalTime;
};


///// queue object

function Queue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = [];
    this._last = false;
}

// size
Queue.prototype.size = function() {
    return this._newestIndex - this._oldestIndex;
};

//enqueue
Queue.prototype.enqueue = function(data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};

// dequeue
Queue.prototype.dequeue = function() {
    var oldestIndex = this._oldestIndex,
        newestIndex = this._newestIndex,
        deletedData;

    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex];
        delete this._storage[oldestIndex];
        this._oldestIndex++;
        this._last=true;/// last time unit lastest user is dequeued
        console.log(this._last);
        return deletedData;
    }
};

//move the patient
function move(lineOffline,lineOnline){
  // online patient arrive
  if (lineOffline._last){
    if(lineOnline._storage[lineOnline._oldestIndex].arrivalTime
      <= lineOffline._storage[lineOffline._oldestIndex].arrivalTime ){
      var a = lineOnline.dequeue();

    }
    else {
      var a = lineOffline.dequeue();

    }
  }
  else  {
    var a= lineOffline.dequeue();

  }
  return a;
  }

//main

var lineOnline = new Queue();
var lineOffline = new Queue();
var aa = new patient("John", "Doe", 125045, 1130);
var bb = new patient("Sally", "Rally", 124348, 1149);
var cc = new patient("haha", "Doe", 125045, 1150);
var dd = new patient("hehe", "Doe", 125045, 1200);
lineOffline.enqueue(aa);
lineOffline.enqueue(cc);
/////////////////////////////
lineOnline.enqueue(bb);
lineOnline.enqueue(dd);

lineoffline.dequeue();

move(lineOffline,lineOnline);
console.log( lineOffline );
console.log("---------------")
console.log( lineOnline);
