import { List, Paper, Stack, Typography } from "@mui/material";
import { FontWeight } from "../theme/utils";
import { Hospitalization } from "../model/Hospitalization";
import { MedicalHistoryEntry } from "./MedicalHistoryEntry";

type Props = {
  data: Hospitalization;
};

export const MedicalHistory = ({ data }: Props) => {
  return (
    <Stack width={"45%"} paddingLeft={8} height={"100%"}>
      <Typography fontWeight={FontWeight.Bold} fontSize={22} paddingBottom={1}>
        Informace o hospitalizaci
      </Typography>
      <Paper
        variant={"outlined"}
        sx={{
          justifyContent: "flex-start",
          maxHeight: "100%",
          overflow: "auto",
          paddingRight: 3,
        }}
      >
        <List>
          <MedicalHistoryEntry
            title={"Nynější onemocnění"}
            text={data.problemsAtAdmission}
          />
          <MedicalHistoryEntry
            title={"Objektivní nález"}
            text={data.findingsAtAdmission}
          />
          <MedicalHistoryEntry
            title={"Závěr při přijetí"}
            text={data.conclusionAtAdmission}
          />
          <MedicalHistoryEntry
            title={"Důvod hospitalizace"}
            text={data.reasonForHospitalisation}
          />
          <MedicalHistoryEntry
            title={"Provedené zákroky"}
            text={data.operationsAtDischarge}
          />
          <MedicalHistoryEntry
            title={"Provedené testy"}
            text={data.examsAtDischarge}
          />
        </List>
      </Paper>
    </Stack>
  );
};
