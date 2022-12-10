const JSON_Stringify_Parse = <T>(input: T) => {
  return JSON.parse(JSON.stringify(input)) as T;
};
export default JSON_Stringify_Parse;
