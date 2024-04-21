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

const TrapBarDeadlift = () => {
  const theme = useTheme();
    const colors = tokens(theme.palette.mode)
  const isNonMobile = useMediaQuery("(min-width:600px)")
  
  const [lowerBodyUsers, setLowerBodyUsers] = useState([])
  const [users, setUsers] = useState([])
  const [id, setId] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [dataArray, setDataArray] = useState([]);
  const [levelId, setLevelId] = useState('');
  const [levelDataArray, setLevelDataArray] = useState([]);
  const [oneRmPercentile, setOneRmPercentile] = useState(null)
  const [tbdl135Percentile, settbdl135Percentile] = useState(null)
  const [tbdl185Percentile, settbdl185Percentile] = useState(null)
  const [tbdl225Percentile, settbdl225Percentile] = useState(null)
  const [tbdl275Percentile, settbdl275Percentile] = useState(null)
  const [tbdl315Percentile, settbdl315Percentile] = useState(null)
  const [tbdl365Percentile, settbdl365Percentile] = useState(null)
  const [tbdl405Percentile, settbdl405Percentile] = useState(null)
  const [tbdl455Percentile, settbdl455Percentile] = useState(null)
  const [oneRmChange, setOneRmChange] = useState(null)
  const [tbdl135Change, settbdl135Change] = useState(null)
  const [tbdl185Change, settbdl185Change] = useState(null)
  const [tbdl225Change, settbdl225Change] = useState(null)
  const [tbdl275Change, settbdl275Change] = useState(null)
  const [tbdl315Change, settbdl315Change] = useState(null)
  const [tbdl365Change, settbdl365Change] = useState(null)
  const [tbdl405Change, settbdl405Change] = useState(null)
  const [tbdl455Change, settbdl455Change] = useState(null)
  
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
        const fetchLowerBodyUsers = async () => {
            const response = await fetch('http://localhost:4000/api/data')
            const json = await response.json()
            if (response.ok) {
                setLowerBodyUsers(json)
            }
        }
        fetchLowerBodyUsers()
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
          // Single document found
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
      return (sum / count).toFixed(2);
    };

    const tbdl1RmAverage = calculateAverage(levelDataArray, 'tbdl1Rm');
    const average135 = calculateAverage(levelDataArray, 'tbdlVelo135');
    const average185 = calculateAverage(levelDataArray, 'tbdlVelo185');
    const average225 = calculateAverage(levelDataArray, 'tbdlVelo225');
    const average275 = calculateAverage(levelDataArray, 'tbdlVelo275');
    const average315 = calculateAverage(levelDataArray, 'tbdlVelo315');
    const average365 = calculateAverage(levelDataArray, 'tbdlVelo365');
    const average405 = calculateAverage(levelDataArray, 'tbdlVelo405');
    const average455 = calculateAverage(levelDataArray, 'tbdlVelo455');

const userInput = selectedPlayer
const filtered1RmPercentileArray = levelDataArray.filter(obj => obj.tbdl1Rm !== null);
const filtered1RmArray = levelDataArray.filter(obj => obj.player === userInput && obj.tbdl1Rm !== null);
filtered1RmPercentileArray.sort((a, b) => {
  if(a.tbdl1Rm !== b.tbdl1Rm) {
    return a.tbdl1Rm - b.tbdl1Rm
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filtered1RmArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const oneRmPlayerOccurrences = filtered1RmPercentileArray.filter(obj => obj.player === userInput);

//percentile 1 rm
const mostRecent1RmPlayerOccurrences = oneRmPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (oneRmPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecent1RmPlayerOccurrences[userInput];
    const index = filtered1RmPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filtered1RmPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setOneRmPercentile(wholePercentile);
    } else {
      setOneRmPercentile(null);
    }
  } else {
    setOneRmPercentile(null);
  }
}, [filtered1RmPercentileArray, userInput, oneRmPlayerOccurrences, mostRecent1RmPlayerOccurrences]);

//percentage change for 1 rm
useEffect(() => {
  if (filtered1RmArray.length > 1) {
    const currentIndex = filtered1RmArray.findIndex((obj, index) => {
      if (index < filtered1RmArray.length - 1) {
        return obj.createdAt !== filtered1RmArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filtered1RmArray[currentIndex].tbdl1Rm;
      const nextData = filtered1RmArray[currentIndex + 1].tbdl1Rm;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setOneRmChange(changePercentage.toFixed(2));
    } else {
      setOneRmChange(null);
    }
  } else {
    setOneRmChange(null);
  }
}, [filtered1RmArray]);
    
    const filteredtbdl135PercentileArray = levelDataArray.filter(obj => obj.tbdlVelo135 !== null);
    const filteredtbdl135Array = levelDataArray.filter(obj => obj.player === userInput && obj.tbdlVelo135 !== null);
    filteredtbdl135PercentileArray.sort((a, b) => {
      if(a.tbdlVelo135 !== b.tbdlVelo135) {
        return a.tbdlVelo135 - b.tbdlVelo135
      }
      else {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    filteredtbdl135Array.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const tbdl135PlayerOccurrences = filteredtbdl135PercentileArray.filter(obj => obj.player === userInput);
    
     //percentile 135
const mostRecent135PlayerOccurrences = tbdl135PlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (tbdl135PlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecent135PlayerOccurrences[userInput];
    const index = filteredtbdl135PercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredtbdl135PercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      settbdl135Percentile(wholePercentile);
    } else {
      settbdl135Percentile(null);
    }
  } else {
    settbdl135Percentile(null);
  }
}, [filteredtbdl135PercentileArray, userInput, tbdl135PlayerOccurrences, mostRecent135PlayerOccurrences]);

    //percentage change for 135
useEffect(() => {
  if (filteredtbdl135Array.length > 1) {
    const currentIndex = filteredtbdl135Array.findIndex((obj, index) => {
      if (index < filteredtbdl135Array.length - 1) {
        return obj.createdAt !== filteredtbdl135Array[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredtbdl135Array[currentIndex].tbdlVelo135;
      const nextData = filteredtbdl135Array[currentIndex + 1].tbdlVelo135;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      settbdl135Change(changePercentage.toFixed(2));
    } else {
      settbdl135Change(null);
    }
  } else {
    settbdl135Change(null);
  }
}, [filteredtbdl135Array]);
    
    const filteredtbdl185PercentileArray = levelDataArray.filter(obj => obj.tbdlVelo185 !== null);
    const filteredtbdl185Array = levelDataArray.filter(obj => obj.player === userInput && obj.tbdlVelo185 !== null);
    filteredtbdl185PercentileArray.sort((a, b) => {
      if(a.tbdlVelo185 !== b.tbdlVelo185) {
        return a.tbdlVelo185 - b.tbdlVelo185
      }
      else {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    filteredtbdl185Array.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const tbdl185PlayerOccurrences = filteredtbdl185PercentileArray.filter(obj => obj.player === userInput);
    
    //percentile 185
const mostRecent185PlayerOccurrences = tbdl185PlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (tbdl185PlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecent185PlayerOccurrences[userInput];
    const index = filteredtbdl185PercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredtbdl185PercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      settbdl185Percentile(wholePercentile);
    } else {
      settbdl185Percentile(null);
    }
  } else {
    settbdl185Percentile(null);
  }
}, [filteredtbdl185PercentileArray, userInput, tbdl185PlayerOccurrences, mostRecent185PlayerOccurrences]);

    //percentage change for 185
useEffect(() => {
  if (filteredtbdl185Array.length > 1) {
    const currentIndex = filteredtbdl185Array.findIndex((obj, index) => {
      if (index < filteredtbdl185Array.length - 1) {
        return obj.createdAt !== filteredtbdl185Array[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredtbdl185Array[currentIndex].tbdlVelo185;
      const nextData = filteredtbdl185Array[currentIndex + 1].tbdlVelo185;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      settbdl185Change(changePercentage.toFixed(2));
    } else {
      settbdl185Change(null);
    }
  } else {
    settbdl185Change(null);
  }
}, [filteredtbdl185Array]);
    
    
    const filteredtbdl225PercentileArray = levelDataArray.filter(obj => obj.tbdlVelo225 !== null);
    const filteredtbdl225Array = levelDataArray.filter(obj => obj.player === userInput && obj.tbdlVelo225 !== null);
    filteredtbdl225PercentileArray.sort((a, b) => {
      if(a.tbdlVelo225 !== b.tbdlVelo225) {
        return a.tbdlVelo225 - b.tbdlVelo225
      }
      else {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    filteredtbdl225Array.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const tbdl225PlayerOccurrences = filteredtbdl225PercentileArray.filter(obj => obj.player === userInput);
    
    //percentile 225
const mostRecent225PlayerOccurrences = tbdl225PlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (tbdl225PlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecent225PlayerOccurrences[userInput];
    const index = filteredtbdl225PercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredtbdl225PercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      settbdl225Percentile(wholePercentile);
    } else {
      settbdl225Percentile(null);
    }
  } else {
    settbdl225Percentile(null);
  }
}, [filteredtbdl225PercentileArray, userInput, tbdl225PlayerOccurrences, mostRecent225PlayerOccurrences]);

    //percentage change for 225
useEffect(() => {
  if (filteredtbdl225Array.length > 1) {
    const currentIndex = filteredtbdl225Array.findIndex((obj, index) => {
      if (index < filteredtbdl225Array.length - 1) {
        return obj.createdAt !== filteredtbdl225Array[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredtbdl225Array[currentIndex].tbdlVelo225;
      const nextData = filteredtbdl225Array[currentIndex + 1].tbdlVelo225;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      settbdl225Change(changePercentage.toFixed(2));
    } else {
      settbdl225Change(null);
    }
  } else {
    settbdl225Change(null);
  }
}, [filteredtbdl225Array]);

    
    const filteredtbdl275PercentileArray = levelDataArray.filter(obj => obj.tbdlVelo275 !== null);
    const filteredtbdl275Array = levelDataArray.filter(obj => obj.player === userInput && obj.tbdlVelo275 !== null);
    filteredtbdl275PercentileArray.sort((a, b) => {
      if(a.tbdlVelo275 !== b.tbdlVelo275) {
        return a.tbdlVelo275 - b.tbdlVelo275
      }
      else {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    filteredtbdl275Array.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const tbdl275PlayerOccurrences = filteredtbdl275PercentileArray.filter(obj => obj.player === userInput);
    
  //percentile 275
const mostRecent275PlayerOccurrences = tbdl275PlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (tbdl275PlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecent275PlayerOccurrences[userInput];
    const index = filteredtbdl275PercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredtbdl275PercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      settbdl275Percentile(wholePercentile);
    } else {
      settbdl275Percentile(null);
    }
  } else {
    settbdl275Percentile(null);
  }
}, [filteredtbdl275PercentileArray, userInput, tbdl275PlayerOccurrences, mostRecent275PlayerOccurrences]);

    //percentage change for 275
useEffect(() => {
  if (filteredtbdl275Array.length > 1) {
    const currentIndex = filteredtbdl275Array.findIndex((obj, index) => {
      if (index < filteredtbdl275Array.length - 1) {
        return obj.createdAt !== filteredtbdl275Array[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredtbdl275Array[currentIndex].tbdlVelo275;
      const nextData = filteredtbdl275Array[currentIndex + 1].tbdlVelo275;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      settbdl275Change(changePercentage.toFixed(2));
    } else {
      settbdl275Change(null);
    }
  } else {
    settbdl275Change(null);
  }
}, [filteredtbdl275Array]);
    
    const filteredtbdl315PercentileArray = levelDataArray.filter(obj => obj.tbdlVelo315 !== null);
    const filteredtbdl315Array = levelDataArray.filter(obj => obj.player === userInput && obj.tbdlVelo315 !== null);
    filteredtbdl315PercentileArray.sort((a, b) => {
      if(a.tbdlVelo315 !== b.tbdlVelo315) {
        return a.tbdlVelo315 - b.tbdlVelo315
      }
      else {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    filteredtbdl315Array.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const tbdl315PlayerOccurrences = filteredtbdl315PercentileArray.filter(obj => obj.player === userInput);
    
    //percentile 315
const mostRecent315PlayerOccurrences = tbdl315PlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (tbdl315PlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecent315PlayerOccurrences[userInput];
    const index = filteredtbdl315PercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredtbdl315PercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      settbdl315Percentile(wholePercentile);
    } else {
      settbdl315Percentile(null);
    }
  } else {
    settbdl315Percentile(null);
  }
}, [filteredtbdl315PercentileArray, userInput, tbdl315PlayerOccurrences, mostRecent315PlayerOccurrences]);

    //percentage change for 315
useEffect(() => {
  if (filteredtbdl315Array.length > 1) {
    const currentIndex = filteredtbdl315Array.findIndex((obj, index) => {
      if (index < filteredtbdl315Array.length - 1) {
        return obj.createdAt !== filteredtbdl315Array[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredtbdl315Array[currentIndex].tbdlVelo315;
      const nextData = filteredtbdl315Array[currentIndex + 1].tbdlVelo315;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      settbdl315Change(changePercentage.toFixed(2));
    } else {
      settbdl315Change(null);
    }
  } else {
    settbdl315Change(null);
  }
}, [filteredtbdl315Array]);

    const filteredtbdl365PercentileArray = levelDataArray.filter(obj => obj.tbdlVelo365 !== null);
    const filteredtbdl365Array = levelDataArray.filter(obj => obj.player === userInput && obj.tbdlVelo365 !== null);
    filteredtbdl365PercentileArray.sort((a, b) => {
      if(a.tbdlVelo365 !== b.tbdlVelo365) {
        return a.tbdlVelo365 - b.tbdlVelo365
      }
      else {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    filteredtbdl365Array.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const tbdl365PlayerOccurrences = filteredtbdl365PercentileArray.filter(obj => obj.player === userInput);
    
    //percentile 365
const mostRecent365PlayerOccurrences = tbdl365PlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (tbdl365PlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecent365PlayerOccurrences[userInput];
    const index = filteredtbdl365PercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredtbdl365PercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      settbdl365Percentile(wholePercentile);
    } else {
      settbdl365Percentile(null);
    }
  } else {
    settbdl365Percentile(null);
  }
}, [filteredtbdl365PercentileArray, userInput, tbdl365PlayerOccurrences, mostRecent365PlayerOccurrences]);

    //percentage change for 365
useEffect(() => {
  if (filteredtbdl365Array.length > 1) {
    const currentIndex = filteredtbdl365Array.findIndex((obj, index) => {
      if (index < filteredtbdl365Array.length - 1) {
        return obj.createdAt !== filteredtbdl365Array[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredtbdl365Array[currentIndex].tbdlVelo365;
      const nextData = filteredtbdl365Array[currentIndex + 1].tbdlVelo365;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      settbdl365Change(changePercentage.toFixed(2));
    } else {
      settbdl365Change(null);
    }
  } else {
    settbdl365Change(null);
  }
}, [filteredtbdl365Array]);
    
    
    const filteredtbdl405PercentileArray = levelDataArray.filter(obj => obj.tbdlVelo405 !== null);
    const filteredtbdl405Array = levelDataArray.filter(obj => obj.player === userInput && obj.tbdlVelo405 !== null);
    filteredtbdl405PercentileArray.sort((a, b) => {
      if(a.tbdlVelo405 !== b.tbdlVelo405) {
        return a.tbdlVelo405 - b.tbdlVelo405
      }
      else {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    filteredtbdl405Array.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const tbdl405PlayerOccurrences = filteredtbdl405PercentileArray.filter(obj => obj.player === userInput);
    
    //percentile 405
const mostRecent405PlayerOccurrences = tbdl405PlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (tbdl405PlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecent405PlayerOccurrences[userInput];
    const index = filteredtbdl405PercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredtbdl405PercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      settbdl405Percentile(wholePercentile);
    } else {
      settbdl405Percentile(null);
    }
  } else {
    settbdl405Percentile(null);
  }
}, [filteredtbdl405PercentileArray, userInput, tbdl405PlayerOccurrences, mostRecent405PlayerOccurrences]);

    //percentage change for 405
useEffect(() => {
  if (filteredtbdl405Array.length > 1) {
    const currentIndex = filteredtbdl405Array.findIndex((obj, index) => {
      if (index < filteredtbdl405Array.length - 1) {
        return obj.createdAt !== filteredtbdl405Array[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredtbdl405Array[currentIndex].tbdlVelo405;
      const nextData = filteredtbdl405Array[currentIndex + 1].tbdlVelo405;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      settbdl405Change(changePercentage.toFixed(2));
    } else {
      settbdl405Change(null);
    }
  } else {
    settbdl405Change(null);
  }
}, [filteredtbdl405Array]);
    
    
    const filteredtbdl455PercentileArray = levelDataArray.filter(obj => obj.tbdlVelo455 !== null);
    const filteredtbdl455Array = levelDataArray.filter(obj => obj.player === userInput && obj.tbdlVelo455 !== null);
    filteredtbdl455PercentileArray.sort((a, b) => {
      if(a.tbdlVelo455 !== b.tbdlVelo455) {
        return a.tbdlVelo455 - b.tbdlVelo455
      }
      else {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    filteredtbdl455Array.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const tbdl455PlayerOccurrences = filteredtbdl455PercentileArray.filter(obj => obj.player === userInput);
    
    //percentile 455
const mostRecent455PlayerOccurrences = tbdl455PlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (tbdl455PlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecent455PlayerOccurrences[userInput];
    const index = filteredtbdl455PercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredtbdl455PercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      settbdl455Percentile(wholePercentile);
    } else {
      settbdl455Percentile(null);
    }
  } else {
    settbdl455Percentile(null);
  }
}, [filteredtbdl455PercentileArray, userInput, tbdl455PlayerOccurrences, mostRecent455PlayerOccurrences]);

    //percentage change for 455
useEffect(() => {
  if (filteredtbdl455Array.length > 1) {
    const currentIndex = filteredtbdl455Array.findIndex((obj, index) => {
      if (index < filteredtbdl455Array.length - 1) {
        return obj.createdAt !== filteredtbdl455Array[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredtbdl455Array[currentIndex].tbdlVelo455;
      const nextData = filteredtbdl455Array[currentIndex + 1].tbdlVelo455;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      settbdl455Change(changePercentage.toFixed(2));
    } else {
      settbdl455Change(null);
    }
  } else {
    settbdl455Change(null);
  }
}, [filteredtbdl455Array]);

    return (
        <Box m={"20px"}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
   <Header title={"Trap Bar Deadlift Force Velocity Profile"} subtitle="Metrics: Trap Bar Deadlift - Velocity, Estimated 1 RM"/>
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
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>TBDL 1 RM</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>TBDL Velo 135</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>TBDL Velo 185</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>TBDL Velo 225</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>TBDL Velo 275</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>TBDL Velo 315</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>TBDL Velo 365</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>TBDL Velo 405</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>TBDL Velo 455</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataArray.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16, color: colors.redAccent[400]}}>
                {row.player}
              </TableCell>
              <TableCell sx={{fontSize: 16, color: colors.redAccent[400]}}>{formatDate(row.createdAt)}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.tbdl1Rm}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.tbdlVelo135}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.tbdlVelo185}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.tbdlVelo225}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.tbdlVelo275}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.tbdlVelo315}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.tbdlVelo365}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.tbdlVelo405}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.tbdlVelo455}</TableCell>
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
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ oneRmChange !== null ? oneRmChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ tbdl135Change !== null ? tbdl135Change : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ tbdl185Change !== null ? tbdl185Change : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ tbdl225Change !== null ? tbdl225Change : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ tbdl275Change !== null ? tbdl275Change : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ tbdl315Change !== null ? tbdl315Change : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ tbdl365Change !== null ? tbdl365Change : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ tbdl405Change !== null ? tbdl405Change : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ tbdl455Change !== null ? tbdl455Change : ""}</TableCell>
            </TableRow>
        <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16, color: '#868dfb'}}>
                Averages
              </TableCell>
              <TableCell align="right" sx={{fontSize: 16}}></TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{tbdl1RmAverage > 0 ? tbdl1RmAverage : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{average135 > 0 ? average135 : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{average185 > 0 ? average185 : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{average225 > 0 ? average225 : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{average275 > 0 ? average275 : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{average315 > 0 ? average315 : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{average365 > 0 ? average365 : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{average405 > 0 ? average405 : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{average455 > 0 ? average455 : ""}</TableCell>
            </TableRow>
            <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16}}>
                Percentile
              </TableCell>
              <TableCell></TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ oneRmPercentile !== null ? oneRmPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ tbdl135Percentile !== null ? tbdl135Percentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ tbdl185Percentile !== null ? tbdl185Percentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ tbdl225Percentile !== null ? tbdl225Percentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ tbdl275Percentile !== null ? tbdl275Percentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ tbdl315Percentile !== null ? tbdl315Percentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ tbdl365Percentile !== null ? tbdl365Percentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ tbdl405Percentile !== null ? tbdl405Percentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ tbdl455Percentile !== null ? tbdl455Percentile : ""}</TableCell>
              
            </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
   </Box>
    )

}

export default TrapBarDeadlift;