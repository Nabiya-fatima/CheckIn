import * as React from 'react';
import {Avatar, Card, Text} from 'react-native-paper';
import {View, StyleSheet, Image} from 'react-native';
import {Size, hp, wp} from '../assets/dimensions';
import {colors} from '../utils/theme/colors';

const CustomeCard = ({title, imageSource, date}) => (
  <View style={styles.container}>
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={imageSource} style={styles.cardImage} />
        <View style={styles.titleContainer}>
          <Text style={styles.checkedInText}>Checked In</Text>
        </View>
      </View>

      <Card.Content>
        <Text variant="headlineMedium">{title}</Text>
        <Text style={styles.dateText}>{date}</Text>
        <View style={styles.ownerContainer}>
          <Avatar.Image
            style={styles.avatar}
            size={40}
            source={require('../images/avatar.jpg')}
          />
          <Text style={styles.ownerText}>Owner: Nabiya Fatima</Text>
        </View>
      </Card.Content>
      {/* <Card.Title title="Owner: Nabiya Fatima" left={LeftContent} /> */}
    </Card>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    marginVertical: hp('1.5%'),
  },
  cardContent: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  cardImage: {
    height: hp('20%'),
    overflow: 'hidden',
    borderRadius: hp('2%'),
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: wp('10%'),
    paddingVertical: hp('3%'),
  },
  checkedInText: {
    backgroundColor: colors.purple,
    paddingHorizontal: hp('2%'),
    paddingVertical: hp('1%'),
    borderRadius: Size(2),
    color: 'white',
  },
  dateText: {
    marginTop: hp('1%'),
    color: 'gray',
  },
  ownerContainer: {
    flexDirection: 'row',
  },
  avatar: {
    marginTop: hp('1%'),
  },
  ownerText: {
    marginHorizontal: wp('2%'),
    alignSelf: 'center',
  },
});

export default CustomeCard;
