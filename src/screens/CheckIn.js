import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, ScrollView, FlatList} from 'react-native';
import {
  Button,
  Text,
  Portal,
  Modal,
  Card,
  Appbar,
  TextInput,
  ActivityIndicator,
  Avatar,
} from 'react-native-paper';
import {TouchableOpacity} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

import CustomeCard from '../components/CustomeCard';

import {launchImageLibrary} from 'react-native-image-picker';

//firebase imports
import {storage, db} from '../config/firebase.config';
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import {collection, addDoc, getDocs} from 'firebase/firestore';

import {colors} from '../utils/theme/colors';
import {Size, hp, wp} from '../assets/dimensions';

const CheckIn = () => {
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const _handleclose = () => hideModal();

  //function to add checkIn data
  const addCheckIn = async () => {
    setSaveData(true);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError('NetWork request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', imgUrl, true);
      xhr.send(null);
    });
    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: 'image/jpeg',
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'CheckIn/' + Date.now());
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      snapshot => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      error => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          setImgUrl(downloadURL);
          saveCheckIn();
        });
      },
    );
  };

  //save the data to firebase
  const saveCheckIn = async () => {
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, 'checkins'), {
      title: text,
      date: getCurrentDateAsString(),
      imageSource: {uri: imgUrl},
    });

    const newCheckInData = {
      title: text,
      date: getCurrentDateAsString(),
      imageSource: {
        uri: imgUrl,
      },
    };

    // Update the data array with the new check-in data
    setData(prevData => [newCheckInData, ...prevData]);

    setSaveData(false);
    hideModal();
    setText('');
    setImgUrl(null);
  };

  //read data
  useEffect(() => {
    const readData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'checkins'));
        let newData = [];

        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots

          let checkInData = {
            title: doc.data().title,
            date: doc.data().date,
            imageSource: {
              uri: doc.data().imageSource.uri,
            },
          };

          newData.push(checkInData);
        });

        setData(newData);

        setLoading(false);
      } catch (error) {
        console.error('Error reading data:', error);
      }
    };

    readData();
  }, []);

  const getCurrentDateAsString = () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', {month: 'short'});
    const year = currentDate.getFullYear();

    // Add ordinal suffix to the day
    const dayWithOrdinal = addOrdinalSuffix(day);

    return `${dayWithOrdinal} ${month}, ${year}`;
  };

  // Function to add ordinal suffix to a number
  const addOrdinalSuffix = num => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };
  const openImagePicker = async () => {
    const result = await launchImageLibrary();
    setImgUrl(result?.assets[0].uri);
    setSelectedImage(true);
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {padding: 20};

  //render custom card
  const renderItem = ({item}) => (
    <CustomeCard
      title={item.title}
      imageSource={item.imageSource}
      date={item.date}
    />
  );
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTxt}>Logo</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Avatar.Image size={40} source={require('../images/avatar.jpg')} />
            <AntDesign name="down" size={15} color={colors.black}></AntDesign>
          </View>
        </View>

        <View style={{marginVertical: '4%'}}>
          <View>
            <Image
              source={{
                uri: 'https://img.freepik.com/free-photo/beautiful-shot-tree-savanna-plains-with-blue-sky_181624-22049.jpg?w=996&t=st=1700934896~exp=1700935496~hmac=82b112794170088d7422ed6c9896ccb3226078ed42daef575617324682c104d7',
              }}
              style={styles.cardImage}
            />
          </View>
          <View style={styles.overlay}>
            <View style={styles.content}>
              <View>
                <Text style={styles.text} variant="headlineSmall">
                  Hi! Nabiya
                </Text>
              </View>
              <View>
                <Text style={styles.text} variant="bodyLarge">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>
              </View>
              <View>
                <Button
                  buttonColor={colors.purple}
                  mode="contained"
                  onPress={showModal}>
                  Add Check In
                </Button>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            alignSelf: 'flex-start',
          }}>
          <Text variant="headlineSmall">Added CheckIns</Text>
        </View>
        {loading && <ActivityIndicator size="large" animating={loading} />}
        <View>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.title} // Assuming each item has a unique title
          />
        </View>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}>
            <Card>
              <Appbar.Header theme={{colors: colors.purple}}>
                <Appbar.Content title="Add Check In" />

                <Appbar.Action icon="close" onPress={_handleclose} />
              </Appbar.Header>

              <Card.Content style={styles.input}>
                <Text variant="titleMedium">Title</Text>
                <TextInput
                  placeholder="Enter Title"
                  mode="outlined"
                  value={text}
                  onChangeText={text => setText(text)}
                />
              </Card.Content>
              <Card.Content>
                <Text variant="titleMedium">Upload Image</Text>
              </Card.Content>
              <Card.Content>
                <TouchableOpacity
                  style={styles.imageUpload}
                  onPress={openImagePicker}>
                  <AntDesign
                    name="inbox"
                    size={50}
                    color={colors.purple}></AntDesign>
                  <View style={styles.uploadText}>
                    <Text variant="titleSmall">
                      Click or drag file to this area to upload image
                    </Text>
                    <Text theme={{colors: colors.purple}} variant="labelSmall">
                      Support for a single or bulk upload. Strictly prohibit
                      from uploading company data or other band files
                    </Text>
                  </View>
                </TouchableOpacity>
                {imgUrl && (
                  <Image
                    source={{uri: imgUrl}}
                    style={{width: 30, height: 30}}
                  />
                )}
              </Card.Content>
              <ActivityIndicator animating={saveData} />
              <Card.Actions>
                <Button onPress={_handleclose}>Cancel</Button>
                <Button onPress={addCheckIn}>Add</Button>
              </Card.Actions>
            </Card>
          </Modal>
        </Portal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('2%'),
    backgroundColor: colors.white,
  },
  image: {
    marginTop: hp('2%'),
    width: wp('90%'), // Set your desired width
    height: hp('32%'), // Set your desired height
    resizeMode: 'cover', // or 'contain' or 'stretch' as per your requirement
    borderRadius: Size(3), // Optional: add border radius to the image
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: Size(3),
  },
  subtext: {
    color: 'white',
    fontSize: Size(1.5),
  },
  textView: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black color with 50% transparency
    borderRadius: Size(3), // Optional: add border radius to the overlay
    padding: Size(5),
    marginTop: hp('2%'),
    marginLeft: hp('2%'),
    marginRight: hp('2%'),
  },
  checkInBtn: {
    backgroundColor: 'red',
    borderRadius: 5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',

    height: hp('35%'),
    borderRadius: hp('2%'),
  },

  cardImage: {
    height: hp('35%'),
    overflow: 'hidden',
    borderRadius: hp('2%'),
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: wp('4%'),
  },
  text: {color: 'white'},
  input: {
    marginVertical: hp('3%'),
  },
  imageUpload: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Size(2),
    borderRadius: hp('1%'),
    marginTop: hp('1%'),
  },
  uploadText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: hp('2%'),
    paddingHorizontal: hp('2.5%'),
    paddingVertical: hp('1%'),
    elevation: 3,
  },
  headerTxt: {
    backgroundColor: colors.purple,
    padding: hp('0.5%'),
    color: colors.white,
  },
});

export default CheckIn;
