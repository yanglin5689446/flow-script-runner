import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Context, LoginMethod } from "../context/Context";

const METHODS = [
  { title: "Login without account proof 😜", value: LoginMethod.Authn },
  { title: "Provable login", value: LoginMethod.ProvableAuthn },
];

const DEFAULT_METHOD_VALUE = METHODS[0].value;

const LoginModal: React.FC = () => {
  const [method, setMethod] = useState(DEFAULT_METHOD_VALUE);
  const [appDomainTag, setAppDomainTag] = useState(window.location.host);
  const [isTagInvalid, setIsTagInvalid] = useState(false);
  const { confirmFlowLogin, isLoginModalOpen, closeLoginModal } =
    useContext(Context);

  const handleChange = (updatedValue: string) => {
    setMethod(+updatedValue);
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setIsTagInvalid(
      Buffer.from(event.target.value).toString("hex").length > 64
    );
    setAppDomainTag(event.target.value);
  };

  const handleLogin = () => {
    if (confirmFlowLogin) {
      confirmFlowLogin(method, appDomainTag);
      handleClose();
    }
  };

  const handleClose = () => {
    setMethod(DEFAULT_METHOD_VALUE);
    setAppDomainTag("");
    setIsTagInvalid(false);

    if (closeLoginModal) {
      closeLoginModal();
    }
  };

  return (
    <Modal
      isOpen={!!isLoginModalOpen}
      onClose={handleClose}
      isCentered
      closeOnOverlayClick
    >
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>
          Login Method
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
        </ModalHeader>

        <ModalBody>
          <Text fontSize="large">Please select the way to log in:</Text>
          <RadioGroup onChange={handleChange} value={method} mt={4}>
            <Flex flexDirection="column">
              <Radio value={METHODS[0].value}>
                <Text fontWeight="semibold">{METHODS[0].title}</Text>
              </Radio>

              <Flex flexDirection="column" mt={3}>
                <Radio value={METHODS[1].value}>
                  <Text fontWeight="semibold">{METHODS[1].title}</Text>
                </Radio>
                <Flex mt={2}>
                  <Box width={4} height={4} />
                  <Flex flexDirection="column" ml={2}>
                    <Text fontSize="sm" color="slategrey">
                      Custom appIdentifier
                    </Text>
                    <Tooltip
                      label="Please keep the string less than or equal to 32 bytes"
                      isDisabled={!isTagInvalid}
                    >
                      <Input
                        value={appDomainTag}
                        onChange={handleInputChange}
                        disabled={method !== METHODS[1].value}
                        isInvalid={method === METHODS[1].value && isTagInvalid}
                        errorBorderColor={
                          method === METHODS[1].value && isTagInvalid
                            ? "red.300"
                            : undefined
                        }
                        focusBorderColor={isTagInvalid ? "red.300" : undefined}
                        placeholder="Awesome App (v0.0)"
                        size="sm"
                        width="300px"
                        borderRadius="lg"
                        mt={1}
                      />
                    </Tooltip>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </RadioGroup>
        </ModalBody>

        <ModalFooter>
          <Button
            disabled={method === METHODS[1].value && isTagInvalid}
            colorScheme="blue"
            onClick={handleLogin}
          >
            Log in
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
