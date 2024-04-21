import { Box,useTheme, TextField, Button, MenuItem, FormControl, Select, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableFooter, TableRow} from "@mui/material";
import Header from "../../components/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect } from "react";
import { Formik, } from "formik";
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
  
const ArmStrength = () => {
  const theme = useTheme();
    const colors = tokens(theme.palette.mode)
    const isNonMobile = useMediaQuery("(min-width:600px)")

  const [strengthUsers, setStrengthUsers] = useState([])
  const [users, setUsers] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [id, setId] = useState('');
  const [dataArray, setDataArray] = useState([]);
  const [levelId, setLevelId] = useState('');
  const [levelDataArray, setLevelDataArray] = useState([]);
  const [scaptionPercentile, setScaptionPercentile] = useState(null)
  const [gripPercentile, setGripPercentile] = useState(null);
  const [d2FlexionRightPercentile, setd2FlexionRightPercentile] = useState(null)
  const [d2FlexionLeftPercentile, setd2FlexionLeftPercentile] = useState(null)
  const [d2ExtensionRightPercentile, setd2ExtensionRightPercentile] = useState(null)
  const [d2ExtensionLeftPercentile, setd2ExtensionLeftPercentile] = useState(null)
  const [shoulderErPercentile, setShoulderErPercentile] = useState(null)
  const [shoulderIrPercentile, setShoulderIrPercentile] = useState(null)
  const [scaptionChange, setScaptionChange] = useState(null);
  const [d2FlexionRightChange, setD2FlexionRightChange] = useState(null);
  const [d2FlexionLeftChange, setD2FlexionLeftChange] = useState(null);
  const [d2ExtensionRightChange, setD2ExtensionRightChange] = useState(null);
  const [d2ExtensionLeftChange, setD2ExtensionLeftChange] = useState(null);
  const [shoulderErChange, setShoulderErChange] = useState(null);
  const [shoulderIrChange, setShoulderIrChange] = useState(null);
  const [gripChange, setGripChange] = useState(null);
  
  

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
        const fetchStrengthUsers = async () => {
            const response = await fetch('http://localhost:4000/api/data')
            const json = await response.json()
            if (response.ok) {
                setStrengthUsers(json)
            }
        }
        fetchStrengthUsers()
    }, [])

    const handleFormSubmit = async (values, {resetForm}) => {
        resetForm()
        try {
        const dataUser = values.player
        setSelectedPlayer(dataUser)
        const response = await fetch(`http://localhost:4000/api/data/${dataUser}`);
        const json = await response.json();
        if (json.idArray.length > 0) {
          // Multiple documents found
          setId('');
          setDataArray(json.dataArray);
        } else if (json.id) {
          setId(json.id);
          setDataArray([json.data]);
        } else {
          // No documents found
          setId('');
          setDataArray([]);
        }
        const userLevel = values.level
        const res = await fetch(`http://localhost:4000/api/info/${userLevel}`);
        const levelJson = await res.json();
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

const averageShoulderEr = calculateAverage(levelDataArray, 'shoulderEr');
const averageShoulderIr = calculateAverage(levelDataArray, 'shoulderIr');
const averageScaption = calculateAverage(levelDataArray, 'scaption');
const averageGrip = calculateAverage(levelDataArray, 'grip');
const averageFlexionRight = calculateAverage(levelDataArray, 'd2flexionRight');
const averageFlexionLeft = calculateAverage(levelDataArray, 'd2flexionLeft');
const averageExtensionRight = calculateAverage(levelDataArray, 'd2extensionRight');
const averageExtensionLeft = calculateAverage(levelDataArray, 'd2extensionLeft');

const userInput = selectedPlayer

const filteredScaptionPercentileArray = levelDataArray.filter(obj => obj.scaption !== null);
const filteredScaptionArray = levelDataArray.filter(obj => obj.player === userInput && obj.scaption !== null);
filteredScaptionPercentileArray.sort((a, b) => {
  if(a.scaption !== b.scaption) {
    return a.scaption - b.scaption
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredScaptionArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

const scaptionPlayerOccurrences = filteredScaptionPercentileArray.filter(obj => obj.player === userInput);

//percentile scaption
const mostRecentScaptionPlayerOccurrences = scaptionPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (scaptionPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentScaptionPlayerOccurrences[userInput];
    const index = filteredScaptionPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index  / (filteredScaptionPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setScaptionPercentile(wholePercentile);
    } else {
      setScaptionPercentile(null);
    }
  } else {
    setScaptionPercentile(null);
  }
}, [filteredScaptionPercentileArray, userInput, scaptionPlayerOccurrences, mostRecentScaptionPlayerOccurrences]);

//percent change scaption
useEffect(() => {
  if (filteredScaptionArray.length > 1) {
    const currentIndex = filteredScaptionArray.findIndex((obj, index) => {
      if (index < filteredScaptionArray.length - 1) {
        return obj.createdAt !== filteredScaptionArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredScaptionArray[currentIndex].scaption;
      const nextData = filteredScaptionArray[currentIndex + 1].scaption;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setScaptionChange(changePercentage.toFixed(2));
    } else {
      setScaptionChange(null);
    }
  } else {
    setScaptionChange(null);
  }
}, [filteredScaptionArray]);

const filteredGripPercentileArray = levelDataArray.filter(obj => obj.grip !== null);
const filteredGripArray = levelDataArray.filter(obj => obj.player === userInput && obj.grip !== null);
filteredGripPercentileArray.sort((a, b) => {
  if(a.grip !== b.grip) {
    return a.grip - b.grip
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredGripArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const gripPlayerOccurrences = filteredGripPercentileArray.filter(obj => obj.player === userInput);

// //percentile grip 
const mostRecentGripPlayerOccurrences = gripPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (gripPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentGripPlayerOccurrences[userInput];
    const index = filteredGripPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredGripPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setGripPercentile(wholePercentile);
    } else {
      setGripPercentile(null);
    }
  } else {
    setGripPercentile(null);
  }
}, [filteredGripPercentileArray, userInput, gripPlayerOccurrences, mostRecentGripPlayerOccurrences]);

//percentage change grip
useEffect(() => {
  if (filteredGripArray.length > 1) {
    const currentIndex = filteredGripArray.findIndex((obj, index) => {
      if (index < filteredGripArray.length - 1) {
        return obj.createdAt !== filteredGripArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredGripArray[currentIndex].grip;
      const nextData = filteredGripArray[currentIndex + 1].grip;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setGripChange(changePercentage.toFixed(2));
    } else {
      setGripChange(null);
    }
  } else {
    setGripChange(null);
  }
}, [filteredGripArray]);


const filteredShoulderErPercentileArray = levelDataArray.filter(obj => obj.shoulderEr !== null);
const filteredShoulderErArray = levelDataArray.filter(obj => obj.player === userInput && obj.shoulderEr !== null);
filteredShoulderErPercentileArray.sort((a, b) => {
  if(a.shoulderEr !== b.shoulderEr) {
    return a.shoulderEr - b.shoulderEr
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredShoulderErArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const shoulderErPlayerOccurrences = filteredShoulderErPercentileArray.filter(obj => obj.player === userInput);

//percentile shoulder ER
const mostRecentShoulderErPlayerOccurrences = shoulderErPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (shoulderErPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentShoulderErPlayerOccurrences[userInput];
    const index = filteredShoulderErPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredShoulderErPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setShoulderErPercentile(wholePercentile);
    } else {
      setShoulderErPercentile(null);
    }
  } else {
    setShoulderErPercentile(null);
  }
}, [filteredShoulderErPercentileArray, userInput, shoulderErPlayerOccurrences, mostRecentShoulderErPlayerOccurrences]);

//percentage change for shoulder ER
useEffect(() => {
  if (filteredShoulderErArray.length > 1) {
    const currentIndex = filteredShoulderErArray.findIndex((obj, index) => {
      if (index < filteredShoulderErArray.length - 1) {
        return obj.createdAt !== filteredShoulderErArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredShoulderErArray[currentIndex].shoulderEr;
      const nextData = filteredShoulderErArray[currentIndex + 1].shoulderEr;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setShoulderErChange(changePercentage.toFixed(2));
    } else {
      setShoulderErChange(null);
    }
  } else {
    setShoulderErChange(null);
  }
}, [filteredShoulderErArray]);

const filteredShoulderIrPercentileArray = levelDataArray.filter(obj => obj.shoulderIr !== null);
const filteredShoulderIrArray = levelDataArray.filter(obj => obj.player === userInput && obj.shoulderIr !== null);
filteredShoulderIrPercentileArray.sort((a, b) => {
  if(a.shoulderIr !== b.shoulderIr) {
    return a.shoulderIr - b.shoulderIr
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredShoulderIrArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const shoulderIrPlayerOccurrences = filteredShoulderIrPercentileArray.filter(obj => obj.player === userInput);

//percentile shoulder IR
const mostRecentShoulderIrPlayerOccurrences = shoulderIrPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (shoulderIrPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentShoulderIrPlayerOccurrences[userInput];
    const index = filteredShoulderIrPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredShoulderIrPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setShoulderIrPercentile(wholePercentile);
    } else {
      setShoulderIrPercentile(null);
    }
  } else {
    setShoulderIrPercentile(null);
  }
}, [filteredShoulderIrPercentileArray, userInput, shoulderIrPlayerOccurrences, mostRecentShoulderIrPlayerOccurrences]);

//percentage change shoulder IR
useEffect(() => {
  if (filteredShoulderIrArray.length > 1) {
    const currentIndex = filteredShoulderIrArray.findIndex((obj, index) => {
      if (index < filteredShoulderIrArray.length - 1) {
        return obj.createdAt !== filteredShoulderIrArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredShoulderIrArray[currentIndex].shoulderIr;
      const nextData = filteredShoulderIrArray[currentIndex + 1].shoulderIr;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setShoulderIrChange(changePercentage.toFixed(2));
    } else {
      setShoulderIrChange(null);
    }
  } else {
    setShoulderIrChange(null);
  }
}, [filteredShoulderIrArray]);

const filteredD2FlexionRightPercentileArray = levelDataArray.filter(obj => obj.d2flexionRight !== null);
const filteredD2FlexionRightArray = levelDataArray.filter(obj => obj.player === userInput && obj.d2flexionRight !== null);
filteredD2FlexionRightPercentileArray.sort((a, b) => {
  if(a.d2flexionRight !== b.d2flexionRight) {
    return a.d2flexionRight - b.d2flexionRight
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredD2FlexionRightArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const d2FlexionRightPlayerOccurrences = filteredD2FlexionRightPercentileArray.filter(obj => obj.player === userInput);

//percentile d2 flexion right
const mostRecentD2FlexionRightPlayerOccurrences = d2FlexionRightPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (d2FlexionRightPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentD2FlexionRightPlayerOccurrences[userInput];
    const index = filteredD2FlexionRightPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredD2FlexionRightPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setd2FlexionRightPercentile(wholePercentile);
    } else {
      setd2FlexionRightPercentile(null);
    }
  } else {
    setd2FlexionRightPercentile(null);
  }
}, [filteredD2FlexionRightPercentileArray, userInput, d2FlexionRightPlayerOccurrences, mostRecentD2FlexionRightPlayerOccurrences]);

//percentage change d2 flexion right
useEffect(() => {
  if (filteredD2FlexionRightArray.length > 1) {
    const currentIndex = filteredD2FlexionRightArray.findIndex((obj, index) => {
      if (index < filteredD2FlexionRightArray.length - 1) {
        return obj.createdAt !== filteredD2FlexionRightArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredD2FlexionRightArray[currentIndex].d2flexionRight;
      const nextData = filteredD2FlexionRightArray[currentIndex + 1].d2flexionRight;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setD2FlexionRightChange(changePercentage.toFixed(2));
    } else {
      setD2FlexionRightChange(null);
    }
  } else {
    setD2FlexionRightChange(null);
  }
}, [filteredD2FlexionRightArray]);

const filteredD2FlexionLeftPercentileArray = levelDataArray.filter(obj => obj.d2flexionLeft !== null);
const filteredD2FlexionLeftArray = levelDataArray.filter(obj => obj.player === userInput && obj.d2flexionLeft !== null);
filteredD2FlexionLeftPercentileArray.sort((a, b) => {
  if(a.d2flexionLeft !== b.d2flexionLeft) {
    return a.d2flexionLeft - b.d2flexionLeft
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredD2FlexionLeftArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const d2FlexionLeftPlayerOccurrences = filteredD2FlexionLeftPercentileArray.filter(obj => obj.player === userInput);

//percentile d2 flexion left
const mostRecentD2FlexionLeftPlayerOccurrences = d2FlexionLeftPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (d2FlexionLeftPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentD2FlexionLeftPlayerOccurrences[userInput];
    const index = filteredD2FlexionLeftPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredD2FlexionLeftPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setd2FlexionLeftPercentile(wholePercentile);
    } else {
      setd2FlexionLeftPercentile(null);
    }
  } else {
    setd2FlexionLeftPercentile(null);
  }
}, [filteredD2FlexionLeftPercentileArray, userInput, d2FlexionLeftPlayerOccurrences, mostRecentD2FlexionLeftPlayerOccurrences]);

//percentage change d2 flexion left
useEffect(() => {
  if (filteredD2FlexionLeftArray.length > 1) {
    const currentIndex = filteredD2FlexionLeftArray.findIndex((obj, index) => {
      if (index < filteredD2FlexionLeftArray.length - 1) {
        return obj.createdAt !== filteredD2FlexionLeftArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredD2FlexionLeftArray[currentIndex].d2flexionLeft;
      const nextData = filteredD2FlexionLeftArray[currentIndex + 1].d2flexionLeft;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setD2FlexionLeftChange(changePercentage.toFixed(2));
    } else {
      setD2FlexionLeftChange(null);
    }
  } else {
    setD2FlexionLeftChange(null);
  }
}, [filteredD2FlexionLeftArray]);

const filteredD2ExtensionRightPercentileArray = levelDataArray.filter(obj => obj.d2extensionRight !== null);
const filteredD2ExtensionRightArray = levelDataArray.filter(obj => obj.player === userInput && obj.d2extensionRight !== null);
filteredD2ExtensionRightPercentileArray.sort((a, b) => {
  if(a.d2extensionRight !== b.d2extensionRight) {
    return a.d2extensionRight - b.d2extensionRight
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredD2ExtensionRightArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const d2ExtensionRightPlayerOccurrences = filteredD2ExtensionRightPercentileArray.filter(obj => obj.player === userInput);

//percentile d2 extension right
const mostRecentD2ExtensionRightPlayerOccurrences = d2ExtensionRightPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (d2ExtensionRightPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentD2ExtensionRightPlayerOccurrences[userInput];
    const index = filteredD2ExtensionRightPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredD2ExtensionRightPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setd2ExtensionRightPercentile(wholePercentile);
    } else {
      setd2ExtensionRightPercentile(null);
    }
  } else {
    setd2ExtensionRightPercentile(null);
  }
}, [filteredD2ExtensionRightPercentileArray, userInput, d2ExtensionRightPlayerOccurrences, mostRecentD2ExtensionRightPlayerOccurrences]);

//percentage change d2extension right
useEffect(() => {
  if (filteredD2ExtensionRightArray.length > 1) {
    const currentIndex = filteredD2ExtensionRightArray.findIndex((obj, index) => {
      if (index < filteredD2ExtensionRightArray.length - 1) {
        return obj.createdAt !== filteredD2ExtensionRightArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredD2ExtensionRightArray[currentIndex].d2extensionRight;
      const nextData = filteredD2ExtensionRightArray[currentIndex + 1].d2extensionRight;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setD2ExtensionRightChange(changePercentage.toFixed(2));
    } else {
      setD2ExtensionRightChange(null);
    }
  } else {
    setD2ExtensionRightChange(null);
  }
}, [filteredD2ExtensionRightArray]);

const filteredD2ExtensionLeftPercentileArray = levelDataArray.filter(obj => obj.d2extensionLeft !== null);
const filteredD2ExtensionLeftArray = levelDataArray.filter(obj => obj.player === userInput && obj.d2extensionLeft !== null);
filteredD2ExtensionLeftPercentileArray.sort((a, b) => {
  if(a.d2extensionLeft !== b.d2extensionLeft) {
    return a.d2extensionLeft - b.d2extensionLeft
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredD2ExtensionLeftArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const d2ExtensionLeftPlayerOccurrences = filteredD2ExtensionLeftPercentileArray.filter(obj => obj.player === userInput);

//percentile d2 extension left
const mostRecentD2ExtensionLeftPlayerOccurrences = d2ExtensionLeftPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (d2ExtensionLeftPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentD2ExtensionLeftPlayerOccurrences[userInput];
    const index = filteredD2ExtensionLeftPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredD2ExtensionLeftPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setd2ExtensionLeftPercentile(wholePercentile);
    } else {
      setd2ExtensionLeftPercentile(null);
    }
  } else {
    setd2ExtensionLeftPercentile(null);
  }
}, [filteredD2ExtensionLeftPercentileArray, userInput, d2ExtensionLeftPlayerOccurrences, mostRecentD2ExtensionLeftPlayerOccurrences]);


//percentage change d2 extension left
useEffect(() => {
  if (filteredD2ExtensionLeftArray.length > 1) {
    const currentIndex = filteredD2ExtensionLeftArray.findIndex((obj, index) => {
      if (index < filteredD2ExtensionLeftArray.length - 1) {
        return obj.createdAt !== filteredD2ExtensionLeftArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredD2ExtensionLeftArray[currentIndex].d2extensionLeft;
      const nextData = filteredD2ExtensionLeftArray[currentIndex + 1].d2extensionLeft;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setD2ExtensionLeftChange(changePercentage.toFixed(2));
    } else {
      setD2ExtensionLeftChange(null);
    }
  } else {
    setD2ExtensionLeftChange(null);
  }
}, [filteredD2ExtensionLeftArray]);

    return (
        <Box m={"20px"}>
             <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={"Arm Strength"} subtitle="Metrics: Shoulder ER, Shoulder IR, Scaption, Grip Strength, D2 Flexion, D2 Extension"/>
        
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
            <TableCell sx={{fontSize: 16, color: colors.greenAccent[400]}}>Player Name</TableCell>
            <TableCell sx={{fontSize: 16, color: colors.greenAccent[400]}}>Date</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Scaption</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>D2 Flexion (D)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>D2 Flexion (N)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>D2 Extension (D)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>D2 Extension (N)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Shoulder ER</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Shoulder IR</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Grip</TableCell>
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
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.scaption}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.d2flexionRight}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.d2flexionLeft}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.d2extensionRight}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.d2extensionLeft}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.shoulderEr}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.shoulderIr}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.grip}</TableCell>
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
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ scaptionChange !== null ? scaptionChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ d2FlexionRightChange !== null ? d2FlexionRightChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ d2FlexionLeftChange !== null ? d2FlexionLeftChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ d2ExtensionRightChange !== null ? d2ExtensionRightChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ d2ExtensionLeftChange !== null ? d2ExtensionLeftChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ shoulderErChange !== null ? shoulderErChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ shoulderIrChange !== null ? shoulderIrChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ gripChange !== null ? gripChange : ""}</TableCell>
            </TableRow>
        <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16, color: '#868dfb'}}>
                Averages
              </TableCell>
              <TableCell align="right" sx={{fontSize: 16}}></TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageScaption > 0 ? averageScaption: ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageFlexionRight > 0 ? averageFlexionRight : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageFlexionLeft > 0 ? averageFlexionLeft : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageExtensionRight > 0 ? averageExtensionRight : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageExtensionLeft > 0 ? averageExtensionLeft: ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageShoulderEr > 0 ? averageShoulderEr : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageShoulderIr > 0 ? averageShoulderIr : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageGrip > 0 ? averageGrip : ""}</TableCell>
            </TableRow>
            <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16}}>
                Percentile
              </TableCell>
              <TableCell></TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ scaptionPercentile !== null ? scaptionPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ d2FlexionRightPercentile !== null ? d2FlexionRightPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ d2FlexionLeftPercentile !== null ? d2FlexionLeftPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ d2ExtensionRightPercentile !== null ? d2ExtensionRightPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ d2ExtensionLeftPercentile !== null ? d2ExtensionLeftPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ shoulderErPercentile !== null ? shoulderErPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ shoulderIrPercentile !== null ? shoulderIrPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ gripPercentile !== null ? gripPercentile : ""}</TableCell>
            </TableRow>

        </TableFooter>
      </Table>
    </TableContainer>
        </Box>
    )
}

export default ArmStrength;