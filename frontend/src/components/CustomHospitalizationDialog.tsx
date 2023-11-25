import {
  Box,
  Button,
  Dialog,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FontWeight } from "../theme/utils";
import { Hospitalization } from "../model/Hospitalization";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hospitalization: Hospitalization) => void;
};

export const CustomHospitalizationDialog = (props: Props) => {
  const [problemsAtAdmission, setProblemsAtAdmission] = useState<string>("");
  const [findingsAtAdmission, setFindingsAtAdmission] = useState<string>("");
  const [conclusionAtAdmission, setConclusionAtAdmission] =
    useState<string>("");
  const [reasonForHospitalisation, setReasonForHospitalisation] =
    useState<string>("");
  const [operationsAtDischarge, setOperationsAtDischarge] =
    useState<string>("");
  const [examsAtDischarge, setExamsAtDischarge] = useState<string>("");

  const handleClick = () => {
    props.onSubmit({
      id: "1",
      problemsAtAdmission: problemsAtAdmission,
      findingsAtAdmission: findingsAtAdmission,
      conclusionAtAdmission: conclusionAtAdmission,
      reasonForHospitalisation: reasonForHospitalisation,
      operationsAtDischarge: operationsAtDischarge,
      examsAtDischarge: examsAtDischarge,
    });
  };

  const handleProblemsTextFieldChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setProblemsAtAdmission(event.target.value);
  };
  const handleFindingsTextFieldChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setFindingsAtAdmission(event.target.value);
  };
  const handleConclusionsTextFieldChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setConclusionAtAdmission(event.target.value);
  };
  const handleReasonsTextFieldChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setReasonForHospitalisation(event.target.value);
  };
  const handleOperationsTextFieldChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setOperationsAtDischarge(event.target.value);
  };
  const handleExamsTextFieldChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setExamsAtDischarge(event.target.value);
  };

  return (
    <Dialog open={props.isOpen} onClose={props.onClose} fullWidth>
      <Stack padding={2} spacing={1} maxHeight={"850px"}>
        <Typography
          fontWeight={FontWeight.Bold}
          fontSize={22}
          paddingBottom={1}
        >
          Nová hospitalizace
        </Typography>
        <Typography fontWeight={FontWeight.Bold}>Nynější onemocnění</Typography>
        <TextField
          multiline
          placeholder={"Zadejte pacientova nynější onemocněnní..."}
          value={problemsAtAdmission}
          onChange={handleProblemsTextFieldChange}
        />
        <Typography fontWeight={FontWeight.Bold}>Objektivní nález</Typography>
        <TextField
          multiline
          placeholder={"Zadejte objektivní nález..."}
          value={findingsAtAdmission}
          onChange={handleFindingsTextFieldChange}
        />
        <Typography fontWeight={FontWeight.Bold}>Závěr při přijetí</Typography>
        <TextField
          multiline
          placeholder={"Zadejte závěr při přijetí..."}
          value={conclusionAtAdmission}
          onChange={handleConclusionsTextFieldChange}
        />
        <Typography fontWeight={FontWeight.Bold}>
          Důvod k hospitalizaci
        </Typography>
        <TextField
          multiline
          placeholder={"Zadejte důvod k hospitalizaci..."}
          value={reasonForHospitalisation}
          onChange={handleReasonsTextFieldChange}
        />
        <Typography fontWeight={FontWeight.Bold}>Provedené zákroky</Typography>
        <TextField
          multiline
          placeholder={"Zadejte provedené zákroky..."}
          value={operationsAtDischarge}
          onChange={handleOperationsTextFieldChange}
        />
        <Typography fontWeight={FontWeight.Bold}>Provedené testy</Typography>
        <TextField
          multiline
          placeholder={"Zadejte provedené testy..."}
          value={examsAtDischarge}
          onChange={handleExamsTextFieldChange}
        />
        <Box
          sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
          paddingTop={1}
        >
          <Button variant="contained" onClick={handleClick}>
            <Typography fontWeight={FontWeight.Bold}>Přidat</Typography>
          </Button>
        </Box>
      </Stack>
    </Dialog>
  );
};
