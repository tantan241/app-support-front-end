import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { useState } from "react";

const ChipInput = ({ label = "Add a chip", onChipInputChange = () => {} }) => {
    const [inputValue, setInputValue] = useState("");
    const [chips, setChips] = useState([]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyPress = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            setChips([...chips, inputValue]);
            onChipInputChange([...chips, inputValue]);
            setInputValue("");
        }
    };

    const handleChipDelete = (chipToDelete) => {
        const updatedChips = chips.filter((chip) => chip !== chipToDelete);
        setChips(updatedChips);
        onChipInputChange(updatedChips);
    };

    return (
        <div>
            <TextField
                label={label}
                variant="outlined"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleInputKeyPress}
            />
            <div>
                {chips.map((chip, index) => (
                    <Chip
                        key={index}
                        label={chip}
                        onDelete={() => handleChipDelete(chip)}
                        color="primary"
                        variant="outlined"
                        style={{ margin: "4px" }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChipInput;
