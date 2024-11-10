const calculateSpeed = (originalDuration, estimatedDuration) => {
    const percentageDifference = ((estimatedDuration - originalDuration) / estimatedDuration) * 100;
    if(originalDuration===72001){
        console.log(percentageDifference)
        
    }
    switch (true) {
      case percentageDifference >= -20 && percentageDifference <= 20:
        return 0;
     
      case percentageDifference > 20 && percentageDifference <= 35:
        return 1;
    
      case percentageDifference > 35:
        return 2;
 
      case percentageDifference < -20 && percentageDifference >= -35:
        return -1;
       
      case percentageDifference < -35:
        return -2;
     
      default:
        return 'unknown';
    }
  };
module.exports = calculateSpeed;
  