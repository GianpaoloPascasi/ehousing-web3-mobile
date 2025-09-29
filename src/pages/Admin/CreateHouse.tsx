import { Button, Input } from '@rneui/themed';
import { useState } from 'react';
import { ScrollView } from 'react-native';

export default function CreateHouse() {
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [image, setImage] = useState("");

    function onSubmit(){

    }

  return (
    <ScrollView>
      <Input placeholder="City" value={city} onChangeText={e => setCity(e)} />
      <Input placeholder="Street" value={street}  onChangeText={e => setStreet(e)} />
      <Input placeholder="Image" value={image}  onChangeText={e => setImage(e)} />
      <Button onPress={onSubmit} title={'SAVE'} />
    </ScrollView>
  );
}
