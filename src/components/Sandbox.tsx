import React from "react";
import { Box, Flex, Textarea } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

interface SandboxProps {
  script: string;
  onScriptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  hasError: boolean;
  resultTitle: string;
  result: string;
  isShown: boolean;
}

const Sandbox: React.FC<SandboxProps> = ({
  script,
  onScriptChange,
  disabled,
  hasError,
  resultTitle,
  result,
  isShown,
}): ReactJSXElement => {
  return (
    <Flex
      flex={{ base: 3, md: isShown ? 6 : 0 }}
      height="100%"
      borderWidth={1}
      flexDirection="column"
      transition="0.2s flex"
    >
      <Textarea
        flex={2}
        padding={isShown ? undefined : "0"}
        borderRadius="none"
        border="none"
        boxShadow="none"
        onChange={disabled ? undefined : onScriptChange}
        value={script}
        fontFamily="monospace"
        _focus={{ border: "none", boxShadow: "none" }}
        disabled={disabled}
        _disabled={{ bg: "rgba(239, 239, 239, 0.3)", cursor: "not-allowed" }}
      />
      {result && (
        <Box flex={1} borderTopWidth={1} p={3}>
          <Box fontWeight="bold" mt={3}>
            {resultTitle}
          </Box>
          <Box
            borderRadius=".5em"
            bgColor={hasError ? "#f8d7da" : "#d1e7dd"}
            color={hasError ? "#842029" : "#0f5132"}
            mt={1}
            p={3}
            whiteSpace="pre-wrap"
            maxHeight={{ base: 120, md: 240 }}
            overflow="auto"
          >
            {result}
          </Box>
        </Box>
      )}
    </Flex>
  );
};

export default Sandbox;
