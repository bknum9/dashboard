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

const RotationalAccel = () => {
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
  const [shotputAccelRightPercentile, setShotputAccelRightPercentile] = useState(null)
  const [shotputAccelLeftPercentile, setShotputAccelLeftPercentile] = useState(null)
  const [trunkRotAccelRightPercentile, setTrunkRotAccelRightPercentile] = useState(null)
  const [trunkRotAccelLeftPercentile, setTrunkRotAccelLeftPercentile] = useState(null)
  const [plyoRotAccelRightPercentile, setPlyoRotAccelRightPercentile] = useState(null)
  const [plyoRotAccelLeftPercentile, setPlyoRotAccelLeftPercentile] = useState(null)
  const [shotputAccelRightChange, setShotputAccelRightChange] = useState(null);
  const [shotputAccelLeftChange, setShotputAccelLeftChange] = useState(null);
  const [trunkRotAccelRightChange, setTrunkRotAccelRightChange] = useState(null);
  const [trunkRotAccelLeftChange, setTrunkRotAccelLeftChange] = useState(null);
  const [plyoRotAccelRightChange, setPlyoRotAccelRightChange] = useState(null);
  const [plyoRotAccelLeftChange, setPlyoRotAccelLeftChange] = useState(null);

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
      return (sum / count).toFixed(2);
    };

const averageShotputAccelRight = calculateAverage(levelDataArray, 'shotputAccelRight');
const averageShotputAccelLeft = calculateAverage(levelDataArray, 'shotputAccelLeft');
const averageTrunkAccelRight = calculateAverage(levelDataArray, 'trunkRotAccelRight');
const averageTrunkAccelLeft = calculateAverage(levelDataArray, 'trunkRotAccelLeft');
const averagePlyoAccelRight = calculateAverage(levelDataArray, 'plyoRotAccelRight');
const averagePlyoAccelLeft = calculateAverage(levelDataArray, 'plyoRotAccelLeft');


const userInput = selectedPlayer
const filteredShotputAccelRightPercentileArray = levelDataArray.filter(obj => obj.shotputAccelRight !== null);
const filteredShotputAccelRightArray = levelDataArray.filter(obj => obj.player === userInput && obj.shotputAccelRight !== null);
filteredShotputAccelRightPercentileArray.sort((a, b) => {
  if(a.shotputAccelRight !== b.shotputAccelRight) {
    return a.shotputAccelRight - b.shotputAccelRight
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredShotputAccelRightArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const shotputAccelRightPlayerOccurrences = filteredShotputAccelRightPercentileArray.filter(obj => obj.player === userInput);

//percentile shotput right
const mostRecentShotputAccelRightPlayerOccurrences = shotputAccelRightPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (shotputAccelRightPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentShotputAccelRightPlayerOccurrences[userInput];
    const index = filteredShotputAccelRightPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredShotputAccelRightPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setShotputAccelRightPercentile(wholePercentile);
    } else {
      setShotputAccelRightPercentile(null);
    }
  } else {
    setShotputAccelRightPercentile(null);
  }
}, [filteredShotputAccelRightPercentileArray, userInput, shotputAccelRightPlayerOccurrences, mostRecentShotputAccelRightPlayerOccurrences]);

//percentage change for shotput accel right
useEffect(() => {
  if (filteredShotputAccelRightArray.length > 1) {
    const currentIndex = filteredShotputAccelRightArray.findIndex((obj, index) => {
      if (index < filteredShotputAccelRightArray.length - 1) {
        return obj.createdAt !== filteredShotputAccelRightArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredShotputAccelRightArray[currentIndex].shotputAccelRight;
      const nextData = filteredShotputAccelRightArray[currentIndex + 1].shotputAccelRight;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setShotputAccelRightChange(changePercentage.toFixed(2));
    } else {
      setShotputAccelRightChange(null);
    }
  } else {
    setShotputAccelRightChange(null);
  }
}, [filteredShotputAccelRightArray]);


const filteredShotputAccelLeftPercentileArray = levelDataArray.filter(obj => obj.shotputAccelLeft !== null);
const filteredShotputAccelLeftArray = levelDataArray.filter(obj => obj.player === userInput && obj.shotputAccelLeft !== null);
filteredShotputAccelLeftPercentileArray.sort((a, b) => {
  if(a.shotputAccelLeft !== b.shotputAccelLeft) {
    return a.shotputAccelLeft - b.shotputAccelLeft
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredShotputAccelLeftArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const shotputAccelLeftPlayerOccurrences = filteredShotputAccelLeftPercentileArray.filter(obj => obj.player === userInput);

//percentile shotput accel left
const mostRecentShotputAccelLeftPlayerOccurrences = shotputAccelLeftPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (shotputAccelLeftPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentShotputAccelLeftPlayerOccurrences[userInput];
    const index = filteredShotputAccelLeftPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredShotputAccelLeftPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setShotputAccelLeftPercentile(wholePercentile);
    } else {
      setShotputAccelLeftPercentile(null);
    }
  } else {
    setShotputAccelLeftPercentile(null);
  }
}, [filteredShotputAccelLeftPercentileArray, userInput, shotputAccelLeftPlayerOccurrences, mostRecentShotputAccelLeftPlayerOccurrences]);

//percentage change for shotput accel left
useEffect(() => {
  if (filteredShotputAccelLeftArray.length > 1) {
    const currentIndex = filteredShotputAccelLeftArray.findIndex((obj, index) => {
      if (index < filteredShotputAccelLeftArray.length - 1) {
        return obj.createdAt !== filteredShotputAccelLeftArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredShotputAccelLeftArray[currentIndex].shotputAccelLeft;
      const nextData = filteredShotputAccelLeftArray[currentIndex + 1].shotputAccelLeft;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setShotputAccelLeftChange(changePercentage.toFixed(2));
    } else {
      setShotputAccelLeftChange(null);
    }
  } else {
    setShotputAccelLeftChange(null);
  }
}, [filteredShotputAccelLeftArray]);


const filteredTrunkRotAccelRightPercentileArray = levelDataArray.filter(obj => obj.trunkRotAccelRight !== null);
const filteredTrunkRotAccelRightArray = levelDataArray.filter(obj => obj.player === userInput && obj.trunkRotAccelRight !== null);
filteredTrunkRotAccelRightPercentileArray.sort((a, b) => {
  if(a.trunkRotAccelRight !== b.trunkRotAccelRight) {
    return a.trunkRotAccelRight - b.trunkRotAccelRight
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredTrunkRotAccelRightArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const trunkRotAccelRightPlayerOccurrences = filteredTrunkRotAccelRightPercentileArray.filter(obj => obj.player === userInput);

//percentile trunk rot accel right
const mostRecentTrunkAccelRightPlayerOccurrences = trunkRotAccelRightPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (trunkRotAccelRightPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentTrunkAccelRightPlayerOccurrences[userInput];
    const index = filteredTrunkRotAccelRightPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredTrunkRotAccelRightPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setTrunkRotAccelRightPercentile(wholePercentile);
    } else {
      setTrunkRotAccelRightPercentile(null);
    }
  } else {
    setTrunkRotAccelRightPercentile(null);
  }
}, [filteredTrunkRotAccelRightPercentileArray, userInput, trunkRotAccelRightPlayerOccurrences, mostRecentTrunkAccelRightPlayerOccurrences]);

//percentage change for trunk rot accel right
useEffect(() => {
  if (filteredTrunkRotAccelRightArray.length > 1) {
    const currentIndex = filteredTrunkRotAccelRightArray.findIndex((obj, index) => {
      if (index < filteredTrunkRotAccelRightArray.length - 1) {
        return obj.createdAt !== filteredTrunkRotAccelRightArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredTrunkRotAccelRightArray[currentIndex].trunkRotAccelRight;
      const nextData = filteredTrunkRotAccelRightArray[currentIndex + 1].trunkRotAccelRight;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setTrunkRotAccelRightChange(changePercentage.toFixed(2));
    } else {
      setTrunkRotAccelRightChange(null);
    }
  } else {
    setTrunkRotAccelRightChange(null);
  }
}, [filteredTrunkRotAccelRightArray]);


const filteredTrunkRotAccelLeftPercentileArray = levelDataArray.filter(obj => obj.trunkRotAccelLeft !== null);
const filteredTrunkRotAccelLeftArray = levelDataArray.filter(obj => obj.player === userInput && obj.trunkRotAccelLeft !== null);
filteredTrunkRotAccelLeftPercentileArray.sort((a, b) => {
  if(a.trunkRotAccelLeft !== b.trunkRotAccelLeft) {
    return a.trunkRotAccelLeft - b.trunkRotAccelLeft
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredTrunkRotAccelLeftArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const trunkRotAccelLeftPlayerOccurrences = filteredTrunkRotAccelLeftPercentileArray.filter(obj => obj.player === userInput);

//percentile trunk rot accel left
const mostRecentTrunkAccelLeftPlayerOccurrences = trunkRotAccelLeftPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (trunkRotAccelLeftPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentTrunkAccelLeftPlayerOccurrences[userInput];
    const index = filteredTrunkRotAccelLeftPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredTrunkRotAccelLeftPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setTrunkRotAccelLeftPercentile(wholePercentile);
    } else {
      setTrunkRotAccelLeftPercentile(null);
    }
  } else {
    setTrunkRotAccelLeftPercentile(null);
  }
}, [filteredTrunkRotAccelLeftPercentileArray, userInput, trunkRotAccelLeftPlayerOccurrences, mostRecentTrunkAccelLeftPlayerOccurrences]);

//percentage change for trunk rot accel left
useEffect(() => {
  if (filteredTrunkRotAccelLeftArray.length > 1) {
    const currentIndex = filteredTrunkRotAccelLeftArray.findIndex((obj, index) => {
      if (index < filteredTrunkRotAccelLeftArray.length - 1) {
        return obj.createdAt !== filteredTrunkRotAccelLeftArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredTrunkRotAccelLeftArray[currentIndex].trunkRotAccelLeft;
      const nextData = filteredTrunkRotAccelLeftArray[currentIndex + 1].trunkRotAccelLeft;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setTrunkRotAccelLeftChange(changePercentage.toFixed(2));
    } else {
      setTrunkRotAccelLeftChange(null);
    }
  } else {
    setTrunkRotAccelLeftChange(null);
  }
}, [filteredTrunkRotAccelLeftArray]);


const filteredPlyoRotAccelRightPercentileArray = levelDataArray.filter(obj => obj.plyoRotAccelRight !== null);
const filteredPlyoRotAccelRightArray = levelDataArray.filter(obj => obj.player === userInput && obj.plyoRotAccelRight !== null);
filteredPlyoRotAccelRightPercentileArray.sort((a, b) => {
  if(a.plyoRotAccelRight !== b.plyoRotAccelRight) {
    return a.plyoRotAccelRight - b.plyoRotAccelRight
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredPlyoRotAccelRightArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const plyoRotAccelRightPlayerOccurrences = filteredPlyoRotAccelRightPercentileArray.filter(obj => obj.player === userInput);

//percentile weight
const mostRecentPlyoRotAccelRightPlayerOccurrences = plyoRotAccelRightPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (plyoRotAccelRightPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentPlyoRotAccelRightPlayerOccurrences[userInput];
    const index = filteredPlyoRotAccelRightPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredPlyoRotAccelRightPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setPlyoRotAccelRightPercentile(wholePercentile);
    } else {
      setPlyoRotAccelRightPercentile(null);
    }
  } else {
    setPlyoRotAccelRightPercentile(null);
  }
}, [filteredPlyoRotAccelRightPercentileArray, userInput, plyoRotAccelRightPlayerOccurrences, mostRecentPlyoRotAccelRightPlayerOccurrences]);

//percentage change for plyo rot accel right
useEffect(() => {
  if (filteredPlyoRotAccelRightArray.length > 1) {
    const currentIndex = filteredPlyoRotAccelRightArray.findIndex((obj, index) => {
      if (index < filteredPlyoRotAccelRightArray.length - 1) {
        return obj.createdAt !== filteredPlyoRotAccelRightArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredPlyoRotAccelRightArray[currentIndex].plyoRotAccelRight;
      const nextData = filteredPlyoRotAccelRightArray[currentIndex + 1].plyoRotAccelRight;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setPlyoRotAccelRightChange(changePercentage.toFixed(2));
    } else {
      setPlyoRotAccelRightChange(null);
    }
  } else {
    setPlyoRotAccelRightChange(null);
  }
}, [filteredPlyoRotAccelRightArray]);


const filteredPlyoRotAccelLeftPercentileArray = levelDataArray.filter(obj => obj.plyoRotAccelLeft !== null);
const filteredPlyoRotAccelLeftArray = levelDataArray.filter(obj => obj.player === userInput && obj.plyoRotAccelLeft !== null);
filteredPlyoRotAccelLeftPercentileArray.sort((a, b) => {
  if(a.plyoRotAccelLeft !== b.plyoRotAccelLeft) {
    return a.plyoRotAccelLeft - b.plyoRotAccelLeft
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredPlyoRotAccelLeftArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const plyoRotAccelLeftPlayerOccurrences = filteredPlyoRotAccelLeftPercentileArray.filter(obj => obj.player === userInput);

//percentile plyo rot accel left
const mostRecentPlyoRotAccelLeftPlayerOccurrences = plyoRotAccelLeftPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (plyoRotAccelLeftPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentPlyoRotAccelLeftPlayerOccurrences[userInput];
    const index = filteredPlyoRotAccelLeftPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredPlyoRotAccelLeftPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setPlyoRotAccelLeftPercentile(wholePercentile);
    } else {
      setPlyoRotAccelLeftPercentile(null);
    }
  } else {
    setPlyoRotAccelLeftPercentile(null);
  }
}, [filteredPlyoRotAccelLeftPercentileArray, userInput, plyoRotAccelLeftPlayerOccurrences, mostRecentPlyoRotAccelLeftPlayerOccurrences]);

//percentage change plyo rot accel left
useEffect(() => {
  if (filteredPlyoRotAccelLeftArray.length > 1) {
    const currentIndex = filteredPlyoRotAccelLeftArray.findIndex((obj, index) => {
      if (index < filteredPlyoRotAccelLeftArray.length - 1) {
        return obj.createdAt !== filteredPlyoRotAccelLeftArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredPlyoRotAccelLeftArray[currentIndex].plyoRotAccelLeft;
      const nextData = filteredPlyoRotAccelLeftArray[currentIndex + 1].plyoRotAccelLeft;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setPlyoRotAccelLeftChange(changePercentage.toFixed(2));
    } else {
      setPlyoRotAccelLeftChange(null);
    }
  } else {
    setPlyoRotAccelLeftChange(null);
  }
}, [filteredPlyoRotAccelLeftArray]);


    return (
        <Box m={"20px"}>
             <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={"Rotational Acceleration"} subtitle="Metrics: Proteus Shotput, Proteus Trunk Rotations, Proteus Plyo Trunk Rotations"/>
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
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Shotput (D)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Shotput (N)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Trunk Rot (D)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Trunk Rot (N)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Plyo Trunk (D)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Plyo Trunk (N)</TableCell>
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
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.shotputAccelRight}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.shotputAccelLeft}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.trunkRotAccelRight}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.trunkRotAccelLeft}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.plyoRotAccelRight}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.plyoRotAccelLeft}</TableCell>
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
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ shotputAccelRightChange !== null ? shotputAccelRightChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ shotputAccelLeftChange !== null ? shotputAccelLeftChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ trunkRotAccelRightChange !== null ? trunkRotAccelRightChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ trunkRotAccelLeftChange !== null ? trunkRotAccelLeftChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ plyoRotAccelRightChange !== null ? plyoRotAccelRightChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ plyoRotAccelLeftChange !== null ? plyoRotAccelLeftChange : ""}</TableCell>
            </TableRow>
        <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16, color: '#868dfb'}}>
                Averages
              </TableCell>
              <TableCell align="right" sx={{fontSize: 16}}></TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageShotputAccelRight > 0 ? averageShotputAccelRight : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageShotputAccelLeft > 0 ? averageShotputAccelLeft : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageTrunkAccelRight > 0 ? averageTrunkAccelRight : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageTrunkAccelLeft > 0 ? averageTrunkAccelLeft : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averagePlyoAccelRight > 0 ? averagePlyoAccelRight : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averagePlyoAccelLeft > 0 ? averagePlyoAccelLeft : ""}</TableCell>
            </TableRow>
            <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16}}>
                Percentile
              </TableCell>
              <TableCell></TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ shotputAccelRightPercentile !== null ? shotputAccelRightPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ shotputAccelLeftPercentile !== null ? shotputAccelLeftPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ trunkRotAccelRightPercentile !== null ? trunkRotAccelRightPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ trunkRotAccelLeftPercentile !== null ? trunkRotAccelLeftPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ plyoRotAccelRightPercentile !== null ? plyoRotAccelRightPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ plyoRotAccelLeftPercentile !== null ? plyoRotAccelLeftPercentile : ""}</TableCell>
            </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
        </Box>
        
    )

}

export default RotationalAccel;