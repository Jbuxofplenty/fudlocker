import React, { Fragment, Component } from "react";
import { Modal, View, StyleSheet, Text } from "react-native";
import Button from "./Button";

class NativeModal extends Component {
  state = {
    modalVisible: false
  };

  openModal = () => this.setState({ modalVisible: true });
  closeModal = () => this.setState({ modalVisible: false });

  render() {
    return (
      <Fragment>

      </Fragment>
    );
  }
}

export default NativeModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCDCDC",
    borderRadius: 4,
    borderColor: "#C0C0C0",
    borderWidth: 2,
    marginHorizontal: 60,
    marginVertical: 120
  },
  description: {
    padding: 20,
    fontSize: 18
  }
});