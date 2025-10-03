import { Button, Input, Text } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { containerScollViewStyle } from '../../styles/containers';
import {
  abi,
  client,
  getReadableContract,
  getWalletClient,
} from '../../web3/ehousing.sol';
import { sdk } from '../../web3/useMetamaskSDK';
import { parseAbiItem, parseEventLogs } from 'viem';

export default function CreateHouse() {
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [image, setImage] = useState('');
  const [nextTokenId, setNextTokenId] = useState<BigInt>(BigInt(1));

  useEffect(() => {
    (async () => {
      // const event = parseAbiItem<string>('event HouseCreated(uint256 tokenId, string uri);');

      // await client.getLogs({
      //   address: process.env.EHOUSING_CONTRACT_ADDRESS as `0x${string}`,
      //   event: event,
      //   fromBlock: BigInt(0),
      //   toBlock: 'latest',
      // });

      // const contract = getReadableContract(sdk.getProvider()!);
      // const logs = contract.abi;
      // const tokenId = parseEventLogs({
      //   logs,
      //   abi: eHousing.abi,
      // }).find(e => e.eventName == 'HouseCreated')?.args.tokenId;
      console.log('Gettings logs', process.env.EHOUSING_CONTRACT_ADDRESS);
      // const logs = await client.getLogs({
      //   address: process.env.EHOUSING_CONTRACT_ADDRESS as `0x${string}`,
      //   event: parseAbiItem(
      //     'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
      //   ),
      //   fromBlock: 'latest' - 1000n,
      //   toBlock: 'latest',
      // });
      // console.log('Got events', logs);
      // const lastLog = logs[logs.length - 1];
      // if (lastLog) {
      //   setNextTokenId(lastLog.args!.tokenId! + 1n);
      // } else {
      //   throw new Error('Cannot retrieve last token id');
      // }
    })();
  }, []);

  function onSubmit() {}

  return (
    <ScrollView style={containerScollViewStyle}>
      <Text>Next token id: {nextTokenId?.toString()}</Text>
      <Input placeholder="City" value={city} onChangeText={e => setCity(e)} />
      <Input
        placeholder="Street"
        value={street}
        onChangeText={e => setStreet(e)}
      />
      <Input
        placeholder="Image Url"
        value={image}
        onChangeText={e => setImage(e)}
      />
      <Button onPress={onSubmit} title={'SAVE'} />
    </ScrollView>
  );
}
