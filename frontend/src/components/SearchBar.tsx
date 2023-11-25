import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

type Props = {
  options: string[];
  onSearchClick: (hospitalizationId: string) => void;
};

export const SearchBar = (props: Props) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleAutocompleteChange = (
    event: React.ChangeEvent<{}>,
    value: string | null,
  ) => {
    setSelectedOption(value);
  };

  const handleSearchClick = () => {
    if (selectedOption) {
      props.onSearchClick(selectedOption);
    }
  };

  return (
    <Stack direction={"row"}>
      <Autocomplete
        options={props.options}
        onChange={handleAutocompleteChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant={"outlined"}
            placeholder={"Hledejte dle kódu hospitalizace..."}
            sx={{ minWidth: "500px" }}
          />
        )}
      />
      <Button variant={"contained"} onClick={handleSearchClick}>
        <SendIcon />
      </Button>
    </Stack>
  );
};
