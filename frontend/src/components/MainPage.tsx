import {Box, Button, Stack, Typography} from "@mui/material";
import { PageHeader } from "./PageHeader";
import { SearchBar } from "./SearchBar";
import { Colors } from "../theme/colors";
import { MedicalHistory } from "./MedicalHistory";
import { useEffect, useState } from "react";
import { getHospitalizationList } from "../services/getHospitalizationList";
import { getHospitalizationDetail } from "../services/getHospitalizationDetail";
import { Hospitalization } from "../model/Hospitalization";
import { FontWeight } from "../theme/utils";
import {SummaryBox} from "./SummaryBox";

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
          <Button variant={"contained"} sx={{height: "53px"}}>
            <Typography fontWeight={FontWeight.Bold} fontSize={18}>
              Přidejte vlastní hospitalizaci
            </Typography>
          </Button>
        </Stack>

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
            <SummaryBox id={detail.id}/>
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
              Pro vygenerování propouštěcí zprávy zvolte hospitalizaci
            </Typography>
          </Box>
        )}
      </Stack>
    </>
  );
};
