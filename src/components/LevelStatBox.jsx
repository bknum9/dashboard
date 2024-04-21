import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const LevelStatBox = ({ data, metric, level }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 10px">
      <Box>
        <Box>
        <Typography variant="h3" sx={{ color: colors.blueAccent[500] }}>
          {metric}
        </Typography>
        </Box>
      <Box mt="2px">
        <Typography variant="h4" sx={{ color: colors.greenAccent[500] }}>
          {data}
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: colors.grey[100] }}
        >
          {level}
        </Typography>
      </Box>
      </Box>
    </Box>
  );
};

export default LevelStatBox;