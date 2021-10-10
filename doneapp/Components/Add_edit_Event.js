//Vi importerer React fra react native
import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ScrollView,
    SafeAreaView,
} from 'react-native';
//Vi aktiverer Firebase
import firebase from 'firebase';

//Vi importerer useEffect og useState
import {useEffect, useState} from "react";

//Vi laver vores add_edit_event component
const Add_edit_Event = ({navigation,route}) => {
    //Vi opretter en en start state, med tomme værdier
    const initialState = {
        event_navn: '',
        lokation: '',
        dato: '',
        invitations_tekst: ''
    };

    // Vi sætter vores nye events som værende vores start state med tomme værdier
    const [newEvent,setNewEvent] = useState(initialState);

    // Vi sender TRUE tilbage hvis vi er routet på Edit Event siden
    const isEditEvent = route.name === "Edit Event";

    //Vi laver vores useEffect funktion
    useEffect(() => {
        //Hvis vi er isEditEvent definerer vi event parametrene fra event og sætter det som vores nye event
        if(isEditEvent){
            const Event = route.params.Event[1];
            setNewEvent(Event)
        }
        //Fjerner den indtastede data og går tilbage til start state
        return () => {
            setNewEvent(initialState)
        };
    }, []);
    //Vi definerer vores changeTextInput
    const changeTextInput = (name,event) => {
        setNewEvent({...newEvent, [name]: event});
    }

    const handleSave = () => {

        const { event_navn, lokation, dato, invitations_tekst } = newEvent;
        //Tjekker om alle felterne er udfyldt
        if(event_navn.length === 0 || lokation.length === 0 || dato.length === 0 || invitations_tekst.length === 0 ){
            return Alert.alert('Udfyld venligst alle felter');
        }

        //Vi opdaterer vores firebase hvis vi ændrer et event
        if(isEditEvent){
            const id = route.params.event[0];
            try {
                firebase
                    .database()
                    .ref(`/Events/${id}`)
                    // Vi bruger update funktionaliteten, så felterne med ny information er de eneste der ændres
                    .update({ event_navn, lokation, dato, invitations_tekst });
                Alert.alert("Din info er nu opdateret");
                const Event = [id,newEvent]
                navigation.navigate("Event Details",{Event});
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
        // Ellers gemmer vi et nyt event
        }else{

            try {
                firebase
                    .database()
                    .ref('/Events/')
                    .push({ event_navn, lokation, dato, invitations_tekst });
                Alert.alert(`Saved`);
                setNewEvent(initialState)
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
        }

    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {
                    Object.keys(initialState).map((key,index) =>{
                        return(
                            <View style={styles.row} key={index}>
                                <Text style={styles.label}>{key}</Text>
                                <TextInput
                                    value={newEvent[key]}
                                    onChangeText={(event) => changeTextInput(key,event)}
                                    style={styles.input}
                                />
                            </View>
                        )
                    })
                }
                {/*Hvis vi er inde på edit Event, vis save changes i stedet for add Event*/}
                <Button title={ isEditEvent ? "Save changes" : "Add Event"} onPress={() => handleSave()} />
            </ScrollView>
        </SafeAreaView>
    );
}

//Vi eksporterer vores add edit event component
export default Add_edit_Event;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        height: 30,
        margin: 10,
    },
    label: {
        fontWeight: 'bold',
        width: 100
    },
    input: {
        borderWidth: 1,
        padding:5,
        flex: 1
    },
});
