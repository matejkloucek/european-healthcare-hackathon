import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { FontWeight } from "../theme/utils";
import { useEffect, useState } from "react";
import { getHumanResponse } from "../services/getHumanResponse";
import { getGPTResponse } from "../services/getGPTResponse";
import { getFineTunedGPTResponse } from "../services/getFineTunedGPTResponse";
import { getOssResponse } from "../services/getOssReponse";
import { Colors } from "../theme/colors";

type Props = {
  id: string;
  isCustom: boolean;
};
export const SummaryBox = ({ id, isCustom }: Props) => {
  const [humanResponse, setHumanResponse] = useState<string>("");
  const [ossResponse, setOssResponse] = useState<string>("");
  const [gptResponse, setGptResponse] = useState<string>("");
  const [fineTunedResponse, setFineTunedResponse] = useState<string>("");

  const [humanResponseLoading, setHumanResponseLoading] =
    useState<boolean>(false);
  const [ossResponseLoading, setOssResponseLoading] = useState<boolean>(false);
  const [gptResponseLoading, setGptResponseLoading] = useState<boolean>(false);
  const [fineTunedResponseLoading, setFineTunedResponseLoading] =
    useState<boolean>(false);

  useEffect(() => {
    console.log("Use effect called!");
    loadHumanResponse();
    loadOssResponse();
    loadGptResponse();
    loadFineTunedResponse();
  }, [id]);

  const loadHumanResponse = async () => {
    setHumanResponseLoading(true);
    const response = await getHumanResponse(id);
    setHumanResponse(response);
    setHumanResponseLoading(false);
  };

  const loadOssResponse = async () => {
    setOssResponseLoading(true);
    const response = await getOssResponse(id);
    setOssResponse(response);
    setOssResponseLoading(false);
  };

  const loadGptResponse = async () => {
    setGptResponseLoading(true);
    const response = await getGPTResponse(id);
    setGptResponse(response);
    setGptResponseLoading(false);
  };

  const loadFineTunedResponse = async () => {
    setFineTunedResponseLoading(true);
    const response = await getFineTunedGPTResponse(id);
    setFineTunedResponse(response);
    setFineTunedResponseLoading(false);
  };

  return (
    <Stack width={"45%"} paddingRight={8} height={"100%"}>
      <Typography fontWeight={FontWeight.Bold} fontSize={22} paddingBottom={1}>
        Průběh hospitalizace ze závěrečné zprávy
      </Typography>
      <Stack maxHeight={"100%"} overflow={"auto"} paddingRight={3}>
        <Grid container columnSpacing={0} rowSpacing={2}>
          {!isCustom && !!humanResponse && (
            <Grid item xs={12}>
              <Stack>
                <Typography fontWeight={FontWeight.Bold} fontSize={18}>
                  Lékař
                </Typography>
                <Paper
                  variant={"outlined"}
                  sx={{ padding: "15px", minHeight: "100px" }}
                >
                  {humanResponseLoading ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      height={"100px"}
                      width={"100%"}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    humanResponse
                  )}
                </Paper>
              </Stack>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography fontWeight={FontWeight.Bold} fontSize={18}>
              Open-Source LLM
            </Typography>
            <Paper
              variant={"outlined"}
              sx={{ padding: "15px", minHeight: "100px" }}
            >
              {ossResponseLoading ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height={"100px"}
                  width={"100%"}
                >
                  <Stack alignItems={"center"} spacing={1}>
                    <CircularProgress />
                    <Typography color={Colors.grey500}>
                      Generování může trvat delší dobu kvůli dočasným
                      hardwarovým omezením.
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                ossResponse
              )}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight={FontWeight.Bold} fontSize={18}>
              Fine Tuned GPT 3.5
            </Typography>
            <Paper
              variant={"outlined"}
              sx={{ padding: "15px", minHeight: "100px" }}
            >
              {fineTunedResponseLoading ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height={"100px"}
                  width={"100%"}
                >
                  <CircularProgress />
                </Box>
              ) : (
                fineTunedResponse
              )}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight={FontWeight.Bold} fontSize={18}>
              GPT 3.5
            </Typography>
            <Paper
              variant={"outlined"}
              sx={{ padding: "15px", minHeight: "100px" }}
            >
              {gptResponseLoading ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height={"100px"}
                  width={"100%"}
                >
                  <CircularProgress />
                </Box>
              ) : (
                gptResponse
              )}
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
};
