import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { FontWeight } from "../theme/utils";

type Props = {
  title: string;
  text: string;
};

export const MedicalHistoryEntry = (props: Props) => {
  return (
    <ListItem sx={{ alignItems: "flex-start", display: "flex" }}>
      <ListItemIcon sx={{ marginTop: "7px" }}>
        <FiberManualRecordIcon style={{ fontSize: 10 }} />
      </ListItemIcon>
      <ListItemText sx={{ marginLeft: -3, alignItems: "flex-start" }}>
        <Typography fontWeight={FontWeight.Bold}>{props.title}:</Typography>
        {props.text}
      </ListItemText>
    </ListItem>
  );
};
