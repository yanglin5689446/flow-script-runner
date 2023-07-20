import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Box, Textarea, Grid } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import type { EthereumTypes } from "@blocto/sdk";

const EvmUserOpEditor = ({
  setRequestObject,
  account,
}: {
  setRequestObject: Dispatch<
    SetStateAction<EthereumTypes.EIP1193RequestPayload | undefined>
  >;
  account: string | null;
}): ReactJSXElement => {
  const [fromString, setFrom] = useState<string>(account || "");
  const [toString, setTo] = useState<string>("");
  const [valueString, setValue] = useState<string>("");
  const [dataString, setData] = useState<string>("");
  useEffect(() => {
    if (account) {
      const sendObj: {
        from: string;
        to?: string;
        value?: string;
        data?: string;
      } = {
        from: fromString,
      };
      if (toString) {
        sendObj.to = toString;
      }
      if (valueString) {
        sendObj.value = "0x" + Number(valueString).toString(16);
      }
      if (dataString) {
        sendObj.data = dataString;
      }
      setRequestObject({
        method: "eth_sendTransaction",
        params: [sendObj],
      });
    }
  }, [
    account,
    fromString,
    toString,
    dataString,
    valueString,
    setRequestObject,
  ]);
  useEffect(() => {
    setFrom(account || "");
  }, [account]);

  return (
    <Grid templateColumns="min-content 1fr" alignItems="center" gap={6}>
      <Box mx="10px">From:</Box>
      <Textarea
        rows={1}
        value={fromString}
        onChange={(e) => {
          setFrom(e.target.value);
        }}
      />
      <Box mx="10px">To:</Box>
      <Textarea
        rows={1}
        value={toString}
        onChange={(e) => {
          setTo(e.target.value);
        }}
      />
      <Box mx="10px">Value:</Box>
      <Textarea
        rows={1}
        value={valueString}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <Box mx="10px">Data:</Box>
      <Textarea
        rows={3}
        value={dataString}
        onChange={(e) => {
          setData(e.target.value);
        }}
      />
    </Grid>
  );
};

export default EvmUserOpEditor;
