import React,{memo} from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { useGlobalContext } from "../../context/context";

const Search = memo(() => {
  const { search, handleOnChange, loadOptions } = useGlobalContext();
  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
    />
  );
});

export default Search;
