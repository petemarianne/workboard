import React, { useState } from 'react';
import { TextItem, ImageItem } from './interfaces';
import { ItemsContext } from './context/items-content';
import './App.scss';
import { Sidebar, Workarea } from './components';
import { Button } from '@material-ui/core';

const App: React.FC = (): JSX.Element => {
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);

  return (
    <div className='App'>
        WorkBoard
        <ItemsContext.Provider value={{texts, images, setImages, setTexts}}>
            <div className='areas-wrapper'>
                <Sidebar />
                <Workarea />
            </div>
            <Button color='primary' variant='contained' className='button' onClick={() => {setTexts([]); setImages([]);}}>Reset</Button>
        </ItemsContext.Provider>
    </div>
  );
}

export default App;
