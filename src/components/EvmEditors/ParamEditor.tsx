import React from "react";
import { Flex, Box, Textarea, IconButton } from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

const ParamEditor = ({
  title,
  params,
  setParams,
}: {
  title: string;
  params: string[][];
  setParams: React.Dispatch<React.SetStateAction<string[][]>>;
}): React.ReactElement => {
  return (
    <Flex mt={3} ml={1} flexDirection="column">
      <Flex>
        <Box fontWeight="bold">{title}</Box>
        <IconButton
          ml={2}
          aria-label="Add Signers"
          isRound
          icon={<AddIcon />}
          size="xs"
          colorScheme="blue"
          onClick={() => {
            setParams((prev) => [...prev, ["", ""]]);
          }}
        />
      </Flex>

      <Flex flexDir="column" mt={2}>
        {params?.map((param, i) => (
          <Flex key={i} my="5px" alignItems="center">
            <Textarea
              width="40%"
              rows={1}
              value={param[0]}
              onChange={(e) => {
                setParams((prev) => {
                  const newParam = [...prev];
                  newParam[i][0] = e.target.value;
                  return newParam;
                });
              }}
              required={i === 0}
              placeholder="name"
            />
            <Box mx="10px">:</Box>
            <Textarea
              rows={1}
              value={param[1]}
              onChange={(e) => {
                setParams((prev) => {
                  const newParam = [...prev];
                  newParam[i][1] = e.target.value;
                  return newParam;
                });
              }}
              required={i === 0}
              placeholder="value"
            />
            <IconButton
              ml={2}
              aria-label="Delete Arg"
              isRound
              icon={<CloseIcon />}
              size="xs"
              colorScheme="red"
              onClick={() => {
                setParams((prev) => {
                  const newParam = [...prev];
                  newParam.splice(i, 1);
                  return newParam;
                });
              }}
            />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
export default ParamEditor;
