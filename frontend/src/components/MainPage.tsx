import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { PageHeader } from "./PageHeader";
import { SearchBar } from "./SearchBar";
import { Colors } from "../theme/colors";
import { MedicalHistory } from "./MedicalHistory";
import { useEffect, useState } from "react";
import { getHospitalizationList } from "../services/getHospitalizationList";
import { getHospitalizationDetail } from "../services/getHospitalizationDetail";
import { Hospitalization } from "../model/Hospitalization";
import { FontWeight } from "../theme/utils";
import { SummaryBox } from "./SummaryBox";
import { CustomHospitalizationDialog } from "./CustomHospitalizationDialog";
import { postCustomHospitalization } from "../services/postCustomHospitalization";

export const MainPage = () => {
  const [hospitalizations, setHospitalizations] = useState<string[]>([]);
  const [detail, setDetail] = useState<Hospitalization | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  useEffect(() => {
    loadAllHospitalizations();
  }, []);

  const loadAllHospitalizations = async () => {
    const response = await getHospitalizationList();
    setHospitalizations(response);
  };

  const loadHospitalizationDetail = async (hospitalizationId: string) => {
    setIsCustom(false);
    const response = await getHospitalizationDetail(hospitalizationId);
    setDetail(response);
  };

  const handleDialogSubmit = async (hospitalization: Hospitalization) => {
    setIsCustom(true);
    const response_id = await postCustomHospitalization(hospitalization);
    setDetail({
      id: response_id,
      problemsAtAdmission: hospitalization.problemsAtAdmission,
      findingsAtAdmission: hospitalization.findingsAtAdmission,
      conclusionAtAdmission: hospitalization.conclusionAtAdmission,
      reasonForHospitalisation: hospitalization.reasonForHospitalisation,
      operationsAtDischarge: hospitalization.operationsAtDischarge,
      examsAtDischarge: hospitalization.examsAtDischarge,
    });
  };

  return (
    <Stack height={"100vh"}>
      <PageHeader />
      <Stack
        alignItems={"center"}
        marginTop={2}
        height={"90%"}
        paddingBottom={3}
      >
        <Stack direction={"row"} spacing={3} alignItems={"center"}>
          <Typography fontSize={18} fontWeight={FontWeight.SemiBold}>
            Vyberte z existujicích hospitalizací
          </Typography>
          <SearchBar
            options={hospitalizations}
            onSearchClick={loadHospitalizationDetail}
          />
          <Typography fontSize={18} fontWeight={FontWeight.SemiBold}>
            nebo
          </Typography>
          <Button
            variant={"contained"}
            sx={{ height: "53px" }}
            onClick={() => setDialogOpen(true)}
          >
            <Typography fontWeight={FontWeight.Bold} fontSize={18} noWrap>
              Přidejte novou hospitalizaci
            </Typography>
          </Button>
        </Stack>

        {detail ? (
          <Stack
            direction={"row"}
            spacing={10}
            height={"90%"}
            alignItems={"center"}
            justifyContent={"space-around"}
            paddingTop={5}
          >
            <MedicalHistory data={detail} />
            <Box
              marginTop={5}
              sx={{
                height: "80%",
                background: Colors.grey150,
                width: "5px",
              }}
            ></Box>
            <SummaryBox id={detail.id} isCustom={isCustom} />
          </Stack>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="80%"
          >
            <Stack spacing={10} alignItems={"center"}>
              <Typography
                fontWeight={FontWeight.Bold}
                fontSize={20}
                color={Colors.grey500}
              >
                Pro vygenerování propouštěcí zprávy zvolte hospitalizaci
              </Typography>
              <Typography color={Colors.grey500} fontSize={18}>
                Nebo si prohlédněte naši
                <Link
                  marginLeft={1}
                  fontSize={20}
                  color={"inherit"}
                  fontWeight={FontWeight.Bold}
                  href={"http://disquill.mild.blue:8080/swagger#/"}
                  target={"_blank"}
                >
                  API
                </Link>
              </Typography>
            </Stack>
          </Box>
        )}
      </Stack>
      <CustomHospitalizationDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />
    </Stack>
  );
};
