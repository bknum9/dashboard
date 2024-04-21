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

const Speed = () => {
  const theme = useTheme();
    const colors = tokens(theme.palette.mode)
  const isNonMobile = useMediaQuery("(min-width:600px)")

  const [speedUsers, setSpeedUsers] = useState([])
  const [users, setUsers] = useState([])
  const [id, setId] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [dataArray, setDataArray] = useState([]);
  const [levelId, setLevelId] = useState('');
  const [levelDataArray, setLevelDataArray] = useState([]);
  const [tenYardSprintPercentile, settenYardSprintPercentile] = useState(null)
  const [thirtyYardSprintPercentile, setthirtyYardSprintPercentile] = useState(null)
  const [tenYardSprintChange, settenYardSprintChange] = useState(null)
  const [thirtyYardSprintChange, setthirtyYardSprintChange] = useState(null)

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
        const fetchSpeedUsers = async () => {
            const response = await fetch('http://localhost:4000/api/data')
            const json = await response.json()
            if (response.ok) {
                setSpeedUsers(json)
            }
        }
        fetchSpeedUsers()
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
          //console.log(levelDataArray)
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
    console.log(dataArray.tenYardSprint)
  };

const averageTenYardSprint = calculateAverage(levelDataArray, 'tenYardSprint')
const averageThirtyYardSprint = calculateAverage(levelDataArray, 'thirtyYardSprint')


const userInput = selectedPlayer
const filteredTenYardSprintPercentileArray = levelDataArray.filter(obj => obj.tenYardSprint !== null);
const filteredTenYardSprintArray = levelDataArray.filter(obj => obj.player === userInput && obj.tenYardSprint !== null);
filteredTenYardSprintPercentileArray.sort((a, b) => {
  if(a.tenYardSprint !== b.tenYardSprint) {
    return a.tenYardSprint - b.tenYardSprint
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredTenYardSprintArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const tenYardSprintPlayerOccurrences = filteredTenYardSprintPercentileArray.filter(obj => obj.player === userInput);

//percentile 10 yd
const mostRecent10ydPlayerOccurrences = tenYardSprintPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (tenYardSprintPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecent10ydPlayerOccurrences[userInput];
    const index = filteredTenYardSprintPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredTenYardSprintPercentileArray.length - 1)) * 100;
      const invertedPercentile = 100 - percentile
      const wholePercentile = invertedPercentile.toFixed(1);
      settenYardSprintPercentile(wholePercentile);
    } else {
      settenYardSprintPercentile(null);
    }
  } else {
    settenYardSprintPercentile(null);
  }
}, [filteredTenYardSprintPercentileArray, userInput, tenYardSprintPlayerOccurrences, mostRecent10ydPlayerOccurrences]);

//percentage change for 10 yd sprint
useEffect(() => {
  if (filteredTenYardSprintArray.length > 1) {
    const currentIndex = filteredTenYardSprintArray.findIndex((obj, index) => {
      if (index < filteredTenYardSprintArray.length - 1) {
        return obj.createdAt !== filteredTenYardSprintArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredTenYardSprintArray[currentIndex].tenYardSprint;
      const nextData = filteredTenYardSprintArray[currentIndex + 1].tenYardSprint;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      settenYardSprintChange(changePercentage.toFixed(2));
    } else {
      settenYardSprintChange(null);
    }
  } else {
    settenYardSprintChange(null);
  }
}, [filteredTenYardSprintArray]);

const filteredThirtyYardSprintPercentileArray = levelDataArray.filter(obj => obj.thirtyYardSprint !== null);
const filteredThirtyYardSprintArray = levelDataArray.filter(obj => obj.player === userInput && obj.thirtyYardSprint !== null);
filteredThirtyYardSprintPercentileArray.sort((a, b) => {
  if(a.thirtyYardSprint !== b.thirtyYardSprint) {
    return a.thirtyYardSprint - b.thirtyYardSprint
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredThirtyYardSprintArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const thirtyYardSprintPlayerOccurrences = filteredThirtyYardSprintPercentileArray.filter(obj => obj.player === userInput);

//percentile 30 yd sprint
const mostRecent30ydPlayerOccurrences = thirtyYardSprintPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (thirtyYardSprintPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecent30ydPlayerOccurrences[userInput];
    const index = filteredThirtyYardSprintPercentileArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredThirtyYardSprintPercentileArray.length - 1)) * 100;
      const invertedPercentile = 100 - percentile
      const wholePercentile = invertedPercentile.toFixed(1);
      setthirtyYardSprintPercentile(wholePercentile);
    } else {
      setthirtyYardSprintPercentile(null);
    }
  } else {
    setthirtyYardSprintPercentile(null);
  }
}, [filteredThirtyYardSprintPercentileArray, userInput, thirtyYardSprintPlayerOccurrences, mostRecent30ydPlayerOccurrences]);

//percentage change for 30 yd sprint
useEffect(() => {
  if (filteredThirtyYardSprintArray.length > 1) {
    const currentIndex = filteredThirtyYardSprintArray.findIndex((obj, index) => {
      if (index < filteredThirtyYardSprintArray.length - 1) {
        return obj.createdAt !== filteredThirtyYardSprintArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredThirtyYardSprintArray[currentIndex].thirtyYardSprint;
      const nextData = filteredThirtyYardSprintArray[currentIndex + 1].thirtyYardSprint;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setthirtyYardSprintChange(changePercentage.toFixed(2));
    } else {
      setthirtyYardSprintChange(null);
    }
  } else {
    setthirtyYardSprintChange(null);
  }
}, [filteredThirtyYardSprintArray]);


    return (
        <Box m={"20px"}>
             <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={"Speed"} subtitle="Metrics: 10 yd Sprint, 30 yd Sprint"/>
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
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>10 yd Sprint</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>30 yd Sprint</TableCell>
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
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.tenYardSprint}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.thirtyYardSprint}</TableCell>
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
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ tenYardSprintChange !== null ? tenYardSprintChange : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ thirtyYardSprintChange !== null ? thirtyYardSprintChange : ""}</TableCell>
            </TableRow>
        <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16, color: '#868dfb'}}>
                Averages
              </TableCell>
              <TableCell align="right" sx={{fontSize: 16}}></TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageTenYardSprint > 0 ? averageTenYardSprint : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{averageThirtyYardSprint > 0 ? averageThirtyYardSprint : ""}</TableCell>
            </TableRow>
            <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16}}>
                Percentile
              </TableCell>
              <TableCell></TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ tenYardSprintPercentile !== null ? tenYardSprintPercentile : ""}</TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ thirtyYardSprintPercentile !== null ? thirtyYardSprintPercentile : ""}</TableCell>
            </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
        </Box>
    )
}
export default Speed;