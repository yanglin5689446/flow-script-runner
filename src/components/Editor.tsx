import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Tab,
  TabList,
  Tabs,
  Textarea,
  Switch,
  useToast,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
} from "@chakra-ui/react";
import * as fcl from "@blocto/fcl";
import * as types from "@onflow/types";
import { AddIcon, ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import ScriptTypes from "../types/ScriptTypes";
import * as BloctoDAOTemplates from "../scripts/DAO";
import * as TransactionsTemplates from "../scripts/Transactions";
import { startCase } from "lodash";
import { ec as EC } from "elliptic";
import { SHA3 } from "sha3";

const NETWORK = process.env.REACT_APP_NETWORK || "testnet";
const ec = new EC(NETWORK === "testnet" ? "p256" : "secp256k1");

const signWithKey = (privateKey: string, msgHex: string) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const sig = key.sign(hashMsgHex(msgHex));
  const n = 32; // half of signature length?
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
};

const hashMsgHex = (msgHex: string) => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(msgHex, "hex"));
  return sha.digest();
};

// Will be handled by fcl.user(addr).info()
const getAccount = async (addr: string) => {
  const { account } = await fcl.send([fcl.getAccount(addr)]);
  return account;
};

const authorization =
  ({ address, privateKey }: { address: string; privateKey: string }) =>
  async (account: {
    role: { proposer: string };
    signature: string;
    roles: any[];
  }) => {
    const user = await getAccount(address);
    const key = user.keys[0];

    let sequenceNum;
    if (account.role && account.role.proposer) sequenceNum = key.sequenceNumber;

    const signingFunction = async (data: { message: string }) => {
      return {
        addr: user.address,
        keyId: key.index,
        signature: signWithKey(privateKey, data.message),
      };
    };

    return {
      ...account,
      addr: user.address,
      keyId: key.index,
      sequenceNum,
      signature: account.signature || null,
      signingFunction,
      resolve: null,
      roles: account.roles,
    };
  };

interface FlowArg {
  value: any;
  type: any;
  comment?: string;
}

function parseFlowArgTypeFromString(type: string): any {
  const striped = type.replaceAll(" ", "");
  const matched = striped.match(/(Array|Optional)(\(.*\))?$/);
  if (matched) {
    return types[matched[1]](
      parseFlowArgTypeFromString(matched[2].slice(1, -1))
    );
  } else {
    return types[striped];
  }
}

const Editor = (): ReactJSXElement => {
  const toast = useToast();
  const [shouldSign, setShouldSign] = useState<boolean>();
  const [args, setArgs] = useState<FlowArg[]>();
  const [signers, setSigners] =
    useState<{ privateKey: string; address: string }[]>();
  const [scriptType, setScriptType] = useState<ScriptTypes>(ScriptTypes.SCRIPT);
  const [script, setScript] = useState<string>("");
  const [response, setResponse] = useState<any>(undefined);
  const [result, setResult] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  const typeKeys = Object.keys(types);

  const importTemplate = useCallback((template) => {
    setScriptType(template.type);
    setScript(template.script);
    setArgs(template.args);
    setShouldSign(template.shouldSign);
  }, []);

  const runScript = useCallback(async () => {
    setResponse("");
    setResult("");
    setTxHash("");
    const fclArgs = args?.map(({ value, type }) => {
      let fclArgType = types[type];
      if (!typeKeys.includes(type)) {
        value = isNaN(parseFloat(value)) ? eval(value) : value;
        fclArgType = parseFlowArgTypeFromString(type);
      } else if (type.includes("Int")) {
        value = parseInt(value);
      } else if (type.includes("Fix")) {
        value = parseFloat(value).toFixed(8);
      } else if (type === "Boolean") {
        value = JSON.parse(value);
      }
      return fcl.arg(value, fclArgType);
    });
    if (scriptType === ScriptTypes.SCRIPT) {
      fcl
        .send([fcl.script(script), fcl.args(fclArgs)])
        .then(fcl.decode)
        .then(setResult)
        .catch((e: Error) => {
          setResult(e.message);
        });
    } else {
      const block = await fcl.send([fcl.getLatestBlock()]).then(fcl.decode);
      try {
        const params = [
          fcl.args(fclArgs),
          fcl.proposer(fcl.currentUser().authorization),
          fcl.payer(fcl.currentUser().authorization),
          fcl.ref(block.id),
          fcl.limit(9999),
        ];
        const authorizations = [];
        if (shouldSign) authorizations.push(fcl.currentUser().authorization);
        if (signers?.length) {
          signers.forEach((signer) =>
            authorizations.push(authorization(signer))
          );
        }
        if (authorizations.length)
          params.push(fcl.authorizations(authorizations));

        const { transactionId } = await fcl.send([
          fcl.transaction(script),
          ...params,
        ]);

        toast({
          title: "Transaction sent, waiting for confirmation",
          status: "success",
          isClosable: true,
          duration: 1000,
        });

        const unsub = fcl
          .tx({ transactionId })
          .subscribe((transaction: any) => {
            setTxHash(transactionId);
            if (transaction != response) setResponse(transaction);

            if (fcl.tx.isSealed(transaction)) {
              toast({
                title: "Transaction is Sealed",
                status: "success",
                isClosable: true,
                duration: 1000,
              });
              unsub();
            }
          });
      } catch (error) {
        console.error(error);
        toast({
          title: "Transaction failed",
          status: "error",
          isClosable: true,
          duration: 1000,
        });
      }
    }
  }, [
    args,
    scriptType,
    typeKeys,
    script,
    shouldSign,
    signers,
    toast,
    response,
  ]);

  return (
    <Flex
      height="calc(100vh - 76px)"
      flexDirection={{ base: "column", md: "row" }}
    >
      <Flex
        flex={{ base: 3, md: 6 }}
        height="100%"
        borderWidth={1}
        flexDirection="column"
      >
        <Textarea
          flex={2}
          borderRadius="none"
          border="none"
          boxShadow="none"
          onChange={(e) => setScript(e.target.value)}
          value={script}
          fontFamily="monospace"
          _focus={{ border: "none", boxShadow: "none" }}
        />
        {((response != null && response !== "") ||
          (result != null && result !== "")) && (
          <Box flex={1} borderTopWidth={1} p={3}>
            <Box fontWeight="bold" mt={3}>
              {result ? "Run result:" : `Response of tx ${txHash}:`}
            </Box>
            <Box
              borderRadius=".5em"
              bgColor="#d1e7dd"
              color="#0f5132"
              mt={1}
              p={3}
              whiteSpace="pre-wrap"
              maxHeight={{ base: 120, md: 240 }}
              overflow="auto"
            >
              {JSON.stringify(result || response, null, 2)}
            </Box>
          </Box>
        )}
      </Flex>

      <Flex flex={3} height="100%" direction="column">
        <Tabs size="md" onChange={setScriptType} index={scriptType}>
          <TabList>
            <Tab>Script</Tab>
            <Tab>Transaction</Tab>
          </TabList>
        </Tabs>
        <Flex m={4}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Templates
            </MenuButton>
            <MenuList>
              <MenuGroup title="DAO">
                {Object.entries(BloctoDAOTemplates).map(([name, template]) => (
                  <MenuItem
                    key={name}
                    pl={5}
                    color="gray.700"
                    onClick={() => importTemplate(template)}
                  >
                    {startCase(name)}
                  </MenuItem>
                ))}
              </MenuGroup>
              <MenuGroup title="Transactions">
                {Object.entries(TransactionsTemplates).map(
                  ([name, template]) => (
                    <MenuItem
                      key={name}
                      pl={5}
                      color="gray.700"
                      onClick={() => importTemplate(template)}
                    >
                      {startCase(name)}
                    </MenuItem>
                  )
                )}
              </MenuGroup>
            </MenuList>
          </Menu>
        </Flex>

        <Box flex={1} px={4}>
          <Flex align="center" mt={3} ml={1}>
            <Box fontWeight="bold">Args</Box>
            <IconButton
              ml={2}
              aria-label="Add Args"
              isRound
              icon={<AddIcon />}
              size="xs"
              colorScheme="blue"
              onClick={() =>
                setArgs((args ?? []).concat({ value: "", type: "" }))
              }
            />
          </Flex>
          <Box mt={2}>
            {args?.map(({ value, type, comment }, index) => (
              <Flex key={index} align="center" mt={2}>
                <Textarea
                  rows={1}
                  value={value || ""}
                  onChange={(e) => {
                    const updated = args.slice();
                    updated.splice(index, 1, { type, value: e.target.value });
                    setArgs(updated);
                  }}
                  placeholder={comment}
                />
                <Select
                  value={type}
                  onChange={(e) => {
                    const updated = args.slice();
                    updated.splice(index, 1, { value, type: e.target.value });
                    setArgs(updated);
                  }}
                  ml={2}
                >
                  <option value="">--</option>
                  {typeKeys.map((key) => (
                    <option value={key} key={key}>
                      {key}
                    </option>
                  ))}
                  {!typeKeys.includes(type) && (
                    <option value={type}>{type}</option>
                  )}
                </Select>
                <IconButton
                  ml={2}
                  aria-label="Delete Arg"
                  isRound
                  icon={<CloseIcon />}
                  size="xs"
                  colorScheme="red"
                  onClick={() => {
                    const updated = args.slice();
                    updated.splice(index, 1);
                    setArgs(updated);
                  }}
                />
              </Flex>
            ))}
          </Box>
          {scriptType === ScriptTypes.TX && (
            <>
              <Flex align="center" mt={3} ml={1}>
                <Box fontWeight="bold">Extra Signers</Box>
                <IconButton
                  ml={2}
                  aria-label="Add Signers"
                  isRound
                  icon={<AddIcon />}
                  size="xs"
                  colorScheme="blue"
                  onClick={() =>
                    setSigners(
                      (signers ?? []).concat({ privateKey: "", address: "" })
                    )
                  }
                />
              </Flex>
              <Box mt={2}>
                {signers?.map(({ privateKey, address }, index) => (
                  <Flex key={index} align="center" mt={2}>
                    <Input
                      value={privateKey || ""}
                      onChange={(e) => {
                        const updated = signers.slice();
                        updated.splice(index, 1, {
                          address,
                          privateKey: e.target.value,
                        });
                        setSigners(updated);
                      }}
                      placeholder="private key"
                      type="password"
                    />
                    <Input
                      ml={2}
                      value={address || ""}
                      onChange={(e) => {
                        const updated = signers.slice();
                        updated.splice(index, 1, {
                          privateKey,
                          address: e.target.value,
                        });
                        setSigners(updated);
                      }}
                      placeholder="public key"
                    />
                    <IconButton
                      ml={2}
                      aria-label="Delete signers"
                      isRound
                      icon={<CloseIcon />}
                      size="xs"
                      colorScheme="red"
                      onClick={() => {
                        const updated = signers.slice();
                        updated.splice(index, 1);
                        setSigners(updated);
                      }}
                    />
                  </Flex>
                ))}
              </Box>
            </>
          )}
        </Box>

        <Flex justify="end" p={4}>
          {scriptType === ScriptTypes.TX && (
            <FormControl
              display="flex"
              justifyContent="end"
              alignItems="center"
              mt={2}
              mx={3}
            >
              <FormLabel htmlFor="shouldSign" mb="0">
                Authorize
              </FormLabel>
              <Switch
                id="shouldSign"
                isChecked={shouldSign}
                onChange={(e) => setShouldSign(e.target.checked)}
              />
            </FormControl>
          )}
          <Button onClick={runScript} mt={2}>
            Run
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Editor;
