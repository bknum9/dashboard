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

const Jumping = () => {
  const theme = useTheme();
    const colors = tokens(theme.palette.mode)
  const isNonMobile = useMediaQuery("(min-width:600px)")
  
  const [lowerBodyUsers, setLowerBodyUsers] = useState([])
  const [users, setUsers] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [id, setId] = useState('');
  const [dataArray, setDataArray] = useState([]);
  const [levelId, setLevelId] = useState('');
  const [levelDataArray, setLevelDataArray] = useState([]);
  const [lateralBoundRightPercentile, setLateralBoundRightPercentile] = useState(null)
  const [lateralBoundLeftPercentile, setLateralBoundLeftPercentile] = useState(null)
  const [broadJumpPercentile, setBroadJumpPercentile] = useState(null)
  const [lateralBoundRightChange, setLateralBoundRightChange] = useState(null);
  const [lateralBoundLeftChange, setLateralBoundLeftChange] = useState(null);
  const [broadJumpChange, setBroadJumpChange] = useState(null);

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

const averageBoundLeft = calculateAverage(levelDataArray, 'lateralBoundLeft');
const averageBoundRight = calculateAverage(levelDataArray, 'lateralBoundRight')
const averageBroadJump = calculateAverage(levelDataArray, 'broadJump')


const userInput = selectedPlayer
const filteredLateralBoundRightPercentileArray = levelDataArray.filter(obj => obj.lateralBoundRight !== null);
const filteredLateralBoundRightArray = levelDataArray.filter(obj => obj.player === userInput && obj.lateralBoundRight !== null);
filteredLateralBoundRightPercentileArray.sort((a, b) => {
  if(a.lateralBoundRight !== b.lateralBoundRight) {
    return a.lateralBoundRight - b.lateralBoundRight
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredLateralBoundRightArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const lateralBoundRightPlayerOccurrences = filteredLateralBoundRightPercentileArray.filter(obj => obj.player === userInput);

//percentile lateral bound right
const mostRecentLateralBoundRightPlayerOccurrences = lateralBoundRightPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (lateralBoundRightPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentLateralBoundRightPlayerOccurrences[userInput];
    const index = filteredLateralBoundRightPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredLateralBoundRightPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setLateralBoundRightPercentile(wholePercentile);
    } else {
      setLateralBoundRightPercentile(null);
    }
  } else {
    setLateralBoundRightPercentile(null);
  }
}, [filteredLateralBoundRightPercentileArray, userInput, lateralBoundRightPlayerOccurrences, mostRecentLateralBoundRightPlayerOccurrences]);

//percentage change lateral bound right
useEffect(() => {
  if (filteredLateralBoundRightArray.length > 1) {
    const currentIndex = filteredLateralBoundRightArray.findIndex((obj, index) => {
      if (index < filteredLateralBoundRightArray.length - 1) {
        return obj.createdAt !== filteredLateralBoundRightArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredLateralBoundRightArray[currentIndex].lateralBoundRight;
      const nextData = filteredLateralBoundRightArray[currentIndex + 1].lateralBoundRight;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setLateralBoundRightChange(changePercentage.toFixed(2));
    } else {
      setLateralBoundRightChange(null);
    }
  } else {
    setLateralBoundRightChange(null);
  }
}, [filteredLateralBoundRightArray]);


const filteredLateralBoundLeftPercentileArray = levelDataArray.filter(obj => obj.lateralBoundLeft !== null);
const filteredLateralBoundLeftArray = levelDataArray.filter(obj => obj.player === userInput && obj.lateralBoundLeft !== null);
filteredLateralBoundLeftPercentileArray.sort((a, b) => {
  if(a.lateralBoundLeft !== b.lateralBoundLeft) {
    return a.lateralBoundLeft - b.lateralBoundLeft
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredLateralBoundLeftArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const lateralBoundLeftPlayerOccurrences = filteredLateralBoundLeftPercentileArray.filter(obj => obj.player === userInput);

//percentile bound left
const mostRecentLateralBoundLeftPlayerOccurrences = lateralBoundLeftPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (lateralBoundLeftPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentLateralBoundLeftPlayerOccurrences[userInput];
    const index = filteredLateralBoundLeftPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredLateralBoundLeftPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setLateralBoundLeftPercentile(wholePercentile);
    } else {
      setLateralBoundLeftPercentile(null);
    }
  } else {
    setLateralBoundLeftPercentile(null);
  }
}, [filteredLateralBoundLeftPercentileArray, userInput, lateralBoundLeftPlayerOccurrences, mostRecentLateralBoundLeftPlayerOccurrences]);

//percentage change lateral bound left
useEffect(() => {
  if (filteredLateralBoundLeftArray.length > 1) {
    const currentIndex = filteredLateralBoundLeftArray.findIndex((obj, index) => {
      if (index < filteredLateralBoundLeftArray.length - 1) {
        return obj.createdAt !== filteredLateralBoundLeftArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredLateralBoundLeftArray[currentIndex].lateralBoundLeft;
      const nextData = filteredLateralBoundLeftArray[currentIndex + 1].lateralBoundLeft;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setLateralBoundLeftChange(changePercentage.toFixed(2));
    } else {
      setLateralBoundLeftChange(null);
    }
  } else {
    setLateralBoundLeftChange(null);
  }
}, [filteredLateralBoundLeftArray]);


const filteredBroadJumpPercentileArray = levelDataArray.filter(obj => obj.broadJump !== null);
const filteredBroadJumpArray = levelDataArray.filter(obj => obj.player === userInput && obj.broadJump !== null);
filteredBroadJumpPercentileArray.sort((a, b) => {
  if(a.broadJump !== b.broadJump) {
    return a.broadJump - b.broadJump
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredBroadJumpArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const broadJumpPlayerOccurrences = filteredBroadJumpPercentileArray.filter(obj => obj.player === userInput);

//percentile broad jump
const mostRecentBroadJumpPlayerOccurrences = broadJumpPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (broadJumpPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentBroadJumpPlayerOccurrences[userInput];
    const index = filteredBroadJumpPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredBroadJumpPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setBroadJumpPercentile(wholePercentile);
    } else {
      setBroadJumpPercentile(null);
    }
  } else {
    setBroadJumpPercentile(null);
  }
}, [filteredBroadJumpPercentileArray, userInput, broadJumpPlayerOccurrences, mostRecentBroadJumpPlayerOccurrences]);

//percentage change broad jump
useEffect(() => {
  if (filteredBroadJumpArray.length > 1) {
    const currentIndex = filteredBroadJumpArray.findIndex((obj, index) => {
      if (index < filteredBroadJumpArray.length - 1) {
        return obj.createdAt !== filteredBroadJumpArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredBroadJumpArray[currentIndex].broadJump;
      const nextData = filteredBroadJumpArray[currentIndex + 1].broadJump;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setBroadJumpChange(changePercentage.toFixed(2));
    } else {
      setBroadJumpChange(null);
    }
  } else {
    setBroadJumpChange(null);
  }
}, [filteredBroadJumpArray]);
  
    

    return (
        <Box m={"20px"}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
   <Header title={"Jumping"} subtitle="Metrics: Lateral Bound, Broad Jump"/>
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
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Broad Jump</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Lateral Bound (R)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Lateral Bound (L)</TableCell>
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
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.broadJump}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.lateralBoundRight}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.lateralBoundLeft}</TableCell>
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
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ broadJumpChange !== null ? broadJumpChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ lateralBoundRightChange !== null ? lateralBoundRightChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ lateralBoundLeftChange !== null ? lateralBoundLeftChange : ""}</TableCell>
            </TableRow>
        <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16, color: '#868dfb'}}>
                Averages
              </TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}></TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageBroadJump > 0 ? averageBroadJump : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageBoundRight > 0 ? averageBoundRight : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageBoundLeft > 0 ? averageBoundLeft : ""}</TableCell>
            </TableRow>
            <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16}}>
                Percentile
              </TableCell>
              <TableCell></TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ broadJumpPercentile !== null ? broadJumpPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ lateralBoundRightPercentile !== null ? lateralBoundRightPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ lateralBoundLeftPercentile !== null ? lateralBoundLeftPercentile : ""}</TableCell>
            </TableRow>

        </TableFooter>
      </Table>
    </TableContainer>
   </Box>
    )
}

export default Jumping;