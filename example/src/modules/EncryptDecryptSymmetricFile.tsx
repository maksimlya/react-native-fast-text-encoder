import {Button, Text} from "react-native";
import React, {useEffect, useState} from "react";
import OpenPGP from 'react-native-fast-encoder';
import SectionContainer from "../components/SectionContainer";
import SectionTitle from "../components/SectionTitle";
import SectionResult from "../components/SectionResult";
import Container from "../components/Container";
import { createFile, deleteFile } from "./Shared";
import RNFS from "react-native-fs";

interface Props {
    publicKey: string,
    privateKey: string,
    passphrase: string
}

export default function ({passphrase}: Props) {

    const fileName = "sample-encrypt-decrypt-symmetric-file.txt"
    const content = "sample"
    const [loading,setLoading] = useState(true);
    const [input,setInput] = useState('');
    const [output,setOutput] = useState('');
    const [encrypted, setEncrypted] = useState('');
    const [decrypted, setDecrypted] = useState('');
    const [encryptedFile, setEncryptedFile] = useState('');
    const [decryptedFile, setDecryptedFile] = useState('');

    useEffect(() => {
        createFile(fileName,content).then((value)=>{
            setInput(value);
            setOutput(value+".asc");
            setLoading(false);
        })

        return ()=>{
            deleteFile(fileName)
        }
    }, [])

    if (loading){
        return <Container testID={'loading'}><Text>...</Text></Container>
    }

    return <Container testID={'encrypt-decrypt-symmetric-file'}>
        <SectionContainer testID={'encrypt'}>
            <SectionTitle>Encrypt Symmetric File</SectionTitle>
            <Button
                title={"Encrypt Symmetric File"}
                testID={'button'}
                onPress={async () => {
                    const result = await OpenPGP.encryptSymmetricFile(
                        input,
                        output,
                        passphrase
                    );
                    setEncrypted(result.toString());
                    RNFS.readFile(output,'base64').then((data) => {
                        setEncryptedFile(data)
                    })
                }}
            />
            <SectionResult testID={'resultsize'}>{encrypted}</SectionResult>
            {!!encryptedFile && <SectionResult testID={'result'}>{encryptedFile}</SectionResult>}

        </SectionContainer>
        {!!encrypted && (
            <SectionContainer testID={'decrypt'}>
                <SectionTitle>Decrypt Symmetric File</SectionTitle>
                <Button
                    title={"Decrypt Symmetric File"}
                    testID={'button'}
                    onPress={async () => {
                        const result = await OpenPGP.decryptSymmetricFile(
                            output,
                            input,
                            passphrase
                        );
                        setDecrypted(result.toString());
                        RNFS.readFile(input,'utf8').then((data) => {
                            setDecryptedFile(data)
                        })
                    }}
                />
                {!!decrypted && (
                    <>
                        <SectionResult testID={'resultsize'}>{decrypted}</SectionResult>
                        <SectionResult testID={'result'}>{decryptedFile}</SectionResult>
                    </>
                )}
            </SectionContainer>
        )}
    </Container>;
}
