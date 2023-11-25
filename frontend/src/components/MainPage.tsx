import { Box, Stack, Typography } from "@mui/material";
import { PageHeader } from "./PageHeader";
import { SearchBar } from "./SearchBar";
import { Colors } from "../theme/colors";
import { MedicalHistory } from "./MedicalHistory";
import { useEffect, useState } from "react";
import { getHospitalizationList } from "../services/getHospitalizationList";
import { getHospitalizationDetail } from "../services/getHospitalizationDetail";
import { Hospitalization } from "../model/Hospitalization";
import { FontWeight } from "../theme/utils";

export const MainPage = () => {
  const [hospitalizations, setHospitalizations] = useState<string[]>([]);
  const [detail, setDetail] = useState<Hospitalization | undefined>(undefined);

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

  return (
    <>
      <PageHeader />
      <Stack alignItems={"center"} marginTop={2}>
        <SearchBar
          options={hospitalizations}
          onSearchClick={loadHospitalizationDetail}
        />
        {detail ? (
          <Stack
            direction={"row"}
            spacing={10}
            marginTop={5}
            height={"800px"}
            alignItems={"center"}
          >
            <MedicalHistory data={detail} />
            <Box
              marginTop={5}
              sx={{
                height: "700px",
                background: Colors.grey150,
                width: "5px",
              }}
            ></Box>
            <Stack width={"700px"}>klsdjkas</Stack>
          </Stack>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="500px" // Adjust as needed
          >
            <Typography
              fontWeight={FontWeight.Bold}
              fontSize={20}
              color={Colors.grey300}
            >
              Pro načtení anamnézy zvolte hospitalizaci
            </Typography>
          </Box>
        )}
      </Stack>
    </>
  );
};
