import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import {
  Box,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Textarea,
} from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { EthereumTypes } from "@blocto/sdk";
import ParamEditor from "./ParamEditor";
import { useEthereum } from "../../services/evm";

function parseJsonString(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

const PersonalSignEditor = ({
  account,
  setRequestObject,
}: {
  account: string | null;
  setRequestObject: Dispatch<
    SetStateAction<EthereumTypes.EIP1193RequestPayload | undefined>
  >;
}): ReactJSXElement => {
  const [message, setMessage] = useState<string>("test");

  useEffect(() => {
    setRequestObject({
      method: "personal_sign",
      params: ["0x" + Buffer.from(message).toString("hex"), account],
    });
  }, [message, account, setRequestObject]);

  return (
    <Flex my="20px" alignItems="center">
      <Box mx="10px">Message:</Box>
      <Textarea
        rows={1}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
    </Flex>
  );
};

const SignTypedDataV3Editor = ({
  setParam,
}: {
  setParam: (param: any) => void;
}): ReactJSXElement => {
  const { chainId } = useEthereum();
  const [domain, setDomain] = useState<string[][]>([
    ["chainId", Number(chainId).toString() || "5"],
    ["name", "Ether Mail"],
    ["version", "1"],
    ["verifyingContract", "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"],
  ]);
  const [message, setMessage] = useState<string[][]>([
    ["contents", "Hello, Bob!"],
    [
      "from",
      '{"name":"Cow","wallet":"0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"}',
    ],
    [
      "to",
      '{"name":"Bob","wallet":"0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"}',
    ],
  ]);
  const [primaryType, setPrimaryType] = useState<string[][]>([
    ["primaryType", "Mail"],
  ]);
  const [types, setTypes] = useState<string[][]>([
    [
      "EIP712Domain",
      `[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}]`,
    ],
    [
      "Person",
      `[{"name":"name","type":"string"},{"name":"wallet","type":"address"}]`,
    ],
    [
      "Mail",
      `[{"name":"from","type":"Person"},{"name":"to","type":"Person"},{"name":"contents","type":"string"}]`,
    ],
  ]);
  useEffect(() => {
    const messageObject = {
      types: Object.fromEntries(
        types.map((item) => [item[0], parseJsonString(item[1])])
      ),
      domain: Object.fromEntries(domain),
      message: Object.fromEntries(
        message.map((item) => [item[0], parseJsonString(item[1])])
      ),
      primaryType: primaryType[0][1],
    };
    setParam(JSON.stringify(messageObject));
  }, [domain, message, types, primaryType, setParam]);
  useEffect(() => {
    setDomain((prev) => {
      const chainIdIndex = prev.findIndex((item) => item[0] === "chainId");
      if (chainIdIndex !== -1) {
        const newArray = [...prev];
        newArray[chainIdIndex][1] = Number(chainId).toString() || "5";
        return newArray;
      }
      return prev;
    });
  }, [chainId]);
  return (
    <>
      <ParamEditor title="domain" params={domain} setParams={setDomain} />
      <ParamEditor title="message" params={message} setParams={setMessage} />
      <ParamEditor title="types" params={types} setParams={setTypes} />
      <ParamEditor
        title="primaryType"
        params={primaryType}
        setParams={setPrimaryType}
      />
    </>
  );
};

const SignTypedDataV4Editor = ({
  setParam,
}: {
  setParam: (param: any) => void;
}): ReactJSXElement => {
  const { chainId } = useEthereum();
  const [domain, setDomain] = useState<string[][]>([
    ["chainId", Number(chainId).toString() || "5"],
    ["name", "Ether Mail"],
    ["version", "1"],
    ["verifyingContract", "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"],
  ]);
  const [message, setMessage] = useState<string[][]>([
    ["contents", "Hello, Bob!"],
    [
      "from",
      '{"name":"Cow","wallets":["0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826","0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF"]}',
    ],
    [
      "to",
      '[{"name":"Bob","wallets":["0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB","0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57","0xB0B0b0b0b0b0B000000000000000000000000000"]}]',
    ],
  ]);
  const [primaryType, setPrimaryType] = useState<string[][]>([
    ["primaryType", "Mail"],
  ]);
  const [types, setTypes] = useState<string[][]>([
    [
      "EIP712Domain",
      `[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}]`,
    ],
    [
      "Person",
      `[{"name":"name","type":"string"},{"name":"wallets","type":"address[]"}]`,
    ],
    [
      "Group",
      `[{"name":"name","type":"string"},{"name":"members","type":"Person[]"}]`,
    ],
    [
      "Mail",
      `[{"name":"from","type":"Person"},{"name":"to","type":"Person[]"},{"name":"contents","type":"string"}]`,
    ],
  ]);

  useEffect(() => {
    const messageObject = {
      types: Object.fromEntries(
        types.map((item) => [item[0], parseJsonString(item[1])])
      ),
      domain: Object.fromEntries(domain),
      message: Object.fromEntries(
        message.map((item) => [item[0], parseJsonString(item[1])])
      ),
      primaryType: primaryType[0][1],
    };
    setParam(JSON.stringify(messageObject));
  }, [domain, message, types, primaryType, setParam]);

  useEffect(() => {
    setDomain((prev) => {
      const chainIdIndex = prev.findIndex((item) => item[0] === "chainId");
      if (chainIdIndex !== -1) {
        const newArray = [...prev];
        newArray[chainIdIndex][1] = Number(chainId).toString() || "5";
        return newArray;
      }
      return prev;
    });
  }, [chainId]);

  return (
    <>
      <ParamEditor title="domain" params={domain} setParams={setDomain} />
      <ParamEditor title="message" params={message} setParams={setMessage} />
      <ParamEditor title="types" params={types} setParams={setTypes} />
      <ParamEditor
        title="primaryType"
        params={primaryType}
        setParams={setPrimaryType}
      />
    </>
  );
};

const EvmSignEditor = ({
  setRequestObject,
  account,
}: {
  setRequestObject: Dispatch<
    SetStateAction<EthereumTypes.EIP1193RequestPayload | undefined>
  >;
  account: string | null;
}): ReactJSXElement => {
  const [method, setMethod] = useState<string>("");
  const [param, setParam] = useState<string>("");

  useEffect(() => {
    if (param.length && account) {
      setRequestObject({
        method,
        params: [account, param],
      });
    }
  }, [method, account, param, setRequestObject]);

  return (
    <Flex flexDirection="column">
      <Tabs
        variant="soft-rounded"
        colorScheme="green"
        isLazy={true}
        isFitted={true}
        onChange={() => {
          setRequestObject({
            method,
            params: [account, param],
          });
        }}
      >
        <Box fontWeight="bold" my="10px">
          Method
        </Box>
        <TabList>
          <Tab>PersonalSign</Tab>
          <Tab
            onClick={() => {
              setMethod("eth_signTypedData_v3");
            }}
          >
            signTypedData_v3
          </Tab>
          <Tab
            onClick={() => {
              setMethod("eth_signTypedData_v4");
            }}
          >
            signTypedData_v4
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p="0">
            <PersonalSignEditor
              account={account}
              setRequestObject={setRequestObject}
            />
          </TabPanel>
          <TabPanel p="0">
            <SignTypedDataV3Editor setParam={setParam} />
          </TabPanel>
          <TabPanel p="0">
            <SignTypedDataV4Editor setParam={setParam} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default EvmSignEditor;
