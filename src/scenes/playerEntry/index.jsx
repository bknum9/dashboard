import { Box, Button, TextField, MenuItem, InputLabel, Select, FormControl, Alert, Collapse } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useState } from "react";
//import { handleBreakpoints } from "@mui/system";



const initialValues = {
    name: "",
    age:"",
    position: "",
    schoolOrg: "",
    level:"",
}

const userSchema = yup.object().shape({
    name: yup.string().required("required"),
    position: yup.string().required("required"),
    schoolOrg: yup.string().required("required"),
    age: yup.number().required("required"),
    level: yup.string().required("required"),
})



const Form = () => {

  const [open, setOpen] = useState(false);

    const isNonMobile = useMediaQuery("(min-width:600px)")
    const handleFormSubmit = async (values, {resetForm}) => {
        const response = await fetch('http://localhost:4000/api/user', {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const json = await response.json()
        if (response.ok) {
          console.log(json)
          setOpen(true)
        }
        resetForm({values:''})
    }

    return (
        <Box m="20px">
            <Header title="Create User" subtitle="Create a New Profile" /> 
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
          User has been created!
        </Alert>
      </Collapse>
    </Box>

            <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={userSchema}
            >
                {({values, errors, touched, handleBlur, handleChange, handleSubmit}) => (
                    <form onSubmit={handleSubmit}>

                        <Box display="grid" gap="30px" gridTemplateColumns="repeat(6, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                        }}
                        >
<TextField 
fullWidth
variant="filled"
type="text"
label="Full Name"
onBlur={handleBlur}
onChange={handleChange}
value={values.name}
name="name"
error={!!touched.name && !!errors.name}
helperText={touched.name && errors.name}
sx={{gridColumn: "span 3"}}
/>
<TextField
  fullWidth
  variant="filled"
  type="text"
  label="School / Organization"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.schoolOrg}
  name="schoolOrg"
  error={!!touched.schoolOrg && !!errors.schoolOrg}
  helperText={touched.schoolOrg && errors.schoolOrg}
  sx={{ gridColumn: "span 3" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Age"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.age}
  name="age"
  error={!!touched.age && !!errors.age}
  helperText={touched.age && errors.age}
  sx={{ gridColumn: "span 2" }}
/>
<FormControl fullWidth
sx={{ gridColumn: "span 2" }}>
         <InputLabel id="positionLabel">Position</InputLabel>
        <Select
          labelId="position"
          id="position"
          value={values.position}
          label="position"
          onChange={handleChange}
          name="position"
          variant="filled"
          
            >
          <MenuItem value={"Pitcher"}>Pitcher</MenuItem>
          <MenuItem value={"Catcher"}>Catcher</MenuItem>
          <MenuItem value={"Infield"}>Infield</MenuItem>
          <MenuItem value={"Outfield"}>Outfield</MenuItem>
          </Select>
          </FormControl>
              
           <FormControl fullWidth
           sx={{ gridColumn: "span 2" }}>
         <InputLabel id="demo-simple-select-label">Level</InputLabel>
        <Select
          labelId="demo-simple-select-"
          id="demo-simple-select"
         value={values.level}
          label="level"
          onChange={handleChange}
          name="level"
          variant="filled"
          sx={{ gridColumn: "span 2" }}
            >
          <MenuItem value={"High School"}>High School</MenuItem>
          <MenuItem value={"College"}>College</MenuItem>
          <MenuItem value={"Pro"}>Professional</MenuItem>
          </Select>
          </FormControl>
              
                </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
                    </form>

                )}
            </Formik>
        </Box>
    )
}

export default Form