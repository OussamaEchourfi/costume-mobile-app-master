import React from 'react';
import { View } from 'react-native';

const Spacer = ({ height = 10, width }) => (
    <View style={{ height, width }} />
);

export default Spacer;