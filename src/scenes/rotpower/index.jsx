import { Box, useTheme, TextField, Button, MenuItem, FormControl, Select, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableFooter, TableRow} from "@mui/material";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import * as yup from "yup";
import { formatDate } from "fullcalendar";
import { tokens } from "../../theme";

const initialValues = {
    player:'',
    level: ''
  }
  
  const bodySchema = yup.object().shape({
    player: yup.string().required(),
    level: yup.string().required(),
  })

const RotationalPower = () => {
  const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const isNonMobile = useMediaQuery("(min-width:600px)")

  const [upperPowerUsers, setUpperPowerUsers] = useState([])
  const [users, setUsers] = useState([])
  const [id, setId] = useState('');
  const [dataArray, setDataArray] = useState([]);
  const [levelId, setLevelId] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [levelDataArray, setLevelDataArray] = useState([]);
  const [mbRotOhRightPercentile, setMbRotOhRightPercentile] = useState(null)
  const [mbRotOhLeftPercentile, setMbRotOhLeftPercentile] = useState(null)
  const [mbScoopRightPercentile, setMbScoopRightPercentile] = useState(null)
  const [mbScoopLeftPercentile, setMbScoopLeftPercentile] = useState(null)
  const [shotputPowerRightPercentile, setShotputPowerRightPercentile] = useState(null)
  const [shotputPowerLeftPercentile, setShotputPowerLeftPercentile] = useState(null)
  const [trunkRotPowerRightPercentile, setTrunkRotPowerRightPercentile] = useState(null)
  const [trunkRotPowerLeftPercentile, setTrunkRotPowerLeftPercentile] = useState(null)
  const [plyoRotPowerRightPercentile, setPlyoRotPowerRightPercentile] = useState(null)
  const [plyoRotPowerLeftPercentile, setPlyoRotPowerLeftPercentile] = useState(null)
  const [mbRotOhRightChange, setMbRotOhRightChange] = useState(null)
  const [mbRotOhLeftChange, setMbRotOhLeftChange] = useState(null)
  const [mbScoopRightChange, setMbScoopRightChange] = useState(null)
  const [mbScoopLeftChange, setMbScoopLeftChange] = useState(null)
  const [shotputPowerRightChange, setShotputPowerRightChange] = useState(null);
  const [shotputPowerLeftChange, setShotputPowerLeftChange] = useState(null);
  const [trunkRotPowerRightChange, setTrunkRotPowerRightChange] = useState(null);
  const [trunkRotPowerLeftChange, setTrunkRotPowerLeftChange] = useState(null);
  const [plyoRotPowerRightChange, setPlyoRotPowerRightChange] = useState(null);
  const [plyoRotPowerLeftChange, setPlyoRotPowerLeftChange] = useState(null);
  

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:4000/api/users')
            const json = await response.json()
            if (response.ok) {
                setUsers(json)
            }
        }
        fetchUsers()
    }, [])

    useEffect(() => {
        const fetchUpperPowerUsers = async () => {
            const response = await fetch('http://localhost:4000/api/data')
            const json = await response.json()
            if (response.ok) {
                setUpperPowerUsers(json)
            }
        }
        fetchUpperPowerUsers()
    }, [])

    const handleFormSubmit = async (values, {resetForm}) => {
        resetForm()
        try {
        const dataUser = values.player
        setSelectedPlayer(dataUser)
        const response = await fetch(`http://localhost:4000/api/data/${dataUser}`);
        const json = await response.json();
        console.log(json)
        if (json.idArray.length > 0) {
          // Multiple documents found
          setId('');
          setDataArray(json.dataArray);
          //console.log(setId, setDataArray)
        } else if (json.id) {
          // Single document found
          setId(json.id);
          setDataArray([json.data]);
          // console.log(setId, setDataArray)
        } else {
          // No documents found
          setId('');
          setDataArray([]);
        }
        const userLevel = values.level
        const res = await fetch(`http://localhost:4000/api/info/${userLevel}`);
        const levelJson = await res.json();
        console.log(levelJson)
        if (levelJson.levelIdArray.length > 0) {
          // Multiple documents found
          setLevelId('');
          setLevelDataArray(levelJson.levelDataArray);
        } else if (levelJson.id) {
          setLevelId(levelJson.id);
          setLevelDataArray([levelJson.data]);
        } else {
          // No documents found
          setLevelId('');
          setLevelDataArray([]);
        }
      } catch (err) {
        console.error(err);
      }
    }

    const calculateAverage = (dataArray, attribute) => {
      let sum = 0;
      let count = 0;
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i][attribute] !== null) {
          sum += dataArray[i][attribute];
          count++;
        }
      }
      return (sum / count).toFixed(1);
    };

const averageShotputPowerRight = calculateAverage(levelDataArray, 'shotputPowerRight');
const averageShotputPowerLeft = calculateAverage(levelDataArray, 'shotputPowerLeft');
const averageTrunkPowerRight = calculateAverage(levelDataArray, 'trunkRotPowerRight');
const averageTrunkPowerLeft = calculateAverage(levelDataArray, 'trunkRotPowerLeft');
const averagePlyoPowerRight = calculateAverage(levelDataArray, 'plyoRotPowerRight');
const averagePlyoPowerLeft = calculateAverage(levelDataArray, 'plyoRotPowerLeft');
const averageMbScoopRight = calculateAverage(levelDataArray, 'mbScoopRight');
const averageMbScoopLeft = calculateAverage(levelDataArray, 'mbScoopLeft');
const averageMbRotOhRight = calculateAverage(levelDataArray, 'mbRotOhRight');
const averageMbRotOhLeft = calculateAverage(levelDataArray, 'mbRotOhLeft');


const userInput = selectedPlayer
const filteredRotOhRightPercentileArray = levelDataArray.filter(obj => obj.mbRotOhRight !== null);
const filteredRotOhRightArray = levelDataArray.filter(obj => obj.player === userInput && obj.mbRotOhRight !== null);
filteredRotOhRightPercentileArray.sort((a, b) => {
  if(a.mbRotOhRight !== b.mbRotOhRight) {
    return a.mbRotOhRight - b.mbRotOhRight
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredRotOhRightArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const rotOhRightPlayerOccurrences = filteredRotOhRightPercentileArray.filter(obj => obj.player === userInput);

//percentile MB ROT OH right
const mostRecentRotOhRightPlayerOccurrences = rotOhRightPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (rotOhRightPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentRotOhRightPlayerOccurrences[userInput];
    const index = filteredRotOhRightPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredRotOhRightPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setMbRotOhRightPercentile(wholePercentile);
    } else {
      setMbRotOhRightPercentile(null);
    }
  } else {
    setMbRotOhRightPercentile(null);
  }
}, [filteredRotOhRightPercentileArray, userInput, rotOhRightPlayerOccurrences, mostRecentRotOhRightPlayerOccurrences]);

//percentage change for MB ROT OH right
useEffect(() => {
  if (filteredRotOhRightArray.length > 1) {
    const currentIndex = filteredRotOhRightArray.findIndex((obj, index) => {
      if (index < filteredRotOhRightArray.length - 1) {
        return obj.createdAt !== filteredRotOhRightArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredRotOhRightArray[currentIndex].mbRotOhRight;
      const nextData = filteredRotOhRightArray[currentIndex + 1].mbRotOhRight;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setMbRotOhRightChange(changePercentage.toFixed(2));
    } else {
      setMbRotOhRightChange(null);
    }
  } else {
    setMbRotOhRightChange(null);
  }
}, [filteredRotOhRightArray]);


const filteredRotOhLeftPercentileArray = levelDataArray.filter(obj => obj.mbRotOhLeft !== null);
const filteredRotOhLeftArray = levelDataArray.filter(obj => obj.player === userInput && obj.mbRotOhLeft !== null);
filteredRotOhLeftPercentileArray.sort((a, b) => {
  if(a.mbRotOhLeft !== b.mbRotOhLeft) {
    return a.mbRotOhLeft - b.mbRotOhLeft
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredRotOhLeftArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const rotOhLeftPlayerOccurrences = filteredRotOhLeftPercentileArray.filter(obj => obj.player === userInput);

//percentile mb rot oh left
const mostRecentRotOhLeftPlayerOccurrences = rotOhLeftPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (rotOhLeftPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentRotOhLeftPlayerOccurrences[userInput];
    const index = filteredRotOhLeftPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredRotOhLeftPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setMbRotOhLeftPercentile(wholePercentile);
    } else {
      setMbRotOhLeftPercentile(null);
    }
  } else {
    setMbRotOhLeftPercentile(null);
  }
}, [filteredRotOhLeftPercentileArray, userInput, rotOhLeftPlayerOccurrences, mostRecentRotOhLeftPlayerOccurrences]);

//percentage change for MB ROT OH left
useEffect(() => {
  if (filteredRotOhLeftArray.length > 1) {
    const currentIndex = filteredRotOhLeftArray.findIndex((obj, index) => {
      if (index < filteredRotOhLeftArray.length - 1) {
        return obj.createdAt !== filteredRotOhLeftArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredRotOhLeftArray[currentIndex].mbRotOhLeft;
      const nextData = filteredRotOhLeftArray[currentIndex + 1].mbRotOhLeft;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setMbRotOhLeftChange(changePercentage.toFixed(2));
    } else {
      setMbRotOhLeftChange(null);
    }
  } else {
    setMbRotOhLeftChange(null);
  }
}, [filteredRotOhLeftArray]);


const filteredScoopRightPercentileArray = levelDataArray.filter(obj => obj.mbScoopRight !== null);
const filteredScoopRightArray = levelDataArray.filter(obj => obj.player === userInput && obj.mbScoopRight !== null);
filteredScoopRightPercentileArray.sort((a, b) => {
  if(a.mbScoopRight !== b.mbScoopRight) {
    return a.mbScoopRight - b.mbScoopRight
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredScoopRightArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const scoopRightPlayerOccurrences = filteredScoopRightPercentileArray.filter(obj => obj.player === userInput);

//percentile MB scoop toss right
const mostRecentScoopRightPlayerOccurrences = scoopRightPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (scoopRightPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentScoopRightPlayerOccurrences[userInput];
    const index = filteredScoopRightPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredScoopRightPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setMbScoopRightPercentile(wholePercentile);
    } else {
      setMbScoopRightPercentile(null);
    }
  } else {
    setMbScoopRightPercentile(null);
  }
}, [filteredScoopRightPercentileArray, userInput, scoopRightPlayerOccurrences, mostRecentScoopRightPlayerOccurrences]);

//percentage change for MB scoop toss right
useEffect(() => {
  if (filteredScoopRightArray.length > 1) {
    const currentIndex = filteredScoopRightArray.findIndex((obj, index) => {
      if (index < filteredScoopRightArray.length - 1) {
        return obj.createdAt !== filteredScoopRightArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredScoopRightArray[currentIndex].mbScoopRight;
      const nextData = filteredScoopRightArray[currentIndex + 1].mbScoopRight;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      console.log(currentData, nextData)
      setMbScoopRightChange(changePercentage.toFixed(2));
    } else {
      setMbScoopRightChange(null);
    }
  } else {
    setMbScoopRightChange(null);
  }
}, [filteredScoopRightArray]);


const filteredScoopLeftPercentileArray = levelDataArray.filter(obj => obj.mbScoopLeft !== null);
const filteredScoopLeftArray = levelDataArray.filter(obj => obj.player === userInput && obj.mbScoopLeft !== null);
filteredScoopLeftPercentileArray.sort((a, b) => {
  if(a.mbScoopLeft !== b.mbScoopLeft) {
    return a.mbScoopLeft - b.mbScoopLeft
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredScoopLeftArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const scoopLeftPlayerOccurrences = filteredScoopLeftPercentileArray.filter(obj => obj.player === userInput);

//percentile scoop left
const mostRecentScoopLeftPlayerOccurrences = scoopLeftPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (scoopLeftPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentScoopLeftPlayerOccurrences[userInput];
    const index = filteredScoopLeftPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredScoopLeftPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setMbScoopLeftPercentile(wholePercentile);
    } else {
      setMbScoopLeftPercentile(null);
    }
  } else {
    setMbScoopLeftPercentile(null);
  }
}, [filteredScoopLeftPercentileArray, userInput, scoopLeftPlayerOccurrences, mostRecentScoopLeftPlayerOccurrences]);

//percentage change for MB scoop toss left
useEffect(() => {
  if (filteredScoopLeftArray.length > 1) {
    const currentIndex = filteredScoopLeftArray.findIndex((obj, index) => {
      if (index < filteredScoopLeftArray.length - 1) {
        return obj.createdAt !== filteredScoopLeftArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredScoopLeftArray[currentIndex].mbScoopLeft;
      const nextData = filteredScoopLeftArray[currentIndex + 1].mbScoopLeft;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setMbScoopLeftChange(changePercentage.toFixed(2));
    } else {
      setMbScoopLeftChange(null);
    }
  } else {
    setMbScoopLeftChange(null);
  }
}, [filteredScoopLeftArray]);


const filteredShotputPowerRightPercentileArray = levelDataArray.filter(obj => obj.shotputPowerRight !== null);
const filteredShotputPowerRightArray = levelDataArray.filter(obj => obj.player === userInput && obj.shotputPowerRight !== null);
filteredShotputPowerRightPercentileArray.sort((a, b) => {
  if(a.shotputPowerRight !== b.shotputPowerRight) {
    return a.shotputPowerRight - b.shotputPowerRight
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredShotputPowerRightArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const shotputPowerRightPlayerOccurrences = filteredShotputPowerRightPercentileArray.filter(obj => obj.player === userInput);

//percentile shotput right
const mostRecentShotputRightPlayerOccurrences = shotputPowerRightPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (shotputPowerRightPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentShotputRightPlayerOccurrences[userInput];
    const index = filteredShotputPowerRightPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredShotputPowerRightPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setShotputPowerRightPercentile(wholePercentile);
    } else {
      setShotputPowerRightPercentile(null);
    }
  } else {
    setShotputPowerRightPercentile(null);
  }
}, [filteredShotputPowerRightPercentileArray, userInput, shotputPowerRightPlayerOccurrences, mostRecentShotputRightPlayerOccurrences]);

//percentage change for shotput power right
useEffect(() => {
  if (filteredShotputPowerRightArray.length > 1) {
    const currentIndex = filteredShotputPowerRightArray.findIndex((obj, index) => {
      if (index < filteredShotputPowerRightArray.length - 1) {
        return obj.createdAt !== filteredShotputPowerRightArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredShotputPowerRightArray[currentIndex].shotputPowerRight;
      const nextData = filteredShotputPowerRightArray[currentIndex + 1].shotputPowerRight;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setShotputPowerRightChange(changePercentage.toFixed(2));
    } else {
      setShotputPowerRightChange(null);
    }
  } else {
    setShotputPowerRightChange(null);
  }
}, [filteredShotputPowerRightArray]);


const filteredShotputPowerLeftPercentileArray = levelDataArray.filter(obj => obj.shotputPowerLeft !== null);
const filteredShotputPowerLeftArray = levelDataArray.filter(obj => obj.player === userInput && obj.shotputPowerLeft !== null);
filteredShotputPowerLeftPercentileArray.sort((a, b) => {
  if(a.shotputPowerLeft !== b.shotputPowerLeft) {
    return a.shotputPowerLeft - b.shotputPowerLeft
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredShotputPowerLeftArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const shotputPowerLeftPlayerOccurrences = filteredShotputPowerLeftPercentileArray.filter(obj => obj.player === userInput);

//percentile shotput left
const mostRecentShotputLeftPlayerOccurrences = shotputPowerLeftPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (shotputPowerLeftPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentShotputLeftPlayerOccurrences[userInput];
    const index = filteredShotputPowerLeftPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredShotputPowerLeftPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setShotputPowerLeftPercentile(wholePercentile);
    } else {
      setShotputPowerLeftPercentile(null);
    }
  } else {
    setShotputPowerLeftPercentile(null);
  }
}, [filteredShotputPowerLeftPercentileArray, userInput, shotputPowerLeftPlayerOccurrences, mostRecentShotputLeftPlayerOccurrences]);

//percentage change for shotput power left
useEffect(() => {
  if (filteredShotputPowerLeftArray.length > 1) {
    const currentIndex = filteredShotputPowerLeftArray.findIndex((obj, index) => {
      if (index < filteredShotputPowerLeftArray.length - 1) {
        return obj.createdAt !== filteredShotputPowerLeftArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredShotputPowerLeftArray[currentIndex].shotputPowerLeft;
      const nextData = filteredShotputPowerLeftArray[currentIndex + 1].shotputPowerLeft;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setShotputPowerLeftChange(changePercentage.toFixed(2));
    } else {
      setShotputPowerLeftChange(null);
    }
  } else {
    setShotputPowerLeftChange(null);
  }
}, [filteredShotputPowerLeftArray]);


const filteredTrunkRotPowerRightPercentileArray = levelDataArray.filter(obj => obj.trunkRotPowerRight !== null);
const filteredTrunkRotPowerRightArray = levelDataArray.filter(obj => obj.player === userInput && obj.trunkRotPowerRight !== null);
filteredTrunkRotPowerRightPercentileArray.sort((a, b) => {
  if(a.trunkRotPowerRight !== b.trunkRotPowerRight) {
    return a.trunkRotPowerRight - b.trunkRotPowerRight
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredTrunkRotPowerRightArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const trunkRotPowerRightPlayerOccurrences = filteredTrunkRotPowerRightPercentileArray.filter(obj => obj.player === userInput);

//percentile trunk right
const mostRecentTrunkRightPlayerOccurrences = trunkRotPowerRightPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (trunkRotPowerRightPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentTrunkRightPlayerOccurrences[userInput];
    const index = filteredTrunkRotPowerRightPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredTrunkRotPowerRightPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setTrunkRotPowerRightPercentile(wholePercentile);
    } else {
      setTrunkRotPowerRightPercentile(null);
    }
  } else {
    setTrunkRotPowerRightPercentile(null);
  }
}, [filteredTrunkRotPowerRightPercentileArray, userInput, trunkRotPowerRightPlayerOccurrences, mostRecentTrunkRightPlayerOccurrences]);

//percentage change for trunk rot power right
useEffect(() => {
  if (filteredTrunkRotPowerRightArray.length > 1) {
    const currentIndex = filteredTrunkRotPowerRightArray.findIndex((obj, index) => {
      if (index < filteredTrunkRotPowerRightArray.length - 1) {
        return obj.createdAt !== filteredTrunkRotPowerRightArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredTrunkRotPowerRightArray[currentIndex].trunkRotPowerRight;
      const nextData = filteredTrunkRotPowerRightArray[currentIndex + 1].trunkRotPowerRight;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setTrunkRotPowerRightChange(changePercentage.toFixed(2));
    } else {
      setTrunkRotPowerRightChange(null);
    }
  } else {
    setTrunkRotPowerRightChange(null);
  }
}, [filteredTrunkRotPowerRightArray]);


const filteredTrunkRotPowerLeftPercentileArray = levelDataArray.filter(obj => obj.trunkRotPowerLeft !== null);
const filteredTrunkRotPowerLeftArray = levelDataArray.filter(obj => obj.player === userInput && obj.trunkRotPowerLeft !== null);
filteredTrunkRotPowerLeftPercentileArray.sort((a, b) => {
  if(a.trunkRotPowerLeft !== b.trunkRotPowerLeft) {
    return a.trunkRotPowerLeft - b.trunkRotPowerLeft
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredTrunkRotPowerLeftArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const trunkRotPowerLeftPlayerOccurrences = filteredTrunkRotPowerLeftPercentileArray.filter(obj => obj.player === userInput);

//percentile trunk left
const mostRecentTrunkLeftPlayerOccurrences = trunkRotPowerLeftPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (trunkRotPowerLeftPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentTrunkLeftPlayerOccurrences[userInput];
    const index = filteredTrunkRotPowerLeftPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredTrunkRotPowerLeftPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setTrunkRotPowerLeftPercentile(wholePercentile);
    } else {
      setTrunkRotPowerLeftPercentile(null);
    }
  } else {
    setTrunkRotPowerLeftPercentile(null);
  }
}, [filteredTrunkRotPowerLeftPercentileArray, userInput, trunkRotPowerLeftPlayerOccurrences, mostRecentTrunkLeftPlayerOccurrences]);

//percentage change for trunk rot power left
useEffect(() => {
  if (filteredTrunkRotPowerLeftArray.length > 1) {
    const currentIndex = filteredTrunkRotPowerLeftArray.findIndex((obj, index) => {
      if (index < filteredTrunkRotPowerLeftArray.length - 1) {
        return obj.createdAt !== filteredTrunkRotPowerLeftArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredTrunkRotPowerLeftArray[currentIndex].trunkRotPowerLeft;
      const nextData = filteredTrunkRotPowerLeftArray[currentIndex + 1].trunkRotPowerLeft;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setTrunkRotPowerLeftChange(changePercentage.toFixed(2));
    } else {
      setTrunkRotPowerLeftChange(null);
    }
  } else {
    setTrunkRotPowerLeftChange(null);
  }
}, [filteredTrunkRotPowerLeftArray]);


const filteredPlyoRotPowerRightPercentileArray = levelDataArray.filter(obj => obj.plyoRotPowerRight !== null);
const filteredPlyoRotPowerRightArray = levelDataArray.filter(obj => obj.player === userInput && obj.plyoRotPowerRight !== null);
filteredPlyoRotPowerRightPercentileArray.sort((a, b) => {
  if(a.plyoRotPowerRight !== b.plyoRotPowerRight) {
    return a.plyoRotPowerRight - b.plyoRotPowerRight
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredPlyoRotPowerRightArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const plyoRotPowerRightPlayerOccurrences = filteredPlyoRotPowerRightPercentileArray.filter(obj => obj.player === userInput);

//percentile plyo right
const mostRecentPlyoRightPlayerOccurrences = plyoRotPowerRightPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (plyoRotPowerRightPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentPlyoRightPlayerOccurrences[userInput];
    const index = filteredPlyoRotPowerRightPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredPlyoRotPowerRightPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setPlyoRotPowerRightPercentile(wholePercentile);
    } else {
      setPlyoRotPowerRightPercentile(null);
    }
  } else {
    setPlyoRotPowerRightPercentile(null);
  }
}, [filteredPlyoRotPowerRightPercentileArray, userInput, plyoRotPowerRightPlayerOccurrences, mostRecentPlyoRightPlayerOccurrences]);

//percentage change for  plyo rot power right
useEffect(() => {
  if (filteredPlyoRotPowerRightArray.length > 1) {
    const currentIndex = filteredPlyoRotPowerRightArray.findIndex((obj, index) => {
      if (index < filteredPlyoRotPowerRightArray.length - 1) {
        return obj.createdAt !== filteredPlyoRotPowerRightArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredPlyoRotPowerRightArray[currentIndex].plyoRotPowerRight;
      const nextData = filteredPlyoRotPowerRightArray[currentIndex + 1].plyoRotPowerRight;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setPlyoRotPowerRightChange(changePercentage.toFixed(2));
    } else {
      setPlyoRotPowerRightChange(null);
    }
  } else {
    setPlyoRotPowerRightChange(null);
  }
}, [filteredPlyoRotPowerRightArray]);


const filteredPlyoRotPowerLeftPercentileArray = levelDataArray.filter(obj => obj.plyoRotPowerLeft !== null);
const filteredPlyoRotPowerLeftArray = levelDataArray.filter(obj => obj.player === userInput && obj.plyoRotPowerLeft !== null);
filteredPlyoRotPowerLeftPercentileArray.sort((a, b) => {
  if(a.plyoRotPowerLeft !== b.plyoRotPowerLeft) {
    return a.plyoRotPowerLeft - b.plyoRotPowerLeft
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredPlyoRotPowerLeftArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const plyoRotPowerLeftPlayerOccurrences = filteredPlyoRotPowerLeftPercentileArray.filter(obj => obj.player === userInput);

//percentile plyo left
const mostRecentPlyoLeftPlayerOccurrences = plyoRotPowerLeftPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (plyoRotPowerLeftPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentPlyoLeftPlayerOccurrences[userInput];
    const index = filteredPlyoRotPowerLeftPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredPlyoRotPowerLeftPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setPlyoRotPowerLeftPercentile(wholePercentile);
    } else {
      setPlyoRotPowerLeftPercentile(null);
    }
  } else {
    setPlyoRotPowerLeftPercentile(null);
  }
}, [filteredPlyoRotPowerLeftPercentileArray, userInput, plyoRotPowerLeftPlayerOccurrences, mostRecentPlyoLeftPlayerOccurrences]);

//percentage change for plyo rot power left
useEffect(() => {
  if (filteredPlyoRotPowerLeftArray.length > 1) {
    const currentIndex = filteredPlyoRotPowerLeftArray.findIndex((obj, index) => {
      if (index < filteredPlyoRotPowerLeftArray.length - 1) {
        return obj.createdAt !== filteredPlyoRotPowerLeftArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredPlyoRotPowerLeftArray[currentIndex].plyoRotPowerLeft;
      const nextData = filteredPlyoRotPowerLeftArray[currentIndex + 1].plyoRotPowerLeft;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setPlyoRotPowerLeftChange(changePercentage.toFixed(2));
    } else {
      setPlyoRotPowerLeftChange(null);
    }
  } else {
    setPlyoRotPowerLeftChange(null);
  }
}, [filteredPlyoRotPowerLeftArray]);

    return (
        <Box m={"20px"}>
             <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={"Rotational Power"} subtitle="Metrics: MB Rotational Overhead, MB Scoop Toss, Proteus Shotput, Proteus Trunk Rotations, Proteus Plyo Trunk Rotations"/>
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={bodySchema}
            >
                {({values, errors, touched, handleChange, handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
       <Box display="grid" gap="30px" gridTemplateColumns="repeat(8, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                        }}
                        >
        <TextField
   id="player"
    select
    label="Select Player"
    defaultValue=""
    onChange={handleChange}
          value={values.player}
          name="player"
          error={!!touched.player && !!errors.player}
          helperText={touched.player && errors.player}
          variant="filled"
          sx={{gridColumn: "span 8"}}
        >
          {users.map((option) => (
            <MenuItem key={option._id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
    
        <FormControl fullWidth
           sx={{gridColumn: "span 8"}}>
         <InputLabel id="demo-simple-select-label">Level</InputLabel>
        <Select
          labelId="demo-simple-select-"
          id="demo-simple-select"
         value={values.level}
          label="level"
          onChange={handleChange}
          name="level"
          variant="filled"
          sx={{gridColumn: "span 8"}}
            >
          <MenuItem value={"High School"}>High School</MenuItem>
          <MenuItem value={"College"}>College</MenuItem>
          <MenuItem value={"Pro"}>Professional</MenuItem>
          </Select>
          </FormControl>
          </Box>

        <Box display="flex" justifyContent="end" m="20px">
              <Button type="submit" color="secondary" variant="contained">
                Submit
              </Button>
            </Box>
                    </form>

                )}
            </Formik>
        </Box>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{fontSize: 14, color: colors.greenAccent[400]}}>Player Name</TableCell>
            <TableCell sx={{fontSize: 14, color: colors.greenAccent[400]}}>Date</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Rot OH (D)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Rot OH (N)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Scoop (D)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Scoop (N)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Shotput (D)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Shotput (N)</TableCell> 
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Trunk Rot (D)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Trunk Rot (N)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Plyo Trunk Rot (D)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Plyo Trunk Rot (N)</TableCell>           
          </TableRow>
        </TableHead>
        <TableBody>
          {dataArray.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16}}>
                {row.player}
              </TableCell>
              <TableCell sx={{fontSize: 16, color: colors.redAccent[400]}}>{formatDate(row.createdAt)}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.mbRotOhRight}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.mbRotOhLeft}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.mbScoopRight}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.mbScoopLeft}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.shotputPowerRight}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.shotputPowerLeft}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.trunkRotPowerRight}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.trunkRotPowerLeft}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.plyoRotPowerRight}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.plyoRotPowerLeft}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
        <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16, color: "#94e2cd"}}>
                Percentage Change
              </TableCell>
              <TableCell></TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ mbRotOhRightChange !== null ? mbRotOhRightChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ mbRotOhLeftChange !== null ? mbRotOhLeftChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ mbScoopRightChange !== null ? mbScoopRightChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ mbScoopLeftChange !== null ? mbScoopLeftChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ shotputPowerRightChange !== null ? shotputPowerRightChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ shotputPowerLeftChange !== null ? shotputPowerLeftChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ trunkRotPowerRightChange !== null ? trunkRotPowerRightChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ trunkRotPowerLeftChange !== null ? trunkRotPowerLeftChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ plyoRotPowerRightChange !== null ? plyoRotPowerRightChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ plyoRotPowerLeftChange !== null ? plyoRotPowerLeftChange : ""}</TableCell>
            </TableRow>
        <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16, color: '#868dfb'}}>
                Averages
              </TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}></TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageMbRotOhRight > 0 ? averageMbRotOhRight : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageMbRotOhLeft > 0 ? averageMbRotOhLeft : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageMbScoopRight > 0 ? averageMbScoopRight : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageMbScoopLeft > 0 ? averageMbScoopLeft : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageShotputPowerRight > 0 ? averageShotputPowerRight : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageShotputPowerLeft > 0 ? averageShotputPowerLeft : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageTrunkPowerRight > 0 ? averageTrunkPowerRight : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageTrunkPowerLeft > 0 ? averageTrunkPowerLeft : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averagePlyoPowerRight > 0 ? averagePlyoPowerRight : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averagePlyoPowerLeft > 0 ? averagePlyoPowerLeft : ""}</TableCell>
            </TableRow>
            <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16}}>
                Percentile
              </TableCell>
              <TableCell></TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ mbRotOhRightPercentile !== null ? mbRotOhRightPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ mbRotOhLeftPercentile !== null ? mbRotOhLeftPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ mbScoopRightPercentile !== null ? mbScoopRightPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ mbScoopLeftPercentile !== null ? mbScoopLeftPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ shotputPowerRightPercentile !== null ? shotputPowerRightPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ shotputPowerLeftPercentile !== null ? shotputPowerLeftPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ trunkRotPowerRightPercentile !== null ? trunkRotPowerRightPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ trunkRotPowerLeftPercentile !== null ? trunkRotPowerLeftPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ plyoRotPowerRightPercentile !== null ? plyoRotPowerRightPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ plyoRotPowerLeftPercentile !== null ? plyoRotPowerLeftPercentile : ""}</TableCell>
            </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
        </Box>
        
    )

}

export default RotationalPower;