import React, { useState } from 'react';

export const HomeContext = React.createContext({});

export default (props) => {
    const [type, setType] = useState('add')
    return {
        type, setType
    }

}