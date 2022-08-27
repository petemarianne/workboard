import React, { createContext } from 'react';
import { TextItem, ImageItem } from '../interfaces';

interface DefaultItemsInterface {
    images: ImageItem[],
    setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>,
    texts: TextItem[],
    setTexts:  React.Dispatch<React.SetStateAction<TextItem[]>>,
}

const defaultItemsInterface: DefaultItemsInterface = {
    images: [],
    setImages: () => {},
    texts: [],
    setTexts: () => {},
};

export const ItemsContext = createContext(defaultItemsInterface);
