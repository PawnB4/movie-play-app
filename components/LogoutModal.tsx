import { Modal, View, Text, StyleSheet, Pressable } from "react-native";

const LogoutModal = ({
  modalVisible,
  setModalVisible,
  text,
  onAccept,
  onCancel,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      presentationStyle="overFullScreen"
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{text}</Text>
          <View style={styles.dobles}>
            <Pressable
              style={[styles.button1, styles.buttonClose]}
              onPress={() => {
                onCancel();
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button1, styles.buttonClose]}
              onPress={() => {
                onAccept();
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Accept</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "#2B2930",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button1: {
    borderRadius: 20,
    padding: 13,
    elevation: 3,
  },
  buttonOpen: {
    backgroundColor: "#141218",
  },
  buttonClose: {
    backgroundColor: "#141218",
  },
  textStyle: {
    color: "#C5B3F2",
    fontWeight: "bold",
    textAlign: "left",
  },
  modalText: {
    fontSize: 18,
    color: "#E6E0E9",
    marginBottom: 30,
    textAlign: "left",
  },
  dobles: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
  },
});
