import { Box, Button, TextField, MenuItem, Alert, Collapse, Divider, Select, InputLabel, FormControl } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState, useEffect} from "react";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const initialValues = {
  player:'',
  level:"",
    mbRotOhRight: "", 
    mbRotOhLeft: "", 
    mbScoopRight: "",
    mbScoopLeft: "",
    pressRight: "",
    pressLeft: "",
    rowRight: "",
    rowLeft:"",
    shotputPowerRight: "",
    shotputPowerLeft: "",
    shotputAccelRight: "",
    shotputAccelLeft: "",
    trunkRotPowerRight: "",
    trunkRotPowerLeft: "",
    trunkRotAccelRight: "",
    trunkRotAccelLeft: "",
    plyoRotPowerRight: "",
    plyoRotPowerLeft: "",
    plyoRotAccelRight: "",
    plyoRotAccelLeft: "",
    weight: '',
    chestFold: '',
    abdominalFold: '',
    thighFold: '',
    lbLimbLength:'',
    lateralBoundRight: '',
    lateralBoundLeft: '',
    broadJump: '',
    tbdlVelo135: '',
    tbdlVelo185: '',
    tbdlVelo225: '',
    tbdlVelo275: '',
    tbdlVelo315: '',
    tbdlVelo365: '',
    tbdlVelo405: '',
    tbdlVelo455: '',
    tenYardSprint: '',
    thirtyYardSprint: '',
    d2flexionRight: "",
    d2extensionRight: "",
    d2flexionLeft: "",
    d2extensionLeft: "",
    shoulderEr: "",
    shoulderIr: "",
    scaption: "",
    grip: "",
    tbdl1Rm: "",
}


const dataSchema = yup.object().shape({
    player: yup.string().required("required"),
    level: yup.string().required("required"),
    mbRotOhRight: yup.number(), 
    mbRotOhLeft: yup.number(),
    mbScoopRight: yup.number(),
    mbScoopLeft: yup.number(),
    pressRight: yup.number(),
    pressLeft: yup.number(),
    rowRight: yup.number(),
    rowLeft: yup.number(),
    shotputPowerRight: yup.number(),
    shotputPowerLeft: yup.number(),
    shotputAccelRight: yup.number(),
    shotputAccelLeft: yup.number(),
    trunkRotPowerRight: yup.number(),
    trunkRotPowerLeft: yup.number(),
    trunkRotAccelRight: yup.number(),
    trunkRotAccelLeft: yup.number(),
    plyoRotPowerRight: yup.number(),
    plyoRotPowerLeft: yup.number(),
    plyoRotAccelRight: yup.number(),
    plyoRotAccelLeft: yup.number(),
    weight: yup.number(),
    chestFold: yup.number(),
    abdominalFold: yup.number(),
    thighFold: yup.number(),
    lbLimbLength: yup.number(),
    lateralBoundRight: yup.number(),
    lateralBoundLeft: yup.number(),
    broadJump: yup.number(),
    tbdlVelo135: yup.number(),
    tbdlVelo185: yup.number(),
    tbdlVelo225: yup.number(),
    tbdlVelo275: yup.number(),
    tbdlVelo315: yup.number(),
    tbdlVelo365: yup.number(),
    tbdlVelo405: yup.number(),
    tbdlVelo455: yup.number(),
    tenYardSprint: yup.number(),
    thirtyYardSprint: yup.number(),
    d2flexionRight: yup.number(),
    d2extensionRight: yup.number(),
    d2flexionLeft: yup.number(),
    d2extensionLeft: yup.number(),
    shoulderEr: yup.number(),
    shoulderIr: yup.number(),
    scaption: yup.number(),
    grip: yup.number(),
    tbdl1Rm: yup.number(),
})

const DataEntry = () => {

  const [users, setUsers] = useState([])

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

    const isNonMobile = useMediaQuery("(min-width:600px)")
    const handleFormSubmit = async (values, {resetForm}) => {
      const response = await fetch('http://localhost:4000/api/data', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const json = await response.json()
      if (response.ok) {
        console.log('new info added', json)
        setOpen(true)
      }
      resetForm({values:''})
  }

  const [open, setOpen] = useState(false);

    return (
        <Box m="20px">
            <Header title="Data Form" subtitle="Enter all metrics" /> 
            <Box sx={{ width: '100%' }}>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Data has been submitted!
        </Alert>
      </Collapse>
    </Box>
            <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={dataSchema}
            >
                {({values, errors, touched, handleBlur, handleChange, handleSubmit}) => (
                    <form onSubmit={handleSubmit}>

                        <Box display="grid" gap="30px" gridTemplateColumns="repeat(8, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 8" },
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
          sx={{gridColumn: "span 4"}}
        >
          {users.map((option) => (
            <MenuItem key={option._id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        <FormControl fullWidth
           sx={{ gridColumn: "span 4" }}>
         <InputLabel id="demo-simple-select-label">Level</InputLabel>
        <Select
          labelId="demo-simple-select-"
          id="demo-simple-select"
         value={values.level}
          label="level"
          onChange={handleChange}
          name="level"
          variant="filled"
          sx={{ gridColumn: "span 4" }}
            >
          <MenuItem value={"High School"}>High School</MenuItem>
          <MenuItem value={"College"}>College</MenuItem>
          <MenuItem value={"Pro"}>Professional</MenuItem>
          </Select>
          </FormControl>

<Divider sx={{gridColumn: "span 8"}}>Body Composition</Divider>
<TextField 
fullWidth
variant="filled"
type="number"
label="Body Weight (lbs.)"
onBlur={handleBlur}
onChange={handleChange}
value={values.weight}
name="weight"
error={!!touched.weight && !!errors.weight}
helperText={touched.weight && errors.weight}
sx={{gridColumn: "span 2"}}
/>
                                
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Chest Skinfold (mm)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.chestFold}
  name="chestFold"
  error={!!touched.chestFold && !!errors.chestFold}
  helperText={touched.chestFold && errors.chestFold}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Abdominal Skinfold (mm)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.abdominalFold}
  name="abdominalFold"
  error={!!touched.abdominalFold && !!errors.abdominalFold}
  helperText={touched.abdominalFold && errors.abdominalFold}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Thigh Skinfold (mm)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.thighFold}
  name="thighFold"
  error={!!touched.thighFold && !!errors.thighFold}
  helperText={touched.thighFold && errors.thighFold}
  sx={{ gridColumn: "span 2" }}
/>
  <Divider sx={{gridColumn: "span 8"}}>Arm Strength</Divider>
  <TextField
  fullWidth
  variant="filled"
  type="number"
  label="Shoulder External Rotation (D)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.shoulderEr}
  name="shoulderEr"
  error={!!touched.shoulderEr && !!errors.shoulderEr}
  helperText={touched.shoulderEr && errors.shoulderEr}
  sx={{ gridColumn: "span 2" }}
  />
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Shoulder Internal Rotation (D)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.shoulderIr}
  name="shoulderIr"
  error={!!touched.shoulderIr && !!errors.shoulderIr}
  helperText={touched.shoulderIr && errors.shoulderIr}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Scaption (D)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.scaption}
  name="scaption"
  error={!!touched.scaption && !!errors.scaption}
  helperText={touched.scaption && errors.scaption}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Grip"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.grip}
  name="grip"
  error={!!touched.grip && !!errors.grip}
  helperText={touched.grip&& errors.grip}
  sx={{ gridColumn: "span 2" }}
/>

<Divider sx={{gridColumn: "span 8"}}>Lower Body Power</Divider>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Leg Length (inch)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.lbLimbLength}
  name="lbLimbLength"
  error={!!touched.lbLimbLength && !!errors.lbLimbLength}
  helperText={touched.lbLimbLength && errors.lbLimbLength}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Broad Jump (inch)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.broadJump}
  name="broadJump"
  error={!!touched.broadJump && !!errors.broadJump}
  helperText={touched.broadJump && errors.broadJump}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Lateral Bound Right (inch)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.lateralBoundRight}
  name="lateralBoundRight"
  error={!!touched.lateralBoundRight && !!errors.lateralBoundRight}
  helperText={touched.lateralBoundRight && errors.lateralBoundRight}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Lateral Bound Left (inch)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.lateralBoundLeft}
  name="lateralBoundLeft"
  error={!!touched.lateralBoundLeft && !!errors.lateralBoundLeft}
  helperText={touched.lateralBoundLeft && errors.lateralBoundLeft}
  sx={{ gridColumn: "span 2" }}
/>
        <Divider sx={{gridColumn: "span 8"}}>Proteus</Divider>
       
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Press (D)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.pressRight}
  name="pressRight"
  error={!!touched.pressRight && !!errors.pressRight}
  helperText={touched.pressRight && errors.pressRight}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Press (N)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.pressLeft}
  name="pressLeft"
  error={!!touched.pressLeft && !!errors.pressLeft}
  helperText={touched.pressLeft && errors.pressLeft}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Row (D)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.rowRight}
  name="rowRight"
  error={!!touched.rowRight && !!errors.rowRight}
  helperText={touched.rowRight && errors.rowRight}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Row (N)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.rowLeft}
  name="rowLeft"
  error={!!touched.rowLeft && !!errors.rowLeft}
  helperText={touched.rowLeft && errors.rowLeft}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Shotput Power (D)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.shotputPowerRight}
  name="shotputPowerRight"
  error={!!touched.shotputPowerRight && !!errors.shotputPowerRight}
  helperText={touched.shotputPowerRight && errors.shotputPowerRight}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Shotput Power (N)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.shotputPowerLeft}
  name="shotputPowerLeft"
  error={!!touched.shotputPowerLeft && !!errors.shotputPowerLeft}
  helperText={touched.shotputPowerLeft && errors.shotputPowerLeft}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Shotput Acceleration (D)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.shotputAccelRight}
  name="shotputAccelRight"
  error={!!touched.shotputAccelRight && !!errors.shotputAccelRight}
  helperText={touched.shotputAccelRight && errors.shotputAccelRight}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Shotput Acceleration (N)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.shotputAccelLeft}
  name="shotputAccelLeft"
  error={!!touched.shotputAccelLeft && !!errors.shotputAccelLeft}
  helperText={touched.shotputAccelLeft && errors.shotputAccelLeft}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Trunk Rotation Power (D)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.trunkRotPowerRight}
  name="trunkRotPowerRight"
  error={!!touched.trunkRotPowerRight && !!errors.trunkRotPowerRight}
  helperText={touched.trunkRotPowerRight && errors.trunkRotPowerRight}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Trunk Rotation Power (N)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.trunkRotPowerLeft}
  name="trunkRotPowerLeft"
  error={!!touched.trunkRotPowerLeft && !!errors.trunkRotPowerLeft}
  helperText={touched.trunkRotPowerLeft && errors.trunkRotPowerLeft}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Trunk Rotation Acceleration (D)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.trunkRotAccelRight}
  name="trunkRotAccelRight"
  error={!!touched.trunkRotAccelRight && !!errors.trunkRotAccelRight}
  helperText={touched.trunkRotAccelRight && errors.trunkRotAccelRight}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Trunk Rotation Acceleration (N)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.trunkRotAccelLeft}
  name="trunkRotAccelLeft"
  error={!!touched.trunkRotAccelLeft && !!errors.trunkRotAccelLeft}
  helperText={touched.trunkRotAccelLeft && errors.trunkRotAccelLeft}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Plyo Trunk Rotation Power (D)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.plyoRotPowerRight}
  name="plyoRotPowerRight"
  error={!!touched.plyoRotPowerRight && !!errors.plyoRotPowerRight}
  helperText={touched.plyoRotPowerRight && errors.plyoRotPowerRight}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Plyo Trunk Rotation Power (N)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.plyoRotPowerLeft}
  name="plyoRotPowerLeft"
  error={!!touched.plyoRotPowerLeft && !!errors.plyoRotPowerLeft}
  helperText={touched.plyoRotPowerLeft && errors.plyoRotPowerLeft}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Plyo Trunk Rotation Acceleration (D)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.plyoRotAccelRight}
  name="plyoRotAccelRight"
  error={!!touched.plyoRotAccelRight && !!errors.plyoRotAccelRight}
  helperText={touched.plyoRotAccelRight && errors.plyoRotAccelRight}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Plyo Trunk Rotation Acceleration (N)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.plyoRotAccelLeft}
  name="plyoRotAccelLeft"
  error={!!touched.plyoRotAccelLeft && !!errors.plyoRotAccelLeft}
  helperText={touched.plyoRotAccelLeft && errors.plyoRotAccelLeft}
  sx={{ gridColumn: "span 2" }}
/>
<TextField 
 fullWidth
 variant="filled"
 type="number"
 label="D2 Flexion (D)"
 onBlur={handleBlur}
 onChange={handleChange}
 value={values.d2flexionRight}
 name="d2flexionRight"
 error={!!touched.d2flexionRight && !!errors.d2flexionRight}
 helperText={touched.d2flexionRight && errors.d2flexionRight}
 sx={{gridColumn: "span 2"}}
 />
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="D2 Flexion (N)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.d2flexionLeft}
  name="d2flexionLeft"
  error={!!touched.d2flexionLeft && !!errors.d2flexionLeft}
  helperText={touched.d2flexionLeft && errors.d2flexionLeft}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="D2 Extension (D)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.d2extensionRight}
  name="d2extensionRight"
  error={!!touched.d2extensionRight && !!errors.d2extensionRight}
  helperText={touched.d2extensionRight && errors.d2extensionRight}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="D2 Extension (N)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.d2extensionLeft}
  name="d2extensionLeft"
  error={!!touched.d2extensionLeft && !!errors.d2extensionLeft}
  helperText={touched.d2extensionLeft && errors.d2extensionLeft}
  sx={{ gridColumn: "span 2" }}
/>

<Divider sx={{gridColumn: "span 8"}}>Speed</Divider>
<TextField 
fullWidth
variant="filled"
type="number"
label="10 yd Sprint (sec)"
onBlur={handleBlur}
onChange={handleChange}
value={values.tenYardSprint}
name="tenYardSprint"
error={!!touched.tenYardSprint && !!errors.tenYardSprint}
helperText={touched.tenYardSprint && errors.tenYardSprint}
sx={{gridColumn: "span 4"}}
/>
<TextField
    fullWidth
   variant="filled"
    type="number"
     label="30 yd Sprint (sec)"
     onBlur={handleBlur}
     onChange={handleChange}
    value={values.thirtyYardSprint}
    name="thirtyYardSprint"
    error={!!touched.thirtyYardSprint && !!errors.thirtyYardSprint}
    helperText={touched.thirtyYardSprint && errors.thirtyYardSprint}
    sx={{ gridColumn: "span 4" }}
    />
<Divider sx={{gridColumn: "span 8"}}>Rotational Power</Divider>
<TextField 
fullWidth
variant="filled"
type="number"
label="MB Rotational OH (D)"
onBlur={handleBlur}
onChange={handleChange}
value={values.mbRotOhRight}
 name="mbRotOhRight"
 error={!!touched.mbRotOhRight && !!errors.mbRotOhRight}
 helperText={touched.mbRotOhRight && errors.mbRotOhRight}
 sx={{gridColumn: "span 2"}}
 />
 <TextField
variant="filled"
type="number"
label="MB Rotational OH (N)"
onBlur={handleBlur}
onChange={handleChange}
value={values.mbRotOhLeft}
name="mbRotOhLeft"
error={!!touched.mbRotOhLeft && !!errors.mbRotOhLeft}
fullWidth
helperText={touched.mbRotOhLeft && errors.mbRotOhLeft}
sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="MB Scoop (D)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.mbScoopRight}
  name="mbScoopRight"
  error={!!touched.mbScoopRight && !!errors.mbScoopRight}
  helperText={touched.mbScoopRight && errors.mbScoopRight}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="MB Scoop (N)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.mbScoopLeft}
  name="mbScoopLeft"
  error={!!touched.mbScoopLeft && !!errors.mbScoopLeft}
  helperText={touched.mbScoopLeft && errors.mbScoopLeft}
  sx={{ gridColumn: "span 2" }}
/>
<Divider sx={{gridColumn: "span 8"}}>Trap Bar Force Velocity Profile</Divider>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="135 lbs (m/s)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.tbdlVelo135}
  name="tbdlVelo135"
  error={!!touched.tbdlVelo135 && !!errors.tbdlVelo135}
  helperText={touched.tbdlVelo135 && errors.tbdlVelo135}
  sx={{ gridColumn: "span 3" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="185 lbs (m/s)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.tbdlVelo185}
  name="tbdlVelo185"
  error={!!touched.tbdlVelo185 && !!errors.tbdlVelo185}
  helperText={touched.tbdlVelo185 && errors.tbdlVelo185}
  sx={{ gridColumn: "span 3" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="225 lbs (m/s)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.tbdlVelo225}
  name="tbdlVelo225"
  error={!!touched.tbdlVelo225 && !!errors.tbdlVelo225}
  helperText={touched.tbdlVelo225 && errors.tbdlVelo225}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="275 lbs (m/s)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.tbdlVelo275}
  name="tbdlVelo275"
  error={!!touched.tbdlVelo275 && !!errors.tbdlVelo275}
  helperText={touched.tbdlVelo275 && errors.tbdlVelo275}
  sx={{ gridColumn: "span 3" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="315 lbs (m/s)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.tbdlVelo315}
  name="tbdlVelo315"
  error={!!touched.tbdlVelo315 && !!errors.tbdlVelo315}
  helperText={touched.tbdlVelo315 && errors.tbdlVelo315}
  sx={{ gridColumn: "span 3" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="365 lbs (m/s)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.tbdlVelo365}
  name="tbdlVelo365"
  error={!!touched.tbdlVelo365 && !!errors.tbdlVelo365}
  helperText={touched.tbdlVelo365 && errors.tbdlVelo365}
  sx={{ gridColumn: "span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="405 lbs (m/s)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.tbdlVelo405}
  name="tbdlVelo405"
  error={!!touched.tbdlVelo405 && !!errors.tbdlVelo405}
  helperText={touched.tbdlVelo405 && errors.tbdlVelo405}
  sx={{ gridColumn: "span 3" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="455 lbs (m/s)"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.tbdlVelo455}
  name="tbdlVelo455"
  error={!!touched.tbdlVelo455 && !!errors.tbdlVelo455}
  helperText={touched.tbdlVelo455 && errors.tbdlVelo455}
  sx={{ gridColumn: "span 3" }}
/>
<TextField
fullWidth
variant="filled"
type="number"
label="TBDL Estimated 1RM (lbs.)"
onBlur={handleBlur}
onChange={handleChange}
value={values.tbdl1Rm}
name="tbdl1Rm"
error={!!touched.tbdl1Rm && !!errors.tbdl1Rm}
helperText={touched.tbdl1Rm && errors.tbdl1Rm}
sx={{ gridColumn: "span 2" }}
/>
                </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Submit
              </Button>
            </Box>
                    </form>
                )}
            </Formik>
        </Box>
    )
}

export default DataEntry