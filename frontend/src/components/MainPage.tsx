import { Box, Button, Stack, Typography } from "@mui/material";
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

export const MainPage = () => {
  const [hospitalizations, setHospitalizations] = useState<string[]>([]);
  const [detail, setDetail] = useState<Hospitalization | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [customHospitalization, setCustomHospitalization] =
    useState<string>("");

  useEffect(() => {
    console.log("Loading all hospitalizations");
    loadAllHospitalizations();
  }, []);

  const loadAllHospitalizations = async () => {
    const response = await getHospitalizationList();
    setHospitalizations(response);
  };

  const loadHospitalizationDetail = async (hospitalizationId: string) => {
    const response = await getHospitalizationDetail(hospitalizationId);
    setDetail(response);
  };

  console.log(customHospitalization);

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
              Přidejte vlastní hospitalizaci
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
                // maxHeight: "80%",
                background: Colors.grey150,
                width: "5px",
              }}
            ></Box>
            <SummaryBox id={detail.id} />
          </Stack>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="500px"
          >
            <Typography
              fontWeight={FontWeight.Bold}
              fontSize={20}
              color={Colors.grey300}
            >
              Pro vygenerování propouštěcí zprávy zvolte hospitalizaci
            </Typography>
          </Box>
        )}
      </Stack>
      <CustomHospitalizationDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={(text) => setCustomHospitalization(text)}
      />
    </Stack>
  );
};
