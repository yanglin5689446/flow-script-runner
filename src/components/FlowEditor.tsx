import React, { useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import * as fcl from "@blocto/fcl";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { ec as EC } from "elliptic";
import { SHA3 } from "sha3";
import * as types from "@onflow/types";
import * as BloctoDAOTemplates from "../scripts/flow/DAO";
import * as SignMessageTemplates from "../scripts/flow/SignMessage";
import * as TransactionsTemplates from "../scripts/flow/Transactions";
import Editor, { FlowArg } from "./Editor";

const typeKeys = Object.keys(types);

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

function parseFclArgs(args: FlowArg[] = []) {
  return args.map(({ value, type }): { value: any; xform: any } => {
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
}

const MenuGroups = [
  { title: "DAO", templates: BloctoDAOTemplates },
  { title: "Transactions", templates: TransactionsTemplates },
  { title: "Sign Message", templates: SignMessageTemplates },
];

const FlowEditor = (): ReactJSXElement => {
  const toast = useToast();

  const handleSendScript = useCallback((script, args) => {
    const fclArgs = parseFclArgs(args);
    return fcl.send([fcl.script(script), fcl.args(fclArgs)]).then(fcl.decode);
  }, []);

  const handleSignMessage = useCallback((args) => {
    const messageHex = Buffer.from(args?.[0]?.value ?? "").toString("hex");
    return fcl.currentUser().signUserMessage(messageHex);
  }, []);

  const handleSendTransactions = useCallback(
    async (
      args: FlowArg[] | undefined,
      shouldSign: boolean | undefined,
      signers: Array<{ privateKey: string; address: string }> | undefined,
      script: string
    ) => {
      const fclArgs = parseFclArgs(args);
      const block = await fcl.send([fcl.getLatestBlock()]).then(fcl.decode);
      return new Promise<{ transactionId: string; transaction: any }>(
        (resolve, reject) => {
          try {
            const params = [
              fcl.args(fclArgs),
              fcl.proposer(fcl.currentUser().authorization),
              fcl.payer(fcl.currentUser().authorization),
              fcl.ref(block.id),
              fcl.limit(9999),
            ];
            const authorizations = [];
            if (shouldSign)
              authorizations.push(fcl.currentUser().authorization);
            if (signers?.length) {
              signers.forEach((signer) =>
                authorizations.push(authorization(signer))
              );
            }
            if (authorizations.length)
              params.push(fcl.authorizations(authorizations));

            fcl
              .send([fcl.transaction(script), ...params])
              .then(({ transactionId }: { transactionId: string }) => {
                toast({
                  title: "Transaction sent, waiting for confirmation",
                  status: "success",
                  isClosable: true,
                  duration: 1000,
                });

                const unsub = fcl
                  .tx({ transactionId })
                  .subscribe((transaction: any) => {
                    resolve({ transactionId, transaction });

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
              })
              .catch(reject);
          } catch (error) {
            reject(error);
            toast({
              title: "Transaction failed",
              status: "error",
              isClosable: true,
              duration: 1000,
            });
          }
        }
      );
    },
    [toast]
  );

  return (
    <Editor
      menuGroups={MenuGroups}
      onSignMessage={handleSignMessage}
      onSendTransactions={handleSendTransactions}
      argTypes={typeKeys}
      isSignMessagePreDefined
      signMessageArgs={SignMessageTemplates.signMessage.args}
      isArgsAdjustable
      isTransactionsExtraSignersAvailable
      onSendScript={handleSendScript}
      faucetUrl="https://testnet-faucet.onflow.org/"
    />
  );
};

export default FlowEditor;
