
import * as React from 'react';
import { View, Text, Platform, FlatList, StyleSheet, Button, Alert } from 'react-native';
import firebase from 'firebase';
import {useEffect, useState} from "react";

const EventDetails = ({route,navigation}) => {
    const [event,setEvent] = useState({});

    useEffect(() => {
        //Vi fetcher vores indtastede oplysninger
        setEvent(route.params.event[1]);

        //Tømmer vores eventOplysninger
        return () => {
            setEvent({})
        }
    });

    const handleEdit = () => {
        //Sender vores event objekt med videre når vi går til edit event
        const event = route.params.event;
        navigation.navigate('Edit Event', { event });
    };

    // Vi spørger brugeren om han er sikker
    const confirmDelete = () => {
        /*Er det mobile?*/
        if(Platform.OS ==='ios' || Platform.OS ==='android'){
            Alert.alert('Are you sure?', 'Do you want to delete the event?', [
                { text: 'Cancel', style: 'cancel' },
                // Vi bruger this.handleDelete som eventHandler til onPress
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete() },
            ]);
        }
    };

    // Vi laver vores handler for delete
    const  handleDelete = () => {
        const id = route.params.event[0];
        try {
            firebase
                .database()
                // Vi sætter bilens ID ind i stien
                .ref(`/Events/${id}`)
                // Og fjerner data fra den sti
                .remove();
            // Og går tilbage når det er udført
            navigation.goBack();
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    //VHvis ingen data hvis der ikke er noget event
    if (!event) {
        return <Text>Ingen data</Text>;
    }

    //Vis alle vores events
    return (
        <View style={styles.container}>
            <Button title="Edit" onPress={ () => handleEdit()} />
            <Button title="Delete" onPress={() => confirmDelete()} />
            {
                Object.entries(event).map((item,index)=>{
                    return(
                        <View style={styles.row} key={index}>
                            {/*Vores event keys navn*/}
                            <Text style={styles.label}>{item[0]} </Text>
                            {/*Vores event values navne */}
                            <Text style={styles.value}>{item[1]}</Text>
                        </View>
                    )
                })
            }
        </View>
    );
}

//Eksporter event detaljerne
export default EventDetails;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start' },
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: { width: 100, fontWeight: 'bold' },
    value: { flex: 1 },
});
