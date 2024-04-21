import { Box, useTheme, MenuItem, TextField, Button, InputLabel, Select, FormControl } from "@mui/material";
import { useState, useEffect } from "react";
import { Formik, } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox"
import LevelStatBox from "../../components/LevelStatBox";
import { formatDate } from "fullcalendar";
const {rotatorCuffStrength, rotationalPowerScore, calculateBodyFat, calculateProteusScore, rotationalAccelerationScore, milesPerHour} = require('../dashboard/functions')


const initialValues = {
  player:'',
  level: ''
}

const bodySchema = yup.object().shape({
  player: yup.string().required(),
  level: yup.string().required(),
})

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)")

  const calculateAverage = (dataArray, attribute) => {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i][attribute] !== null) {
        sum += dataArray[i][attribute];
        count++;
      }
    }
    return sum / count;
  };

  const [strengthUsers, setStrengthUsers] = useState([])
  const [users, setUsers] = useState([])
  const [id, setId] = useState('');
  const [dataArray, setDataArray] = useState([]);
  const [levelId, setLevelId] = useState('');
  const [levelDataArray, setLevelDataArray] = useState([{level:''}]);
  const [filteredData, setFilteredData] = useState([]);
  const [rotAccel, setRotAccel] = useState('')
  const [level, setLevel] = useState('')

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

    const handleFormSubmit = async (values, {resetForm}) => {
      resetForm()
      try {
      const dataUser = values.player
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
  
 

const averageLegLength = calculateAverage(levelDataArray, 'lbLimbLength');
const tbdl1RmAverage = calculateAverage(levelDataArray, 'tbdl1Rm');
const averageWeight = calculateAverage(levelDataArray, 'weight');
const averageBoundLeft = calculateAverage(levelDataArray, 'lateralBoundLeft');
const averageBoundRight = calculateAverage(levelDataArray, 'lateralBoundRight')
const averageBroadJump = calculateAverage(levelDataArray, 'broadJump')
const averageThirtyYardSprint = calculateAverage(levelDataArray, 'thirtyYardSprint')
const averageChestFold = calculateAverage(levelDataArray, 'chestFold')
const averageAbdominalFold = calculateAverage(levelDataArray, 'abdominalFold')
const averageThighFold = calculateAverage(levelDataArray, 'thighFold')
const averagePressRight = calculateAverage(levelDataArray, 'pressRight');
const averagePressLeft = calculateAverage(levelDataArray, 'pressLeft');
const averageRowRight = calculateAverage(levelDataArray, 'rowRight');
const averageRowLeft = calculateAverage(levelDataArray, 'rowLeft');
const averageShotputPowerRight = calculateAverage(levelDataArray, 'shotputPowerRight');
const averageShotputPowerLeft = calculateAverage(levelDataArray, 'shotputPowerLeft');
const averageTrunkPowerRight = calculateAverage(levelDataArray, 'trunkRotPowerRight');
const averageTrunkPowerLeft = calculateAverage(levelDataArray, 'trunkRotPowerLeft');
const averagePlyoPowerRight = calculateAverage(levelDataArray, 'plyoRotPowerRight');
const averagePlyoPowerLeft = calculateAverage(levelDataArray, 'plyoRotPowerLeft');
const averageFlexionRight = calculateAverage(levelDataArray, 'd2flexionRight');
const averageFlexionLeft = calculateAverage(levelDataArray, 'd2flexionLeft');
const averageExtensionRight = calculateAverage(levelDataArray, 'd2extensionRight');
const averageExtensionLeft = calculateAverage(levelDataArray, 'd2extensionLeft');
const averageMbScoopRight = calculateAverage(levelDataArray, 'mbScoopRight');
const averageMbScoopLeft = calculateAverage(levelDataArray, 'mbScoopLeft');
const averageMbRotOhRight = calculateAverage(levelDataArray, 'mbRotOhRight');
const averageMbRotOhLeft = calculateAverage(levelDataArray, 'mbRotOhLeft');
const averageShoulderEr = calculateAverage(levelDataArray, 'shoulderEr');
const averageShoulderIr = calculateAverage(levelDataArray, 'shoulderIr');
const averageScaption = calculateAverage(levelDataArray, 'scaption');
const averageGripD = calculateAverage(levelDataArray, 'gripD');
const averageShotputAccelRight = calculateAverage(levelDataArray, 'shotputAccelRight');
const averageShotputAccelLeft = calculateAverage(levelDataArray, 'shotputAccelLeft');
const averageTrunkAccelRight = calculateAverage(levelDataArray, 'trunkRotAccelRight');
const averageTrunkAccelLeft = calculateAverage(levelDataArray, 'trunkRotAccelLeft');
const averagePlyoAccelRight = calculateAverage(levelDataArray, 'plyoRotAccelRight');
const averagePlyoAccelLeft = calculateAverage(levelDataArray, 'plyoRotAccelLeft');

useEffect(() => {
  handleFormSubmit();
}, []);

useEffect(() => {
  if (dataArray && dataArray.length > 0) {
    const sortedData = [...dataArray].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setFilteredData([sortedData[0]]);
  }
}, [dataArray]);



  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Performance Testing Dashboard" subtitle="Welcome to your dashboard" />
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
      <Box
        display="grid"
        gridTemplateColumns="repeat(15, 1fr)"
        gridAutoRows="180px"
        gap="20px"
      >
        
        {filteredData.map((data) => (
<>
{/* ROW 1 */}
<Box
gridColumn="span 3"
backgroundColor={colors.primary[400]}
display= 'flex'
alignItems="center"
justifyContent="center"
>
<StatBox
  date={formatDate(data.createdAt)}
  key={data._id}
  data={calculateBodyFat(data.chestFold, data.abdominalFold, data.thighFold, data.level) > 0 ? calculateBodyFat(data.chestFold, data.abdominalFold, data.thighFold, data.level) : ""}
  metric="Percent Body Fat"
  name={data.player}
/>
</Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
             date={formatDate(data.createdAt)}
             key={data._id}
             data={milesPerHour(data.thirtyYardSprint)}
             metric="Top Speed (mph)"
             name={data.player}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
             date={formatDate(data.createdAt)}
             key={data._id}
             data={calculateProteusScore(data.pressRight, data.pressLeft, data.rowRight, data.rowLeft, data.shotputPowerRight, data.shotputPowerLeft, data.trunkRotPowerRight, data.trunkRotPowerLeft, data.plyoRotPowerRight, data.plyoRotPowerLeft, data.d2flexionRight, data.d2flexionLeft, data.d2extensionRight, data.d2extensionLeft, data.weight, data.level) < 5 ? calculateProteusScore(data.pressRight, data.pressLeft, data.rowRight, data.rowLeft, data.shotputPowerRight, data.shotputPowerLeft, data.trunkRotPowerRight, data.trunkRotPowerLeft, data.plyoRotPowerRight, data.plyoRotPowerLeft, data.d2flexionRight, data.d2flexionLeft, data.d2extensionRight, data.d2extensionLeft, data.weight, data.level): ""}
             metric="Proteus Score"
             name={data.player}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
             date={formatDate(data.createdAt)}
             key={data._id}
             data={rotationalAccelerationScore(data.shotputAccelLeft, data.shotputAccelRight, data.trunkRotAccelLeft, data.trunkRotAccelRight, data.plyoRotAccelLeft, data.plyoRotAccelRight, data.level)}
             metric="Rotational Acceleration Score"
             name={data.player}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
             date={formatDate(data.createdAt)}
             key={data._id}
             data={rotationalPowerScore(data.shotputPowerLeft, data.shotputPowerRight, data.trunkRotPowerLeft, data.trunkRotPowerRight, data.plyoRotPowerLeft, data.plyoRotPowerRight, data.mbScoopRight, data.mbScoopLeft, data.mbRotOhRight, data.mbRotOhLeft)}
             metric="Rotational Power Score"
             name={data.player}
          />
        </Box>
        </>
            ))}


<Box
gridColumn="span 3"
backgroundColor={colors.primary[800]}
display= 'flex'
alignItems="center"
justifyContent="center"
>
  <LevelStatBox 
  metric="Percent Body Fat"
  level={levelDataArray[0].level || ""}
  data={calculateBodyFat(averageChestFold, averageAbdominalFold, averageThighFold, levelDataArray[0].level) > 0 ? calculateBodyFat(averageChestFold, averageAbdominalFold, averageThighFold, levelDataArray[0].level) : ''}

  />
</Box>
<Box
gridColumn="span 3"
backgroundColor={colors.primary[800]}
display= 'flex'
alignItems="center"
justifyContent="center"
>
  <LevelStatBox 
  metric="Top Speed (mph)"
  level={levelDataArray[0].level || ""}
  data={milesPerHour(averageThirtyYardSprint) > 0 ? (milesPerHour(averageThirtyYardSprint)) : ""}

  />
</Box>
<Box
gridColumn="span 3"
backgroundColor={colors.primary[800]}
display= 'flex'
alignItems="center"
justifyContent="center"
>
  <LevelStatBox 
  metric="Proteus Score"
  level={levelDataArray[0].level || ""}
  data={calculateProteusScore(averagePressRight, averagePressLeft, averageRowRight, averageRowLeft, averageShotputPowerRight, averageShotputPowerLeft, averageTrunkPowerRight, averageTrunkPowerLeft, averagePlyoPowerRight, averagePlyoPowerLeft, averageFlexionRight, averageFlexionLeft, averageExtensionRight, averageExtensionLeft, averageWeight, levelDataArray[0].level)  > 0 ? calculateProteusScore(averagePressRight, averagePressLeft, averageRowRight, averageRowLeft, averageShotputPowerRight, averageShotputPowerLeft, averageTrunkPowerRight, averageTrunkPowerLeft, averagePlyoPowerRight, averagePlyoPowerLeft, averageFlexionRight, averageFlexionLeft, averageExtensionRight, averageExtensionLeft, averageWeight, levelDataArray[0].level) : ""}

  />
</Box>
<Box
gridColumn="span 3"
backgroundColor={colors.primary[800]}
display= 'flex'
alignItems="center"
justifyContent="center"
>
  <LevelStatBox 
  metric="Rotational Acceleration Score"
  level={levelDataArray[0].level || ""}
  data={rotationalAccelerationScore(averageShotputAccelLeft, averageShotputAccelRight, averageTrunkAccelLeft, averageTrunkAccelRight, averagePlyoAccelLeft, averagePlyoAccelRight, levelDataArray[0].level) > 0 ? rotationalAccelerationScore(averageShotputAccelLeft, averageShotputAccelRight, averageTrunkAccelLeft, averageTrunkAccelRight, averagePlyoAccelLeft, averagePlyoAccelRight, levelDataArray[0].level): ''}

  />
</Box>
<Box
gridColumn="span 3"
backgroundColor={colors.primary[800]}
display= 'flex'
alignItems="center"
justifyContent="center"
>
  <LevelStatBox 
  metric="Rotational Power Score"
  level={levelDataArray[0].level || ""}
  data={rotationalPowerScore(averageShotputPowerLeft, averageShotputPowerRight, averageTrunkPowerLeft, averageTrunkPowerRight, averagePlyoPowerLeft, averagePlyoPowerRight, averageMbScoopRight, averageMbScoopLeft, averageMbRotOhRight, averageMbRotOhLeft, levelDataArray[0].level) > 0 ? rotationalPowerScore(averageShotputPowerLeft, averageShotputPowerRight, averageTrunkPowerLeft, averageTrunkPowerRight, averagePlyoPowerLeft, averagePlyoPowerRight, averageMbScoopRight, averageMbScoopLeft, averageMbRotOhRight, averageMbRotOhLeft, levelDataArray[0].level) : ""}

  />
</Box>
{filteredData.map((data) => (
<>
         {/* ROW 2 */}
         <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
             date={formatDate(data.createdAt)}
             key={data._id}
             data={(data.lateralBoundRight / data.lbLimbLength).toFixed(2)}
             metric="Lateral Bound Ratio (R)"
             name={data.player}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
             date={formatDate(data.createdAt)}
             key={data._id}
             data={(data.lateralBoundLeft / data.lbLimbLength).toFixed(2)}
             metric="Lateral Bound Ratio (L)"
             name={data.player}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
             date={formatDate(data.createdAt)}
             key={data._id}
             data={(data.broadJump / data.lbLimbLength).toFixed(2)}
             metric="Broad Jump Ratio"
             name={data.player}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
             date={formatDate(data.createdAt)}
             key={data._id}
            data={(data.tbdl1Rm / data.weight).toFixed(2) < 5 ? (data.tbdl1Rm / data.weight).toFixed(2) : ""}
            metric="TBDL Relative Strength"
            name={data.player}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
             date={formatDate(data.createdAt)}
             key={data._id}
            data={rotatorCuffStrength(data.shoulderEr, data.shoulderIr, data.scaption, data.d2flexionRight, data.d2flexionLeft, data.d2extensionRight, data.d2extensionLeft)}
            metric="Rotator Cuff Strength"
            name={data.player}
          />
        </Box>
        </>
            ))}
  <Box
gridColumn="span 3"
backgroundColor={colors.primary[800]}
display= 'flex'
alignItems="center"
justifyContent="center"
>
  <LevelStatBox 
  metric="Lateral Bound Ratio (R)"
  level={levelDataArray[0].level || ""}
  data={(averageBoundRight/averageLegLength).toFixed(2) > 0 ? (averageBoundRight/averageLegLength).toFixed(2) : ""}

  />
</Box>
<Box
gridColumn="span 3"
backgroundColor={colors.primary[800]}
display= 'flex'
alignItems="center"
justifyContent="center"
>
  <LevelStatBox 
  metric="Lateral Bound Ratio (L)"
  level={levelDataArray[0].level || ""}
  data={(averageBoundLeft/averageLegLength).toFixed(2) > 0 ? (averageBoundLeft/averageLegLength).toFixed(2) : ""}

  />
</Box>
<Box
gridColumn="span 3"
backgroundColor={colors.primary[800]}
display= 'flex'
alignItems="center"
justifyContent="center"
>
  <LevelStatBox 
  metric="Broad Jump Ratio"
  level={levelDataArray[0].level || ""}
  data={(averageBroadJump/averageLegLength).toFixed(2) > 0 ? (averageBroadJump/averageLegLength).toFixed(2) : ""}

  />
</Box>
<Box
gridColumn="span 3"
backgroundColor={colors.primary[800]}
display= 'flex'
alignItems="center"
justifyContent="center"
>
  <LevelStatBox 
  metric="TBDL Relative Strength"
  level={levelDataArray[0].level || ""}
  data={(tbdl1RmAverage/averageWeight).toFixed(2) > 0 ? (tbdl1RmAverage/averageWeight).toFixed(2) : ""}

  />
</Box>
<Box
gridColumn="span 3"
backgroundColor={colors.primary[800]}
display= 'flex'
alignItems="center"
justifyContent="center"
>
  <LevelStatBox 
  metric="Rotator Cuff Strength"
  level={levelDataArray[0].level || ""}
  data={rotatorCuffStrength(averageShoulderEr, averageShoulderIr, averageScaption, averageFlexionRight, averageFlexionLeft, averageExtensionRight, averageExtensionLeft) > 0 ? rotatorCuffStrength(averageShoulderEr, averageShoulderIr, averageScaption, averageFlexionRight, averageFlexionLeft, averageExtensionRight, averageExtensionLeft) : ""}

  />
</Box>

        
        
        
      </Box>
    </Box>
  );
};

export default Dashboard;