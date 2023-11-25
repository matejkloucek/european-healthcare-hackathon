import {Box, Button, Dialog, Stack, TextField, Typography} from "@mui/material";
import {FontWeight} from "../theme/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
};

export const CustomHospitalizationDialog = (props: Props) => {
  return (
    <Dialog open={props.isOpen} onClose={props.onClose} fullWidth>
        <Stack padding={2} spacing={1} maxHeight={"850px"}>
            <Typography fontWeight={FontWeight.Bold} fontSize={22} paddingBottom={1}>Nová hospitalizace</Typography>
            <Typography fontWeight={FontWeight.Bold}>Nynější onemocnění:</Typography>
            <TextField
                multiline
                placeholder={"Zadejte pacientova nynější onemocněnní..."}
            />
            <Typography fontWeight={FontWeight.Bold}>Objektivní nález:</Typography>
            <TextField
                multiline
                placeholder={"Zadejte objektivní nález..."}
            />
            <Typography fontWeight={FontWeight.Bold}>Objektivní nález</Typography>
            <TextField
                multiline
                placeholder={"Zadejte pacientova nynější onemocněnní..."}
            />
            <Typography fontWeight={FontWeight.Bold}>Závěr při přijetí:</Typography>
            <TextField
                multiline
                placeholder={"Zadejte závěr při přijetí..."}
            />
            <Typography fontWeight={FontWeight.Bold}>Důvod k hospitalizaci:</Typography>
            <TextField
                multiline
                placeholder={"Zadejte důvod k hospitalizaci..."}
            />
            <Typography fontWeight={FontWeight.Bold}>Provedené zákroky</Typography>
            <TextField
                multiline
                placeholder={"Zadejte provedené zákroky..."}
            />
            <Typography fontWeight={FontWeight.Bold}>Provedené testy</Typography>
            <TextField
                multiline
                placeholder={"Zadejte provedené testy..."}
            />
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }} paddingTop={1}>
                <Button variant="contained">
                    <Typography fontWeight={FontWeight.Bold}>Přidat</Typography>
                </Button>
            </Box>




        </Stack>
    </Dialog>
  );
};
