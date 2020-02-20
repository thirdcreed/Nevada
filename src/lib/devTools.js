export const loadDevTools = ({ data, csv }) => {
  if (typeof window === undefined) return; // in case this ever runs on a server
  const getData = () => data;
  const getCsv = () => csv;
  const copyData = () => {
    window.copy(getData());
    console.log("Data copied to clipboard");
  };
  const copyCsv = () => {
    window.copy(getCsv());
    console.log("CSV copied to clipboard");
  };
  window.dataTools = {
    getData,
    getCsv,
    copyData,
    copyCsv
  };
  console.log(
    "%c Play with our raw work using window.dataTools",
    "background: #a7222b; color: white; font-size: 24px; font-family: 'Courier', serif; padding: 6px; border-radius: 4px"
  );
};
