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

const Proteus = () => {
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
  const [pressRightPercentile, setPressRightPercentile] = useState(null)
  const [pressLeftPercentile, setPressLeftPercentile] = useState(null)
  const [rowRighttPercentile, setRowRightPercentile] = useState(null)
  const [rowLeftPercentile, setRowLeftPercentile] = useState(null)
  const [pressRightChange, setPressRightChange] = useState(null);
  const [pressLeftChange, setPressLeftChange] = useState(null);
  const [rowRightChange, setRowRightChange] = useState(null);
  const [rowLeftChange, setRowLeftChange] = useState(null);

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

    const averagePressRight = calculateAverage(levelDataArray, 'pressRight');
    const averagePressLeft = calculateAverage(levelDataArray, 'pressLeft');
    const averageRowRight = calculateAverage(levelDataArray, 'rowRight');
    const averageRowLeft = calculateAverage(levelDataArray, 'rowLeft');


const userInput = selectedPlayer
const filteredPressRightPercentileArray = levelDataArray.filter(obj => obj.pressRight !== null);
const filteredPressRightArray = levelDataArray.filter(obj => obj.player === userInput && obj.pressRight !== null);
filteredPressRightPercentileArray.sort((a, b) => {
  if(a.pressRight !== b.pressRight) {
    return a.pressRight - b.pressRight
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredPressRightArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const pressRightPlayerOccurrences = filteredPressRightPercentileArray.filter(obj => obj.player === userInput);

//percentile press right
const mostRecentPressRightPlayerOccurrences = pressRightPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (pressRightPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentPressRightPlayerOccurrences[userInput];
    const index = filteredPressRightPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredPressRightPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      console.log(percentile)
      setPressRightPercentile(wholePercentile);
    } else {
      setPressRightPercentile(null);
    }
  } else {
    setPressRightPercentile(null);
  }
}, [filteredPressRightPercentileArray, userInput, pressRightPlayerOccurrences, mostRecentPressRightPlayerOccurrences]);

//percentage change for press right
useEffect(() => {
  if (filteredPressRightArray.length > 1) {
    const currentIndex = filteredPressRightArray.findIndex((obj, index) => {
      if (index < filteredPressRightArray.length - 1) {
        return obj.createdAt !== filteredPressRightArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredPressRightArray[currentIndex].pressRight;
      const nextData = filteredPressRightArray[currentIndex + 1].pressRight;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setPressRightChange(changePercentage.toFixed(2));
    } else {
      setPressRightChange(null);
    }
  } else {
    setPressRightChange(null);
  }
}, [filteredPressRightArray]);
    
 
    const filteredPressLeftPercentileArray = levelDataArray.filter(obj => obj.pressLeft !== null);
    const filteredPressLeftArray = levelDataArray.filter(obj => obj.player === userInput && obj.pressLeft !== null);
    filteredPressLeftPercentileArray.sort((a, b) => {
      if(a.pressLeft !== b.pressLeft) {
        return a.pressLeft - b.pressLeft
      }
      else {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    filteredPressLeftArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const pressLeftPlayerOccurrences = filteredPressLeftPercentileArray.filter(obj => obj.player === userInput);

      //percentile press left
const mostRecentPressLeftPlayerOccurrences = pressLeftPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (pressLeftPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentPressLeftPlayerOccurrences[userInput];
    const index = filteredPressLeftPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredPressLeftPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setPressLeftPercentile(wholePercentile);
    } else {
      setPressLeftPercentile(null);
    }
  } else {
    setPressLeftPercentile(null);
  }
}, [filteredPressLeftPercentileArray, userInput, pressLeftPlayerOccurrences, mostRecentPressLeftPlayerOccurrences]);

    //percentage change for press left
useEffect(() => {
  if (filteredPressLeftArray.length > 1) {
    const currentIndex = filteredPressLeftArray.findIndex((obj, index) => {
      if (index < filteredPressLeftArray.length - 1) {
        return obj.createdAt !== filteredPressLeftArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredPressLeftArray[currentIndex].pressLeft;
      const nextData = filteredPressLeftArray[currentIndex + 1].pressLeft;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setPressLeftChange(changePercentage.toFixed(2));
    } else {
      setPressLeftChange(null);
    }
  } else {
    setPressLeftChange(null);
  }
}, [filteredPressLeftArray]);
 
 
 const filteredRowRightPercentileArray = levelDataArray.filter(obj => obj.rowRight !== null);
 const filteredRowRightArray = levelDataArray.filter(obj => obj.player === userInput && obj.rowRight !== null);
 filteredRowRightPercentileArray.sort((a, b) => {
  if(a.rowRight !== b.rowRight) {
    return a.rowRight - b.rowRight
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredRowRightArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
 const rowRightPlayerOccurrences = filteredRowRightPercentileArray.filter(obj => obj.player === userInput);
 
 //percentile row right
const mostRecentRowRightPlayerOccurrences = rowRightPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (rowRightPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentRowRightPlayerOccurrences[userInput];
    const index = filteredRowRightPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredRowRightPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setRowRightPercentile(wholePercentile);
    } else {
      setRowRightPercentile(null);
    }
  } else {
    setRowRightPercentile(null);
  }
}, [filteredRowRightPercentileArray, userInput, rowRightPlayerOccurrences, mostRecentRowRightPlayerOccurrences]);

 //percentage change for row right
useEffect(() => {
  if (filteredRowRightArray.length > 1) {
    const currentIndex = filteredRowRightArray.findIndex((obj, index) => {
      if (index < filteredRowRightArray.length - 1) {
        return obj.createdAt !== filteredRowRightArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredRowRightArray[currentIndex].rowRight;
      const nextData = filteredRowRightArray[currentIndex + 1].rowRight;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setRowRightChange(changePercentage.toFixed(2));
    } else {
      setRowRightChange(null);
    }
  } else {
    setRowRightChange(null);
  }
}, [filteredRowRightArray]);
     
    
     const filteredRowLeftPercentileArray = levelDataArray.filter(obj => obj.rowLeft !== null);
     const filteredRowLeftArray = levelDataArray.filter(obj => obj.player === userInput && obj.rowLeft !== null);
     filteredRowLeftPercentileArray.sort((a, b) => {
      if(a.rowLeft !== b.rowLeft) {
        return a.rowLeft - b.rowLeft
      }
      else {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    filteredRowLeftArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
     const rowLeftPlayerOccurrences = filteredRowLeftPercentileArray.filter(obj => obj.player === userInput);
     
  //percentile row left
const mostRecentRowLeftPlayerOccurrences = rowLeftPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (rowLeftPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentRowLeftPlayerOccurrences[userInput];
    const index = filteredRowLeftPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredRowLeftPercentileArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setRowLeftPercentile(wholePercentile);
    } else {
      setRowLeftPercentile(null);
    }
  } else {
    setRowLeftPercentile(null);
  }
}, [filteredRowLeftPercentileArray, userInput, rowLeftPlayerOccurrences, mostRecentRowLeftPlayerOccurrences]);

     //percentage change for ROW LEFT
useEffect(() => {
  if (filteredRowLeftArray.length > 1) {
    const currentIndex = filteredRowLeftArray.findIndex((obj, index) => {
      if (index < filteredRowLeftArray.length - 1) {
        return obj.createdAt !== filteredRowLeftArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredRowLeftArray[currentIndex].rowLeft;
      const nextData = filteredRowLeftArray[currentIndex + 1].rowLeft;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setRowLeftChange(changePercentage.toFixed(2));
    } else {
      setRowLeftChange(null);
    }
  } else {
    setRowLeftChange(null);
  }
}, [filteredRowLeftArray]);

    return (
        <Box m={"20px"}>
             <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={"Proteus"} subtitle="Metrics: Press, Row"/>
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
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Press (D)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Press (N)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Row (D)</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Row (N)</TableCell>
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
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.pressRight}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.pressLeft}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.rowRight}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.rowLeft}</TableCell>
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
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ pressRightChange !== null ? pressRightChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ pressLeftChange !== null ? pressLeftChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ rowRightChange !== null ? rowRightChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ rowLeftChange !== null ? rowLeftChange : ""}</TableCell>
            </TableRow>
        <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16, color: '#868dfb'}}>
                Averages
              </TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}></TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averagePressRight > 0 ? averagePressRight : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averagePressLeft > 0 ? averagePressLeft : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageRowRight > 0 ? averageRowRight : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageRowLeft > 0 ? averageRowLeft : ""}</TableCell>
            </TableRow>
            <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16}}>
                Percentile
              </TableCell>
              <TableCell></TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ pressRightPercentile !== null ? pressRightPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ pressLeftPercentile !== null ? pressLeftPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ rowRighttPercentile !== null ? rowRighttPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ rowLeftPercentile !== null ? rowLeftPercentile : ""}</TableCell>
            </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
        </Box>
    )
}
export default Proteus;