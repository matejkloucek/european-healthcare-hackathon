import {Dialog, TextField} from "@mui/material";

type Props = {
    isOpen: boolean
    onClose: () => void;
    onSubmit: (text: string) => void;
}

export const CustomHospitalizationDialog = (props: Props) => {
    return (
        <Dialog open={props.isOpen} onClose={props.onClose} sx={{padding: 2}}>
            <TextField
                multiline
                rows={8}
                placeholder={"Zadejte detail hospitalizace..."}
            />
        </Dialog>
    )
}