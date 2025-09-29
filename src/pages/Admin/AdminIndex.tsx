import { useNavigation } from '@react-navigation/native';
import { Button, Card, Icon } from '@rneui/themed';
import { ScrollView } from 'react-native';

function AdminIndex() {

  const navigation = useNavigation();

  return (
    <ScrollView>
      <Card>
        <Card.Title>CREATE HOUSE</Card.Title>
        <Card.Divider />
        <Button
          icon={
            <Icon name="add" color="#ffffff" iconStyle={{ marginRight: 10 }} />
          }
          title="CREATE NOW"
          onPress={() => navigation.navigate("CreateHouse")}
        />
      </Card>
      <Card>
        <Card.Title>HOUSE LIST</Card.Title>
        <Card.Divider />
        <Button
          icon={
            <Icon name="search" color="#ffffff" iconStyle={{ marginRight: 10 }} />
          }
          title="CHECK NOW"
          onPress={() => navigation.navigate("HouseList")}
        />
      </Card>
    </ScrollView>
  );
}

export default AdminIndex;
