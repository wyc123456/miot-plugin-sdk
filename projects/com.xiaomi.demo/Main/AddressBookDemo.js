import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
} from 'react-native';


export default class AddressBookDemo extends React.Component {

  constructor() {
    super();
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds,
    };
  };

  componentWillMount() {

  }

  componentDidMount() {
      var Contacts = require('react-native-contacts');
    // var newPerson = {
    //     lastName: "Nietzsche",
    //     firstName: "Friedrich",
    //     emailAddresses: [{
    //       label: "work",
    //       email: "mrniet@example.com",
    //     }],
    //   }

    // AddressBook.addContact(newPerson, (err) => { /*...*/ })
    
    Contacts.checkPermission((err, permission) => {
      // AddressBook.PERMISSION_AUTHORIZED || AddressBook.PERMISSION_UNDEFINED || AddressBook.PERMISSION_DENIED
      if (permission === 'undefined') {
        Contacts.requestPermission((err, permission) => {
          // ...
        });
      }
      if (permission === 'authorized') {
        // yay!
        Contacts.getAll((err, contacts) => {
          console.log(err, contacts);
          //update the first record
          // let someRecord = contacts[0]
          // someRecord.emailAddresses.push({
          //   label: "junk",
          //   email: "mrniet+junkmail@test.com",
          // })
          // Contacts.updateContact(someRecord, (err) => { /*...*/ })
    
          //delete the second record
          // Contacts.deleteContact(contacts[1], (err) => { /*...*/ })
          this.setState({dataSource: this.state.dataSource.cloneWithRows(contacts)});
        });
      }
      if (permission === 'denied') {
        // x.x
        alert("通讯录未授权")
      }
      console.log(permission);
    });
  }

  render() {
    return (
      <View>
        <ListView style={styles.list} dataSource={this.state.dataSource}
                  renderRow={this._renderRow.bind(this)}/>
      </View>
    );
  }

  _renderRow(rowData, sectionID, rowID) {
    var name = rowData.familyName ? rowData.familyName : '';
    var tels = rowData.phoneNumbers;
    if(tels[0]) {
      var tel = tels[0].number;
    }else {
      var tel = 'none-empty'
    }
    return (
      <View>
        <View style={styles.rowContainer}>
          <Text
            style={styles.title}>{name + rowData.givenName + tel}</Text>
        </View>
        <View style={styles.separator}></View>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 0,
    marginTop: 64,
  },

  rowContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flex: 1,
    padding: 20,
  },
  list: {
    alignSelf: 'stretch',
  },

  title: {
    fontSize: 17,
    alignItems: 'center',
    flex: 1,
  },
  subArrow: {
    width: 9,
    height: 18,
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd',
    marginLeft: 20,
    marginRight: 20,
  },
});
