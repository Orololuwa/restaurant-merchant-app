import {
  Avatar,
  Box,
  Center,
  Flex,
  FormLabel,
  Icon,
  Input,
  Progress,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// import { useAppDispatch, useAppSelector } from "core/hooks/use-redux";
// import settingsService from "data/services/settings.service";
// import { uploadBusinessDocumentsV2 } from "data/store";
import { ExportCurve } from "iconsax-react";
import React, { useState } from "react";
import cloudUploadService from "services/cloud-upload.service";

interface IUpload {
  uploadKey: string;
  //   id: number;
  //   callSign: string;
  title: string;
}

const Upload = ({
  uploadKey,
  //  id, callSign,
  title,
}: IUpload) => {
  //   const _dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);
  const [inputKey, setInputKey] = useState(0);

  //   const [loadingUpload] = useAppSelector((state) => [
  //     state.settings.UserAvatarUpload.loading,
  //   ]);

  const preset_key = "orololuwa";
  const cloud_name = "df1fw15ei";
  const [image, setImage] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true);
    const files = event?.target.files;

    if (!files?.length) return;

    const file = files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset_key);

    // return console.log(file);

    try {
      const response = await cloudUploadService.cloudineryUpload(
        cloud_name,
        formData
      );
      setImage(response.secure_url);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    // Reset the input by forcing a new one
    setInputKey((key) => key + 1);
  };

  return (
    <Flex alignItems={"flex-start"} gap={"5"}>
      <Avatar src={image} size={"2xl"} />
      <Stack flexGrow={"1"}>
        <Box flexBasis="60%">
          <Center w="full" h="full">
            <FormLabel
              px="2"
              py="5"
              m="0"
              w="full"
              display="flex"
              cursor="pointer"
              fontSize={"sm"}
              alignItems="center"
              justifyContent={"center"}
              borderRadius="6"
              borderWidth={"2px"}
              borderColor={useColorModeValue("gray.200", "whiteAlpha.300")}
              borderStyle={"dashed"}
              _disabled={{ bgColor: "gray.200" }}
              htmlFor={uploadKey}
              textAlign={"center"}
              overflow="clip"
              position={"relative"}
            >
              <Stack spacing={"2"} alignItems="center">
                <Text fontWeight={"bold"}>{title}</Text>
                <Icon as={ExportCurve} color="gray.500" boxSize={"5"} />
                <Text>Tap to upload document</Text>
              </Stack>
              {
                // loadingUpload ||
                isLoading ? (
                  <Progress
                    size="xs"
                    isIndeterminate
                    w="full"
                    position={"absolute"}
                    bottom="0"
                    left="0"
                    hasStripe
                    colorScheme={"orange"}
                  />
                ) : null
              }
            </FormLabel>
            <Input
              type="file"
              display="none"
              id={uploadKey}
              name="user-profile"
              colorScheme="primary"
              accept="image/png, image/jpeg, application/pdf"
              multiple
              onChange={handleFileChange}
              key={inputKey}
            />
          </Center>
        </Box>
        <Text fontSize={"xs"} fontStyle="italic">
          Accepted formats are jpeg, png and pdf.
        </Text>
      </Stack>
    </Flex>
  );
};

export default Upload;
