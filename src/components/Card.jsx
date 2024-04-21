import { Card, Box, CardContent, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";


const StatCard = ({data, metric, date, playerName}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    return (
        <Box>
        <Card sx={{ display: 'flex', width: 400, margin: 1, height: 200, alignItems:'center'}}>
            <CardContent>
            <Typography variant="h2" sx={{ color: colors.blueAccent[500] }}>
                {playerName}
            </Typography>
            <Typography variant="h3" sx={{ color: colors.redAccent[500] }}>
                {metric}
            </Typography>
            <Typography variant="h4" sx={{ color: colors.greenAccent[500] }}>
                {date}
            </Typography>
            <Typography variant="h4" sx={{ color: colors.grey[200] }}>
                {data}
            </Typography>
            </CardContent>
        </Card>
        </Box>
    )
}

export default StatCard