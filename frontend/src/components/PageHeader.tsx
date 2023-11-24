import {AppBar, Stack, Typography} from "@mui/material";
import {FontWeight} from "../theme/utils";

export const PageHeader = () => {
    return (
        <AppBar position={"static"}>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} height={"60px"} paddingX={10}>
                <Stack direction={"row"} alignItems={"center"}>
                    <Typography fontWeight={FontWeight.Bold} fontSize={22}>
                        sample text
                    </Typography>
                </Stack>
            </Stack>
        </AppBar>
    );
};