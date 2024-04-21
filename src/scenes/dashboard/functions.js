const rotatorCuffStrength = (shoulderEr, shoulderIr, scaption, d2flexionRight, d2flexionLeft, d2extensionRight, d2extensionLeft) => {
    const amountEr = shoulderEr * .25
    const amountIr = shoulderIr * .25
    const amountScaption = scaption * .25
    const sumD2Pattern = ((d2flexionRight + d2flexionLeft + d2extensionRight + d2extensionLeft) / 4) * .25

    const cuffStrengthAverage = amountEr + amountIr + amountScaption + sumD2Pattern

    return cuffStrengthAverage.toFixed(2)
  }

  const rotationalPowerScore = (shotputPowerLeft, shotputPowerRight, trunkRotPowerLeft, trunkRotPowerRight, plyoRotPowerLeft, plyoRotPowerRight, mbScoopRight, mbScoopLeft, mbRotOhRight, mbRotOhLeft, level) => {
    let sumOfShotput = ((shotputPowerLeft + shotputPowerRight) / 2) * (level === 'High School' ? .25: .2)
    let sumOfTrunk = ((trunkRotPowerLeft + trunkRotPowerRight) / 2) * (level === 'High School' ? .25: .2)
    let sumOfPlyo = 0
    let sumOfScoop = ((mbScoopRight + mbScoopLeft) / 2) * (level === 'High School' ? .25: .2)
    let sumRotOH = ((mbRotOhRight + mbRotOhLeft) / 2) * (level === 'High School' ? .25: .2)

    if (level !== 'High School') {
      sumOfPlyo = ((plyoRotPowerLeft + plyoRotPowerRight) / 2) * .2;
    }
    const powerWeightedAverage = sumOfTrunk + sumOfShotput + sumOfPlyo + sumOfScoop + sumRotOH

    return powerWeightedAverage.toFixed(2)
  }

  // const rotationalAccelerationScore = (shotputAccelLeft, shotputAccelRight, trunkRotAccelLeft, trunkRotAccelRight, plyoRotAccelLeft, plyoRotAccelRight, level) => {
  //   let sumOfShotput = ((shotputAccelLeft + shotputAccelRight) / 2) * (level === 'High School' ? 0.5 : 0.35);
  //   let sumOfTrunk = ((trunkRotAccelLeft + trunkRotAccelRight) / 2) * (level === 'High School' ? 0.5 : 0.35);
  //   let sumOfPlyo = 0;
  
  //   if (level !== 'High School') {
  //     sumOfPlyo = ((plyoRotAccelLeft + plyoRotAccelRight) / 2) * 0.3;
  //   }
  
  //   const accelWeightedAverage = sumOfTrunk + sumOfShotput + sumOfPlyo;
  
  //   return accelWeightedAverage.toFixed(2);
  // };

  const rotationalAccelerationScore = (shotputAccelLeft, shotputAccelRight, trunkRotAccelLeft, trunkRotAccelRight, plyoRotAccelLeft, plyoRotAccelRight, level) => {
    console.log(shotputAccelLeft, shotputAccelRight, trunkRotAccelLeft, trunkRotAccelRight, plyoRotAccelLeft, plyoRotAccelRight, level);
    let sumOfShotput = ((shotputAccelLeft + shotputAccelRight) / 2);
    let sumOfTrunk = ((trunkRotAccelLeft + trunkRotAccelRight) / 2);
    let sumOfPlyo = 0;
  
    if (level !== 'High School') {
      sumOfPlyo = ((plyoRotAccelLeft + plyoRotAccelRight) / 2);
    }
  
    const shotputWeight = (level === 'High School' ? 0.5 : 0.35);
    const trunkWeight = (level === 'High School' ? 0.5 : 0.35);
    const plyoWeight = (level === 'High School' ? 0 : 0.3);
  
    const accelWeightedAverage = (sumOfShotput * shotputWeight) + (sumOfTrunk * trunkWeight) + (sumOfPlyo * plyoWeight);

    return accelWeightedAverage.toFixed(2);
  };

  const calculateProteusScore = (pressRight, pressLeft, rowRight, rowLeft, shotputRight, shotputLeft, trunkRight, trunkLeft, plyoRight, plyoLeft, flexionRight, flexionLeft, extensionRight, extensionLeft, weight, level) => {

    let sumOfTests = pressRight + pressLeft + rowLeft + rowRight + shotputLeft + shotputRight + trunkRight + trunkLeft + flexionLeft + flexionRight + extensionLeft + extensionRight;
    
    const numberOfTests = level === 'High School' ? 12 : 14;
    
    const bodyWeight = weight;
    
    if (level !== 'High School') {
      sumOfTests += plyoRight + plyoLeft;
    }
    
    const proteusScore = (sumOfTests / numberOfTests) / bodyWeight;

    
    return proteusScore.toFixed(2);
  };


  const calculateBodyFat = (chestFold, abdominalFold, thighFold, level) => {
    if (level === 'High School') {
      return " ";
    }
    const sumOfSkinfolds = chestFold + abdominalFold + thighFold;
    const squareOfSkinfolds = sumOfSkinfolds * sumOfSkinfolds;
    const age = 18; // Assuming age as 18
  
    const bodyDensity = 1.10938 - (0.0008267 * sumOfSkinfolds) + (0.0000016 * squareOfSkinfolds) - (0.0002574 * age);
    const bodyFatPercentage = (495 / bodyDensity) - 450;
  
    return bodyFatPercentage.toFixed(2); // Rounding to 2 decimal places
  };

  const milesPerHour = (seconds) => {
  const hours = seconds / 3600;
  const yardsPerHour = 30 / hours;
  const milesPerHour = yardsPerHour / 1760;

  return milesPerHour.toFixed(2); 
  }

  module.exports = {rotatorCuffStrength, rotationalPowerScore, rotationalAccelerationScore, calculateProteusScore, calculateBodyFat, milesPerHour}