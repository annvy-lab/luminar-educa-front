import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

const SearchBar = () => {
  return (
    <div>
      <InputGroup>
        <InputGroupInput
          id="inline-start-input"
          placeholder="Buscar aulas..."
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default SearchBar;
