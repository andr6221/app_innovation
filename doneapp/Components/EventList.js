
import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import firebase from 'firebase';
import {useEffect, useState} from "react";

//Laver vores event list
const EventList = ({navigation}) => {

    const [events,setEvents] = useState();

    useEffect(() => {
        if(!events) {
            firebase
                .database()
                .ref('/Events')
                .on('value', snapshot => {
                        setEvents(snapshot.val())
                });
        }
    },[]);

    if (!events) {
        return <Text>Loading...</Text>;
    }

   const handleSelectEvent = id => {
        //Vi sørger for at objekt id'et på eventet er det rigtige der vælges når man trykker på et event
        const event = Object.entries(events).find( event => event[0] === id /*id*/)
        navigation.navigate('Event Details', { event });
    };

    // Vi laver array som flatlist kan håntere af vores value og keys for events
    const eventArray = Object.values(events);
    const eventKeys = Object.keys(events);

    return (
        <FlatList
            data={eventArray}
            keyExtractor={(item, index) => eventKeys[index]}
            renderItem={({ item, index }) => {
                return(
                    <TouchableOpacity style={styles.container} onPress={() => handleSelectEvent(eventKeys[index])}>
                        <Text>
                            {item.event_navn} {item.dato}
                        </Text>
                    </TouchableOpacity>
                )
            }}
        />
    );
}

export default EventList;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderRadius:10,
        margin: 5,
        padding: 5,
        height: 50,
        justifyContent:'center'
    },
    label: { fontWeight: 'bold' },
});
