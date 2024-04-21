import { useState } from "react"
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar"
import 'react-pro-sidebar/dist/css/styles.css'
import { Box, IconButton, Typography, useTheme } from "@mui/material"
import { Link } from "react-router-dom"
import { tokens } from "../../theme"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined"
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined"
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import DatasetIcon from '@mui/icons-material/Dataset';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';

const Item = ({title, to, icon, selected, setSelected}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <MenuItem active={selected === title} 
        style={{color: colors.grey[100]}} 
        onClick={() => setSelected(title)}
        icon={icon}
        >
        <Typography>{title}</Typography>
        <Link to={to}/>
        </MenuItem>
    )
}

const Sidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard")

    return (
        <Box
        sx={{
            "& .pro-sidebar-inner": {
                background: `${colors.primary[400]} !important`
            }, 
            "& .pro-icon-wrapper": {
                backgroundColor: "transparent !important"
            }, 
            "& .pro-inner-item" : {
                padding: "5px 35px 5px 20px !important"
            }, 
            "& .pro-inner-item:hover": {
                color: "#868dfb !important"
            }, 
            "& .pro-menu-item.active": {
                color: "#6870fa !important "
            }
        }}>
            <ProSidebar collapsed={isCollapsed}>
            <Menu iconShape="square">
                <MenuItem onClick={() => setIsCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{
                    margin: "10px 0 20px 0",
                    color: colors.grey[100],
                }}
                >
                    {!isCollapsed && (
                        <Box display="flex" 
                        justifyContent="space-between" 
                        alignItems="center" 
                        marginLeft="15px">
                            <Typography variant="h3" color={colors.grey[100]}>R&D Baseball</Typography>
                            <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                <MenuOutlinedIcon />
                            </IconButton>
                        </Box>
                    )}
                </MenuItem>

            {!isCollapsed && (
                <Box mb="25px">
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <img 
                        alt="not working"
                        width="100px"
                        height="100px"
                        src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUiQJqcoFq9jhOVkkdc6DsGiQGu90EJoei3g&usqp=CAU`}
                        style={{cursor:"pointer", borderRadius:"50%"}}
                        />
                    </Box>
                    <Box textAlign="center">
                        <Typography variant="h2" 
                        color={colors.grey[100]} 
                        fontWeight="bold" 
                        sx={{ marginTop: "10px"}}>
                            Brian Kownacki
                            </Typography>
                        <Typography variant="h5" color={colors.greenAccent[500]}>
                            Director of Sports Performance
                            </Typography>
                    </Box>
                </Box>
            )}
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                <Item 
                title="Dashboard"
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                />

                <Typography variant="h6"
                color={colors.grey[300]}
                sx={{margin: "15px 0 0 20px"}}>
                    Admin
                </Typography>

                 <Item 
                title="Manage Team"
                to="/team"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                />
                <Typography variant="h6"
                color={colors.grey[300]}
                sx={{margin: "15px 0 5px 20px"}}>
                    Data Entry
                </Typography>

                 <Item 
                title="Profile Form"
                to="/form"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                />
                <Item 
                title="Data Form"
                to="/dataEntry"
                icon={<DatasetIcon />}
                selected={selected}
                setSelected={setSelected}
                />
                <Typography variant="h6"
                color={colors.grey[300]}
                sx={{margin: "15px 0 5px 20px"}}>
                    Data
                </Typography>
                <Item 
                title="Proteus"
                to="/proteus"
                icon={<PrecisionManufacturingIcon />}
                selected={selected}
                setSelected={setSelected}
                />
                <Item 
                title="TBDL FVP"
                to="/tbdl"
                icon={<FitnessCenterIcon />}
                selected={selected}
                setSelected={setSelected}
                />
                 <Item 
                title="Arm Strength"
                to="/armstrength"
                icon={<SportsBaseballIcon />}
                selected={selected}
                setSelected={setSelected}
                />
                 <Item 
                title="Jumping"
                to="/jumping"
                icon={<BoltOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                />
                 <Item 
                title="Rotational Power"
                to="/rotPower"
                icon={<ThreeSixtyIcon />}
                selected={selected}
                setSelected={setSelected}
                />
                <Item 
                title="Rotational Acceleration"
                to="/rotAccel"
                icon={<ElectricBoltIcon />}
                selected={selected}
                setSelected={setSelected}
                />
                <Item 
                title="Speed"
                to="/speed"
                icon={<SpeedOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                />
                <Item 
                title="Body Composition"
                to="/body"
                icon={<AccessibilityIcon />}
                selected={selected}
                setSelected={setSelected}
                />

                </Box>
                </Menu>
                </ProSidebar>
    </Box>
    )
}

export default Sidebar