import { List, Stack, Typography } from "@mui/material";
import { FontWeight } from "../theme/utils";
import { Hospitalization } from "../model/Hospitalization";
import { MedicalHistoryEntry } from "./MedicalHistoryEntry";

type Props = {
  data: Hospitalization;
};

export const MedicalHistory = ({ data }: Props) => {
  return (
    <Stack>
      <Typography fontWeight={FontWeight.Bold} fontSize={22} paddingBottom={2}>
        Anamnéza pacienta
      </Typography>
      <Stack
        width={"700px"}
        justifyContent={"flex-start"}
        maxHeight={"800px"}
        overflow={"auto"}
        pr={5}
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
      </Stack>
    </Stack>
  );
};
