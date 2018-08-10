class PlayingResult{
  constructor(timePassed, flippedCount){
    this.timePassed = timePassed;
    this.flippedCount = flippedCount;
  }
}

class PlayingStatistics{
  constructor(){
    this.resultsList = [];
  }

  addResult(result){
    this.resultsList.push(result);
  }

}
