import { Box, useTheme, TextField, Button, MenuItem, FormControl, Select, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableFooter, TableRow} from "@mui/material";
import Header from "../../components/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect } from "react";
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

const Body = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)
    const isNonMobile = useMediaQuery("(min-width:600px)")

  const [bodyUsers, setBodyUsers] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [users, setUsers] = useState([])
  const [id, setId] = useState('');
  const [dataArray, setDataArray] = useState([]);
  const [levelId, setLevelId] = useState('');
  const [levelDataArray, setLevelDataArray] = useState([]);
  const [weightPercentile, setWeightPercentile] = useState(null)
  const [percentageChange, setPercentageChange] = useState(null);


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
        const fetchBodyUsers = async () => {
            const response = await fetch('http://localhost:4000/api/data')
            const json = await response.json()
            if (response.ok) {
                setBodyUsers(json)
            }
        }
        fetchBodyUsers()
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
          console.log(json)
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

    //average for weight
let weightSum = 0;
let weightCount = 0;
for (let i = 0; i < levelDataArray.length; i++) {
  if (levelDataArray[i].weight !== null) {
    weightSum += levelDataArray[i].weight;
    weightCount++;
  }
}
const levelAverageWeight = (weightSum / weightCount).toFixed(1);

const userInput = selectedPlayer
const filteredPercentileWeightArray = levelDataArray.filter(obj => obj.weight !== null);
const filteredWeightArray = levelDataArray.filter(obj => obj.player === userInput && obj.weight !== null);
filteredPercentileWeightArray.sort((a, b) => {
  if(a.weight !== b.weight) {
    return a.weight - b.weight
  }
  else {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
})
filteredWeightArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
const weightPlayerOccurrences = filteredPercentileWeightArray.filter(obj => obj.player === userInput);

//percentile weight
const mostRecentWeightPlayerOccurrences = weightPlayerOccurrences.reduce((accumulator, obj) => {
  if (!accumulator[obj.player] || new Date(obj.createdAt) > new Date(accumulator[obj.player].createdAt)) {
    accumulator[obj.player] = obj;
  }
  return accumulator;
}, {});

useEffect(() => {
  if (weightPlayerOccurrences.length > 0) {
    const playerOccurrence = mostRecentWeightPlayerOccurrences[userInput];
    const index = filteredPercentileWeightArray.findIndex(obj => obj === playerOccurrence);
    
    if (index !== -1) {
      const percentile = (index / (filteredPercentileWeightArray.length - 1)) * 100;
      const wholePercentile = percentile.toFixed(1);
      setWeightPercentile(wholePercentile);
    } else {
      setWeightPercentile(null);
    }
  } else {
    setWeightPercentile(null);
  }
}, [filteredPercentileWeightArray, userInput, weightPlayerOccurrences, mostRecentWeightPlayerOccurrences]);

//percentage change for weight
useEffect(() => {
  if (filteredWeightArray.length > 1) {
    const currentIndex = filteredWeightArray.findIndex((obj, index) => {
      if (index < filteredWeightArray.length - 1) {
        return obj.createdAt !== filteredWeightArray[index + 1].createdAt;
      }
      return false;
    });

    if (currentIndex !== -1) {
      const currentData = filteredWeightArray[currentIndex].weight;
      const nextData = filteredWeightArray[currentIndex + 1].weight;
      const changePercentage = ((nextData - currentData) / currentData) * 100;
      setPercentageChange(changePercentage.toFixed(2));
    } else {
      setPercentageChange(null);
    }
  } else {
    setPercentageChange(null);
  }
}, [filteredWeightArray]);

    return (
        <Box m={"20px"}>
             <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={"Body"} subtitle="Metrics: Weight and Body Composition"/>
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
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Weight</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Chest Fold</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Abdominal Fold</TableCell>
            <TableCell align="right" sx={{fontSize: 14, color: colors.greenAccent[400]}}>Thigh Fold</TableCell>
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
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.weight}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.chestFold}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.abdominalFold}</TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: colors.redAccent[400]}}>{row.thighFold}</TableCell>
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
              <TableCell align="right" sx={{fontSize: 16, color: "#94e2cd"}}>{ percentageChange !== null ? percentageChange : ""}</TableCell>
            </TableRow>
        <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16, color: '#868dfb'}}>
                Averages
              </TableCell>
              <TableCell align="right" sx={{fontSize: 16}}></TableCell>
              <TableCell align="right" sx={{fontSize: 16, color: '#868dfb'}}>{levelAverageWeight > 0 ? levelAverageWeight : ""}</TableCell>
            </TableRow>
            <TableRow
              key={levelDataArray.level}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 16}}>
                Percentile
              </TableCell>
              <TableCell></TableCell>
              <TableCell align="right" sx={{fontSize: 16}}>{ weightPercentile !== null ? weightPercentile : ""}</TableCell>
            </TableRow>

        </TableFooter>
      </Table>
    </TableContainer>
</Box>
    )

}

export default Body;