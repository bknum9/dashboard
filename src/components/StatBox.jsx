import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const StatBox = ({ data, metric, name, date }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 10px">
      <Box display="block" justifyContent="space-between">
        <Box>
        <Typography variant="h3" sx={{ color: colors.blueAccent[500] }}>
          {metric}
        </Typography>
        </Box>
      <Box display="inline" justifyContent='space-between' mt="2px">
        <Typography variant="h4" sx={{ color: colors.greenAccent[500] }}>
          {data}
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: colors.grey[100] }}
        >
          {name}
        </Typography>
      </Box>
        <Box>
          <Typography
            variant="h5"
            fontStyle="italic"
            sx={{ color: colors.grey[300] }}
          >
            {date}
          </Typography>
        </Box>
      </Box>
      
    </Box>
  );
};

export default StatBox;