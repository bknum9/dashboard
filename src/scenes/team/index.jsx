import { Box, useTheme } from "@mui/material";
import { useEffect, useState} from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Team = () => {

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

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        {field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell",},
        {field: "age", headerName: "Age", type: "number", headerAlign: "left", align: "left", fontSize:'16px'},
        {field: "position", headerName: "Position", flex: 1,},
        {field: "level", headerName: "Level", flex: 1,},
        {field: "schoolOrg", headerName: "School / Organization", flex: 1,},
    ]

    return (
        <Box m="20px">
            <Header title="Team" subtitle="Managing team members" />
            <Box m="40px 0 0 0" height="75vh" sx={{
                "& .MuiDataGrid-foot": {
                    border: "none"
                },
                "&. MuiDataGrid-cell": {
                    borderBottom: "none"
                },
                "& .name-column--cell": {
                    color: colors.greenAccent[300],
                    fontSize:'16px'
                }, 
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                    borderBottom: 'none',
                    fontSize:'16px'
                }, 
                "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400],
                }, 
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.blueAccent[700],
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${colors.grey[100]} !important`,
                }
            }}>
                <DataGrid 
                rows={users}
                getRowId={(row) => row._id}
                columns={columns}
                components={{Toolbar: GridToolbar}}
                />
            </Box>
        </Box>
    )


}

export default Team;