import { ScrollView, View } from 'react-native';
import { containerScollViewStyle } from '../../styles/containers';
import { useEffect, useState } from 'react';
import { client } from '../../web3/ehousing.sol';
import { parseAbiItem } from 'viem';
import { HouseCreatedargs } from '../../web3/models/houseCreatedArgs';
import { NFTAttributes, NFTMetadata } from '../../web3/models/nftMetadata';
import { Card, Icon, ListItem, Skeleton, Text } from '@rneui/themed';

function HouseProps({ attributes }: { attributes?: NFTAttributes[] }) {
  if (!attributes) {
    return <></>;
  }
  return (
    <View>
      <ListItem>
        <Icon name="trash-can-outline" type="material-community" color="grey" />
        <ListItem.Content>
          <ListItem.Title>
            {attributes.find(e => e.trait_type === 'Country')?.value},{' '}
            {attributes.find(e => e.trait_type === 'City')?.value},{' '}
            {attributes.find(e => e.trait_type === 'Street')?.value}
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <ListItem>
        <Icon name="people-outline" type="material-community" color="grey" />
        <ListItem.Content>
          <ListItem.Title>
            {attributes.find(e => e.trait_type === 'Occupants')?.value}
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <ListItem>
        <Icon name="people-outline" type="material-community" color="grey" />
        <ListItem.Content>
          <ListItem.Title>
            {attributes.find(e => e.trait_type === 'HeatingSystem')?.value}
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </View>
  );
}

export default function HouseList() {
  const [houses, setHouses] = useState<
    (Partial<HouseCreatedargs> & Partial<NFTMetadata>)[]
  >([]);

  useEffect(() => {
    (async () => {
      const event = parseAbiItem(
        'event HouseCreated(uint256 tokenId, string uri)',
      );

      try {
        const logs = await client.getLogs({
          address: process.env.EHOUSING_CONTRACT_ADDRESS as `0x${string}`,
          event,
          fromBlock: 9336617n,
          toBlock: 9336622n,
        });
        setHouses(
          await Promise.all(
            logs
              .filter(e => e.args.uri)
              .map(async e => {
                const data = await fetch(e.args.uri!);
                return {
                  ...e,
                  ...(data.ok ? await data.json() : ({} as NFTMetadata)),
                };
              }),
          ),
        );
      } catch (e) {
        console.error('Error while gettings logs!', e);
      }
    })();
  }, []);

  return (
    <ScrollView style={containerScollViewStyle}>
      {houses.map(house => (
        <Card key={house.uri}>
          <Card.Title>{house.name ?? <Skeleton />}</Card.Title>
          <Card.Divider />
          {house.image ? (
            <Card.Image
              style={cardImageStyle}
              source={{
                uri: house.image,
              }}
            />
          ) : (
            <Skeleton height={100} />
          )}
          {house.description ? (
            <Text style={cardDescStyle}>{house.description}</Text>
          ) : null}
          <HouseProps attributes={house.attributes} />
        </Card>
      ))}
    </ScrollView>
  );
}

const cardImageStyle = { padding: 0 };
const cardDescStyle = { paddingTop: 20 };
