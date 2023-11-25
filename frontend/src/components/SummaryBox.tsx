import {Box, CircularProgress, Grid, Paper, Stack, Typography} from "@mui/material";
import {FontWeight} from "../theme/utils";
import {useEffect, useState} from "react";
import {getHumanResponse} from "../services/getHumanResponse";
import {getGPTResponse} from "../services/getGPTResponse";
import {getFineTunedGPTResponse} from "../services/getFineTunedGPTResponse";

type Props = {
    id: string;
}
export const SummaryBox = ({id}: Props) => {
    const [humanResponse, setHumanResponse] = useState<string>('');
    const [ossResponse, setOssResponse] = useState<string>("");
    const [gptResponse, setGptResponse] = useState<string>("");
    const [fineTunedResponse, setFineTunedResponse] = useState<string>("");

    const [humanResponseLoading, setHumanResponseLoading] = useState<boolean>(false);
    const [ossResponseLoading, setOssResponseLoading] = useState<boolean>(false);
    const [gptResponseLoading, setGptResponseLoading] = useState<boolean>(false);
    const [fineTunedResponseLoading, setFineTunedResponseLoading] = useState<boolean>(false);

    useEffect(() => {
        console.log("Use effect called!")
        loadHumanResponse();
        loadOssResponse();
        loadGptResponse();
        loadFineTunedResponse();
    },[id]);

    const loadHumanResponse = async () => {
        setHumanResponseLoading(true);
        const response = await getHumanResponse(id);
        setHumanResponse(response);
        setHumanResponseLoading(false);
    }

    const loadOssResponse = async () => {
        setOssResponseLoading(true);
        setOssResponse("Tohle je jen sample text ahoj jak se máš!");
        setOssResponseLoading(false);
    }

    const loadGptResponse = async () => {
        setGptResponseLoading(true);
        const response = await getGPTResponse(id);
        setGptResponse(response);
        setGptResponseLoading(false);
    }

    const loadFineTunedResponse = async () => {
        setFineTunedResponseLoading(true);
        const response = await getFineTunedGPTResponse(id);
        setFineTunedResponse(response);
        setFineTunedResponseLoading(false);
    }

    return (
        <Grid container columnSpacing={0} rowSpacing={4} width={"800px"} height={"900px"}>
            <Grid item xs={12}>
                <Stack>
                    <Typography fontWeight={FontWeight.Bold} fontSize={18}>Lékař</Typography>
                    <Paper variant={"outlined"} sx={{padding: "15px", minHeight: "100px"}}>
                        {humanResponseLoading ? (
                            <Box display="flex" alignItems="center" justifyContent="center" height={"100px"} width={"100%"}>
                                 <CircularProgress />
                            </Box>
                        ) : (
                            humanResponse
                        )}
                    </Paper>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Typography fontWeight={FontWeight.Bold} fontSize={18}>Fine Tuned GPT</Typography>
                <Paper variant={"outlined"} sx={{padding: "15px", minHeight: "100px"}}>
                    {fineTunedResponseLoading ? (
                        <Box display="flex" alignItems="center" justifyContent="center" height={"100px"} width={"100%"}>
                            <CircularProgress />
                        </Box>
                    ): (
                        fineTunedResponse
                    )}
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Typography fontWeight={FontWeight.Bold} fontSize={18}>Open-Source LLM</Typography>
                <Paper variant={"outlined"} sx={{padding: "15px", minHeight: "100px"}}>
                    {ossResponseLoading ? (
                        <Box display="flex" alignItems="center" justifyContent="center" height={"100px"} width={"100%"}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        ossResponse
                    )}
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Typography fontWeight={FontWeight.Bold} fontSize={18}>Chat GPT</Typography>
                <Paper variant={"outlined"} sx={{padding: "15px", minHeight: "100px"}}>
                    {gptResponseLoading ? (
                        <Box display="flex" alignItems="center" justifyContent="center" height={"100px"} width={"100%"}>
                            <CircularProgress />
                        </Box>
                    ): (
                        gptResponse
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}